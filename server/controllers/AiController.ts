import "dotenv/config"; // Ensure .env is loaded
import { Groq } from "groq-sdk";
import { format } from "path";

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;
if (!GROQ_API_KEY) {
  throw new Error("Missing GROQ_API_KEY in environment variables.");
}

const groq = new Groq({
  apiKey: GROQ_API_KEY,
});

export async function getAssessment(query: string) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
            You are an AI-powered medical assistant analyzing patient symptoms. Provide a structured JSON response with:
            
            - **severity** (integer, 1-10): Numerical severity level.
            - **response** (string): give out the response of the potential problems and advise the users how to have a first aid tips.
            - **category** (string): Medical category (e.g., 'cardio', 'muscular', 'bones', 'neurological').
            - **betterPrompt** (string): A detailed structured query for locating an appropriate hospital.

            ### Example Response:
            {
              "severity": 7,
              "response": "If experiencing chest pain, sit down and stay calm. Chew aspirin if not allergic. Seek emergency care if pain worsens.",
              "category": "cardio",
              "betterPrompt": "The patient is experiencing persistent chest pain, rated as severity 7. This may indicate a potential cardiovascular issue such as angina or early signs of a heart attack. The patient requires immediate evaluation by a cardiologist at a hospital with an emergency cardiac unit."
            }
          `,
        },
        {
          role: "user",
          content: query,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      response_format: { type: "json_object" },
    });

    // ✅ Ensure the response is JSON
    if (!chatCompletion.choices[0].message.content) {
      throw new Error("Invalid response: content is null or undefined.");
    }
    const responseData = JSON.parse(chatCompletion.choices[0].message.content);

    return {
      severity: responseData.severity,
      response: responseData.response,
      category: responseData.category,
      betterPrompt: responseData.betterPrompt,
    };
  } catch (error) {
    console.error("Error in getAssessment:", error);
    throw new Error("Failed to generate assessment.");
  }
}


