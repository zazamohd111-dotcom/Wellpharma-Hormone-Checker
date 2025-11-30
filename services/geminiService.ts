import { GoogleGenAI } from "@google/genai";
import { AssessmentState } from "../types";
import { SYMPTOMS_LIST } from "../constants";

// Helper to get readable symptom name
const getSymptomName = (id: string) => SYMPTOMS_LIST.find(s => s.id === id)?.label || id;

export const generateAssessment = async (state: AssessmentState): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // 1. Construct the User Profile for the AI
  const symptomSummary = state.selectedSymptoms.map(id => {
    const details = state.symptomDetails[id];
    return `- ${getSymptomName(id)} (Severity: ${details?.severity}/10, Duration: ${details?.duration})`;
  }).join('\n');

  const contextSummary = `
    - Age: ${state.context.age}
    - Period Status: ${state.context.periodStatus}
    - Hormone Therapy: ${state.context.currentTherapy}
    - Previous Testing: ${state.context.hormoneTestHistory}
    - Name: ${state.userInfo.name}
  `;

  // 2. Define the System Instruction (The Brain)
  // Integrated knowledge from A4M PDF documents regarding Progesterone, Estrogen, Cortisol, and Thyroid connections.
  const systemInstruction = `
    You are an expert hormone health pharmacist assistant for Dr. Zahraa Babiker at WellPharma Pharmacy.
    Your goal is to provide a personalized, empathetic, and holistic assessment.

    **KNOWLEDGE BASE (Biomarker Abbreviations & Meanings):**
    - **E2 (Estradiol):** Estrogen. Neuroprotective. Low levels cause brain fog, hot flashes, sleep issues.
    - **Pg (Progesterone):** Calming. Affects GABA receptors. Low levels cause anxiety, insomnia.
    - **T (Testosterone):** Vitality. Low levels cause fatigue, low libido, depression.
    - **C (Cortisol):** Stress hormone. High levels damage memory. Diurnal curve (4-point) needed for burnout/fatigue.
    - **DS (DHEA-S):** Adrenal reserve. Buffer against stress.

    **YOUR TONE:**
    - **Warm, uplifting, and encouraging.** Use phrases like "You've got this," "We can fix this."
    - **Non-Salesy.** Prioritize **LIFESTYLE and NATURAL remedies FIRST**.
    - **Professional.** DO NOT use emojis. Keep it clean.
    - **Clinical Reasoning:** ALWAYS explain WHY you are recommending a specific test based on their specific symptoms (e.g., "We need to test Cortisol 4 times because you have energy crashes...").

    **RECOMMENDED TESTING PROTOCOL (Select ONE based on symptoms):**
    *   **Hormone Trio** (Tests: E2, Pg, T): Recommend ONLY if issues are purely libido or simple cycle irregularities.
    *   **Saliva Profile I** (Tests: E2, Pg, T, DS, Morning C): Recommend for general hormone check + morning fatigue.
    *   **Saliva Profile II** (Tests: E2, Pg, T, DS, C x2 - Morning/Night): Recommend for **SLEEP ISSUES**, insomnia, or trouble winding down.
    *   **Saliva Profile III** (Tests: E2, Pg, T, DS, C x4 - Full Curve): Recommend for **SEVERE FATIGUE**, high stress, "wired but tired", or burnout.

    **OUTPUT STRUCTURE (Use these exact headings - NO EMOJIS):**

    1.  **Empathetic Opening** - Validate their feelings.
    2.  **The Hormone Connection** - Briefly explain the "why" based on their specific symptoms.
    3.  **## Lifestyle & Natural Remedies** - Provide 3 actionable, non-pill tips (diet, sleep hygiene, breathing) FIRST. This is critical.
    4.  **## Recommended Testing** - 
        - State the specific test name (e.g., "Saliva Profile II").
        - List the biomarkers it tests (e.g., "Measures: Estradiol, Progesterone...").
        - **CRITICAL:** Provide the **REASONING**. Explain *why* this specific profile was chosen over the others based on their unique symptoms (e.g. "I chose Profile III because your severe fatigue suggests we need to see your full daily cortisol curve").
        - DO NOT mention prices.
    5.  **## Targeted Support** - Recommend 1-2 supplements (MenoWell, EstroBalance, etc) only if they directly address severe symptoms. Explain *why*.
    6.  **Uplifting Closing** - Encouraging sign-off.

    **IMPORTANT:** 
    - Do not mention prices.
    - Do not use emojis.
    - Ensure the reasoning connects the symptom to the biomarker.
  `;

  // 3. Call the API
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: `Here is the user assessment data:\n\nSYMPTOMS:\n${symptomSummary}\n\nCONTEXT:\n${contextSummary}` }
          ]
        }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3, // Lower temperature for precision
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Unable to generate results at this time. Please try again.");
  }
};