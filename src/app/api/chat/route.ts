import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    if (!lastUserMessage) {
      return new Response("Empty message", { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: lastUserMessage,
      config: {
        systemInstruction: "You are Weathia Assistant, an expert AI weather consultant. Always respond in English. Be concise, direct, and well-structured. Keep your response under 500 characters and use clear line breaks."
      }
    });

    const aiReply = response.text || "No response generated.";

    return new Response(aiReply, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });

  } catch (error: any) {
    console.error("Gemini error:", error);
    return new Response(error?.message || 'Internal Server Error', { status: 500 });
  }
}