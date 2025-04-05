from flask import Flask, request, jsonify
import re
import json
import pandas as pd
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.docstore.document import Document
from math import radians, cos, sin, asin, sqrt

app = Flask(__name__)

# Haversine formula to calculate distance between two geographic points
def haversine(lon1, lat1, lon2, lat2):
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    r = 6371
    return c * r

# Initialize embeddings
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Sample DataFrames
patient_df = pd.DataFrame({
    "patient_id": [1, 2],
    "name": ["John Doe", "Jane Smith"],
    "age": [45, 30],
    "bmi": [27.5, 22.0]
})

hospital_df = pd.DataFrame({
    "hospital_id": [101, 102, 103],
    "name": ["City Hospital", "General Medical Center", "Health Clinic"],
    "location": ["Nagpur, India", "Nagpur, India", "Nagpur, India"],
    "specialty": ["Gastroenterology, Cardiology", "Gastroenterology", "General"],
    "beds_available": [50, 30, 10],
    "latitude": [21.1458, 21.1350, 21.1500],
    "longitude": [79.0882, 79.0750, 79.0950]
})

doctor_df = pd.DataFrame({
    "Doctor ID": [201, 202, 203],
    "Name": ["Dr. Alice", "Dr. Bob", "Dr. Charlie"],
    "Specialization": ["Gastroenterologist", "Gastroenterologist", "General Physician"],
    "Hospital ID": [101, 102, 103]
})

appointment_df = pd.DataFrame({
    "appointment_id": [301, 302, 303, 304],
    "patient_id": [1, 1, 2, 2],
    "doctor_id": [201, 202, 201, 203],
    "diagnosis": ["Severe abdominal pain", "Vomiting", "Abdominal pain", "Fever"]
})

# Prepare FAISS vector stores
def prepare_vector_store(df, content_format, metadata_key):
    documents = [
        Document(page_content=content_format(row), metadata={metadata_key: row[metadata_key]})
        for _, row in df.iterrows()
    ]
    return FAISS.from_documents(documents, embedding_model)

patient_vectorstore = prepare_vector_store(patient_df,
    lambda row: f"Patient ID: {row['patient_id']}, Name: {row['name']}, Age: {row['age']}, BMI: {row['bmi']}",
    "patient_id")

hospital_vectorstore = prepare_vector_store(hospital_df,
    lambda row: f"Hospital ID: {row['hospital_id']}, Name: {row['name']}, Location: {row['location']}, "
                f"Specialty: {row['specialty']}, Beds Available: {row['beds_available']}",
    "hospital_id")

doctor_vectorstore = prepare_vector_store(doctor_df,
    lambda row: f"Doctor ID: {row['Doctor ID']}, Name: {row['Name']}, Specialization: {row['Specialization']}, "
                f"Hospital ID: {row['Hospital ID']}",
    "Doctor ID")

# Retrieve context
def retrieve_context(query):
    patient_results = patient_vectorstore.similarity_search(query, k=1)
    hospital_results = hospital_vectorstore.similarity_search(query, k=50)
    doctor_results = doctor_vectorstore.similarity_search(query, k=2)

    return {
        "patient_context": patient_results[0].page_content if patient_results else "No patient context found",
        "hospital_results": hospital_results,
        "doctor_context": [doc.page_content for doc in doctor_results]
    }

# Generate response
def generate_response(query, context, user_location):
    condition_pattern = r"with\s+(.+?)(?:\s+and\s+(.+?))?(?=\s+(?:in|recommend|\.|$))"
    matches = re.search(condition_pattern, query.lower())
    conditions = [matches.group(1).strip()] if matches else ["Unknown condition"]
    if matches and matches.group(2):
        conditions.append(matches.group(2).strip())

    specialties = re.findall(r"recommend\s+a\s+([a-zA-Z\s]+)(?=\s+and|\s*,|\s*$)", query.lower())
    specialties = [spec.strip().title() for spec in specialties] or ["General"]

    severity_dict = {}
    for condition in conditions:
        matched_appointments = appointment_df[appointment_df['diagnosis'].str.lower().str.contains(condition.lower(), na=False)]
        severity_score = max(1, min(10, 10 - (len(matched_appointments) // 5))) if not matched_appointments.empty else "5/10"
        severity_dict[condition] = f"{severity_score}/10"

    max_severity = max([int(score.split('/')[0]) for score in severity_dict.values()])
    distance_threshold = 10 if max_severity >= 8 else 30

    filtered_hospitals = []
    for hospital_doc in context["hospital_results"]:
        hospital_id = hospital_doc.metadata["hospital_id"]
        hospital_row = hospital_df[hospital_df["hospital_id"] == hospital_id].iloc[0]
        distance = haversine(user_location[1], user_location[0], hospital_row["longitude"], hospital_row["latitude"])
        if distance > distance_threshold or hospital_row["beds_available"] <= 0:
            continue
        if not any(spec.lower() in hospital_row["specialty"].lower() for spec in specialties):
            continue
        filtered_hospitals.append(hospital_row)

    top_hospital = filtered_hospitals[0] if filtered_hospitals else None
    return {
        "predicted_conditions": conditions,
        "severity": severity_dict,
        "recommended_hospitals": [hosp["name"] for hosp in filtered_hospitals[:10]],
        "hospital_recommendation": top_hospital["name"] if top_hospital else "No suitable hospital found",
        "hospital_justification": f"Recommended based on proximity and appointment history for {', '.join(conditions)}",
        "real_time_navigation": f"Navigate to {top_hospital['location']}" if top_hospital else "N/A"
    }

# Flask Routes
@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.json
        query = data.get("query")
        user_location = data.get("user_location")

        if not query or not user_location:
            return jsonify({"error": "Query and user_location are required"}), 400

        context = retrieve_context(query)
        response = generate_response(query, context, tuple(user_location))
        return jsonify({"query": query, "context": context, "response": response})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
