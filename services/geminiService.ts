import { GoogleGenAI } from "@google/genai";
import { DataRow, ColumnDef } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeDataWithGemini = async (
  data: DataRow[],
  columns: ColumnDef[]
): Promise<string> => {
  try {
    // Limit data sample to avoid token limits, take top 50 rows or a representative sample
    const sampleData = data.slice(0, 50);
    const columnInfo = columns.map(c => `${c.headerName} (${c.type})`).join(', ');

    const prompt = `
      You are a senior data analyst. Analyze the following dataset and provide 3-5 key insights, trends, or anomalies.
      Be concise and professional. Use markdown for formatting.
      
      Columns: ${columnInfo}
      
      Data Sample (JSON):
      ${JSON.stringify(sampleData)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No insights could be generated.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Failed to generate insights. Please check your API key or try again later.";
  }
};
