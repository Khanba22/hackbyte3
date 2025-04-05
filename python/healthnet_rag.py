from google.colab import drive
drive.mount('/content/drive')

import pandas as pd
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.docstore.document import Document
from transformers import pipeline
import json
import re

# Read Data from CSV Files Using pd.read_csv
# Adjust file paths if necessary
patient_df = pd.read_csv("/content/drive/MyDrive/data/nagpur_patients.csv")
hospital_df = pd.read_csv("/content/drive/MyDrive/data/hospital_final.csv")
doctor_df = pd.read_csv("/content/drive/MyDrive/data/combined_doctors_data.csv")
appointment_df = pd.read_csv("/content/drive/MyDrive/data/appointment.csv")

"""# Preprocess Data for Embedding"""

# Preprocess Data for Embedding
patient_docs = [
    f"Patient ID: {row['Patient ID']}, Name: {row['Full Name']}, Age: {row['Age']}, Gender: {row['Gender']}, BMI: {row['BMI']}, Blood Group: {row['Blood Group']}, Location: {row['Location']}, Diagnosis: {appointment_df[appointment_df['patient_id'] == row['Patient ID']]['diagnosis'].iloc[0] if row['Patient ID'] in appointment_df['patient_id'].values else 'Unknown'}"
    for _, row in patient_df.iterrows()
]

hospital_docs = [
    f"Hospital ID: {row['hospital_id']}, Name: {row['name']}, Location: {row['location']}, Specialty: {row['specialty']}, Beds Available: {row['beds_available']}"
    for _, row in hospital_df.iterrows()
]

doctor_docs = [
    f"Doctor ID: {row['Doctor ID']}, Name: {row['Full Name']}, Hospital ID: {row['Hospital ID'] if pd.notna(row['Hospital ID']) else 'Unknown'}, Specialization: {row['Specialization']}"
    for _, row in doctor_df.iterrows()
]

"""# Create Embeddings with LangChain"""

# Create Embeddings with LangChain
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

patient_documents = [Document(page_content=doc) for doc in patient_docs]
hospital_documents = [Document(page_content=doc) for doc in hospital_docs]
doctor_documents = [Document(page_content=doc) for doc in doctor_docs]

patient_vectorstore = FAISS.from_documents(patient_documents, embedding_model)
hospital_vectorstore = FAISS.from_documents(hospital_documents, embedding_model)
doctor_vectorstore = FAISS.from_documents(doctor_documents, embedding_model)

"""# Retrieval Module (Similarity Search)"""

# Retrieval Module (Similarity Search)
def retrieve_context(query):
    patient_results = patient_vectorstore.similarity_search(query, k=1)
    hospital_results = hospital_vectorstore.similarity_search(query, k=1)
    doctor_results = doctor_vectorstore.similarity_search(query, k=2)  # Retrieve 2 doctors

    context = {
        "patient_context": patient_results[0].page_content,
        "hospital_context": hospital_results[0].page_content,
        "doctor_context": [doc.page_content for doc in doctor_results]
    }
    return context

"""# Generation Module (Fully Dynamic)"""

# Generation Module (Fully Dynamic)
generator = pipeline("text-generation", model="distilgpt2", max_new_tokens=150, device=-1)

def generate_response(query, context):
    prompt = (
        f"Given the following context:\n"
        f"Patient Context: {context['patient_context']}\n"
        f"Hospital Context: {context['hospital_context']}\n"
        f"Doctor Context: {context['doctor_context']}\n\n"
        f"Query: {query}\n\n"
        f"Extract the conditions from the query, recommend doctors based on the context, assess severity for each condition based on available data, suggest a hospital considering all conditions, and provide real-time navigation advice."
    )

    try:
        response_text = generator(prompt)[0]["generated_text"]
    except Exception as e:
        response_text = "Failed to generate response from LLM."

    result = {
        "predicted_conditions": [],
        "severity": {},
        "recommended_doctors": {},
        "hospital_recommendation": "",
        "hospital_justification": "",
        "real_time_navigation": ""
    }

    # Extract conditions from the query
    condition_pattern = r"with\s+(.+?)(?:\s+and\s+(.+?))?(?=\s+(?:in|recommend|\.|$))"
    matches = re.search(condition_pattern, query.lower())
    if matches:
        conditions = [matches.group(1).strip()]
        if matches.group(2):  # If there's a second condition after "and"
            conditions.append(matches.group(2).strip())
    else:
        conditions = ["Unknown condition"]

    # Infer conditions from specialties if vague terms are used
    specialties = re.findall(r"recommend\s+a\s+([a-zA-Z\s]+)(?=\s+and|\s*,|\s*$)", query.lower())
    specialties = [spec.strip().title() for spec in specialties]
    if "condition" in conditions[0].lower() or "issue" in conditions[0].lower():
        conditions = [f"{spec}-Related Condition" for spec in specialties] or ["Unknown condition"]
    result["predicted_conditions"] = conditions

    # Determine severity for each condition
    for condition in result["predicted_conditions"]:
        matched_appointments = appointment_df[appointment_df['diagnosis'].str.lower().str.contains(condition.lower().split('-')[0], na=False)]
        if not matched_appointments.empty:
            severity_score = max(1, min(10, 10 - (len(matched_appointments) // 5)))
            result["severity"][condition] = f"{severity_score}/10"
        else:
            bmi = float(re.search(r"BMI: (\d+\.?\d*)", context["patient_context"]).group(1))
            severity_score = max(1, min(10, int((bmi - 20) * 2)))
            result["severity"][condition] = f"{severity_score}/10"

    # Recommend doctors based on specialties
    for specialty in specialties:
        doctor = next((re.search(r"Name: (.*?)(?:,|$)", doc).group(1).strip()
                       for doc in context["doctor_context"]
                       if specialty.lower() in doc.lower()), None)
        result["recommended_doctors"][specialty] = doctor if doctor else "Not found in context"

    # Hospital recommendation logic
    hospital_specialty = re.search(r"Specialty: (.*?)(?:,|$)", context["hospital_context"]).group(1).strip()
    hospital_name = re.search(r"Name: (.*?)(?:,|$)", context["hospital_context"]).group(1).strip()
    beds_available = int(re.search(r"Beds Available: (\d+)", context["hospital_context"]).group(1))

    if beds_available >= 20 and all(any(spec.lower() in hospital_specialty.lower() for spec in specialties) for spec in specialties):
        result["hospital_recommendation"] = hospital_name
        result["hospital_justification"] = f"{hospital_name} has {beds_available} beds and covers {hospital_specialty}."
    else:
        multispecialty_options = hospital_df[(hospital_df["beds_available"] >= 20) &
                                             (hospital_df["specialty"].str.lower().apply(lambda x: all(any(spec.lower() in x for spec in specialties) for spec in specialties)))]
        if not multispecialty_options.empty:
            fallback_hospital = multispecialty_options.iloc[0]["name"]
            result["hospital_recommendation"] = fallback_hospital
            result["hospital_justification"] = f"{hospital_name} lacks coverage or beds ({beds_available}). Recommending {fallback_hospital} with {multispecialty_options.iloc[0]['beds_available']} beds."
        else:
            result["hospital_recommendation"] = hospital_name
            result["hospital_justification"] = f"{hospital_name} recommended despite limitations ({beds_available} beds, {hospital_specialty})."

    # Navigation
    hospital_location = re.search(r"Location: (.*?)(?:,|$)", context["hospital_context"]).group(1).strip()
    result["real_time_navigation"] = f"Head to {hospital_location}"

    return result

"""# RAG Pipeline with JSON Output"""

# RAG Pipeline with JSON Output
def rag_pipeline(query):
    context = retrieve_context(query)
    response = generate_response(query, context)

    output = {
        "query": query,
        "context": context,
        "response": response
    }
    return json.dumps(output, indent=2)

"""# Test the RAG System"""

# Test the RAG System
query = "Evaluate a 30-year-old male with severe abdominal pain and vomiting in Nagpur, recommend a gastroenterologist, assess severity, and suggest a hospital with immediate availability."
json_response = rag_pipeline(query)
print(json_response)

"""# Analytics Dashboard (JSON Output)"""

# Analytics Dashboard (JSON Output)
def analytics_dashboard():
    hospital_performance = hospital_df.groupby("name")["beds_available"].sum().to_dict()
    analytics_output = {
        "hospital_performance": {
            "date": "2025-03-14",
            "metrics": hospital_performance
        }
    }
    return json.dumps(analytics_output, indent=2)

# Run the analytics dashboard
analytics_json = analytics_dashboard()
print("\nAnalytics Dashboard:")
print(analytics_json)