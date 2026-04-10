
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, ChatMessage } from '../types';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    isLegalDocument: {
      type: Type.BOOLEAN,
      description: "True if the document is determined to be a legal document, false otherwise."
    },
    summary: {
      type: Type.STRING,
      description: "A concise 2-3 sentence summary of the document's purpose and main terms. Should be empty if not a legal document."
    },
    pros: {
      type: Type.ARRAY,
      description: "A list of positive aspects, strengths, or clauses that protect the user's interests. Should be empty if not a legal document.",
      items: { type: Type.STRING }
    },
    cons: {
      type: Type.ARRAY,
      description: "A list of negative aspects, risks, ambiguities, or clauses that could be disadvantageous. Should be empty if not a legal document.",
      items: { type: Type.STRING }
    },
    keyClauses: {
      type: Type.ARRAY,
      description: "A list of the most important legal clauses found in the document (e.g., Termination, Indemnity, Jurisdiction).",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "The name of the clause." },
          description: { type: Type.STRING, description: "A brief explanation of what the clause says in this document." }
        },
        required: ["name", "description"]
      }
    },
    riskLevel: {
      type: Type.STRING,
      enum: ["Low", "Medium", "High"],
      description: "An overall assessment of the legal risk posed by this document to the user."
    },
    nextSteps: {
      type: Type.ARRAY,
      description: "A list of actionable steps the user should take based on the analysis (e.g., 'Consult a lawyer', 'Negotiate clause 4', 'Sign and notarize').",
      items: { type: Type.STRING }
    },
    language: {
      type: Type.STRING,
      description: "The primary language detected in the document (e.g., 'English', 'Hindi', 'Tamil', etc.)."
    },
    reasoning: {
       type: Type.STRING,
       description: "A brief, one-sentence explanation for why the document is not considered a legal document. This should only be populated if isLegalDocument is false."
    },
    extractedText: {
      type: Type.STRING,
      description: "The full text extracted from the document (especially if it was an image or PDF). This is used for further analysis and chat context."
    },
    clauses: {
      type: Type.ARRAY,
      description: "A detailed breakdown of the document into logical clauses, with risk analysis and suggested rewrites for each.",
      items: {
        type: Type.OBJECT,
        properties: {
          originalText: { type: Type.STRING, description: "The exact text of the clause from the document." },
          riskLevel: { type: Type.STRING, enum: ["High", "Medium", "Low", "Safe"], description: "The risk level of this specific clause." },
          analysis: { type: Type.STRING, description: "Why this clause is rated at this risk level. If a playbook was provided, explain how it deviates from the playbook." },
          suggestedRewrite: { type: Type.STRING, description: "A proposed rewrite to make the clause safer or compliant with the playbook. Omit if Safe." }
        },
        required: ["originalText", "riskLevel", "analysis"]
      }
    }
  },
  required: ["isLegalDocument"],
};

interface AnalyzeDocumentParams {
  documentText: string | null;
  documentFile: {
    data: string;
    mimeType: string;
  } | null;
  playbookText?: string | null;
  playbookFile?: {
    data: string;
    mimeType: string;
  } | null;
}

export async function analyzeDocument({ documentText, documentFile, playbookText, playbookFile }: AnalyzeDocumentParams): Promise<AnalysisResult> {
  const basePrompt = `
    Analyze the following document to determine if it is a legal document. The document is provided either as text, an image, or a PDF. If it's an image or PDF, first perform OCR/parsing to extract the text.
    
    1. First, decide if the content represents a legal agreement, contract, notice, or other formal legal text.
    2. If it is a legal document, provide:
       - A concise summary.
       - A list of its "pros" (strengths, protective clauses).
       - A list of its "cons" (risks, ambiguities, unfavorable terms).
       - Identify the most important "keyClauses" and explain them.
       - Assign an overall "riskLevel" (Low, Medium, or High) based on the cons and potential liabilities.
       - Provide 3-5 actionable "nextSteps" for the user.
       - Detect the "language" of the document.
       - **CRITICAL**: Break the document down into logical "clauses". For each clause, provide the original text, assign a risk level (High, Medium, Low, Safe), provide an analysis of the risk, and if it's not Safe, provide a "suggestedRewrite" to protect the user.
    3. If a "Playbook" or "Standard Agreement" is provided below, you MUST cross-reference the target document against it. Flag any deviations from the Playbook as risks, and suggest rewrites that align with the Playbook's standards.
    4. If it is NOT a legal document, simply state why in the reasoning field. Do not provide pros, cons, summary, clauses, or risk level.
    5. ALWAYS extract the full text of the document and return it in the "extractedText" field.
    
    Return the analysis in the specified JSON format.
  `;

  let parts: any[] = [{ text: basePrompt }];

  if (playbookText) {
    parts.push({ text: `\n\n--- PLAYBOOK / STANDARD AGREEMENT TEXT ---\n${playbookText}\n--- END PLAYBOOK ---\n\n` });
  } else if (playbookFile) {
    parts.push({ text: `\n\n--- PLAYBOOK / STANDARD AGREEMENT FILE ---\n` });
    parts.push({ inlineData: { mimeType: playbookFile.mimeType, data: playbookFile.data } });
    parts.push({ text: `\n--- END PLAYBOOK ---\n\n` });
  }

  if (documentText) {
    parts.push({ text: `\n\n--- TARGET DOCUMENT TEXT ---\n${documentText}\n--- END TARGET DOCUMENT ---\n` });
  } else if (documentFile) {
    parts.push({ text: `\n\n--- TARGET DOCUMENT FILE ---\n` });
    parts.push({ inlineData: { mimeType: documentFile.mimeType, data: documentFile.data } });
    parts.push({ text: `\n--- END TARGET DOCUMENT ---\n` });
  } else {
    throw new Error("No document content provided for analysis.");
  }

  const contents = { parts };


  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result as AnalysisResult;

  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    throw new Error(`Failed to get a valid analysis from the AI model. ${error?.message || ''}`);
  }
}

export async function chatWithAssistant(
  message: string,
  history: ChatMessage[],
  documentContext?: string
): Promise<string> {
  const systemInstruction = `
    You are a specialized Legal Assistant with deep knowledge of Indian Law.
    
    Current Document Context:
    ${documentContext ? `The following text is extracted from the document uploaded by the user:\n---\n${documentContext}\n---` : 'No document has been uploaded yet.'}
    
    Instructions:
    1. If a document context is provided above, prioritize answering questions based on that specific document.
    2. If the user asks about clauses, terms, or specific details, look for them in the provided document text.
    3. If the document context is not sufficient or the question is general, use your broad knowledge of Indian Law (Constitution, IPC, CPC, etc.).
    4. You are MULTI-LINGUAL. If the user asks a question in an Indian language (Hindi, Tamil, Marathi, etc.), respond in that same language.
    5. ALWAYS include a disclaimer that you are an AI and this is not professional legal advice.
    6. Be professional, objective, and clear.
    7. If you are answering based on the document, mention that you are doing so.
  `;

  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction,
    },
    history: history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    })),
  });

  try {
    const response = await chat.sendMessage({ message });
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error in chatWithAssistant:", error);
    throw new Error("Failed to communicate with the legal assistant.");
  }
}
