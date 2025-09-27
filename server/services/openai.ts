import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function generateChatResponse(messages: ChatMessage[]): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response.";
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    if (error.code === 'insufficient_quota') {
      throw new Error("OpenAI API quota exceeded. Please check your billing settings.");
    } else if (error.code === 'invalid_api_key') {
      throw new Error("Invalid OpenAI API key. Please check your configuration.");
    }
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

export async function generateImage(prompt: string): Promise<{ url: string }> {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return { url: response.data[0].url || "" };
  } catch (error: any) {
    console.error("DALL-E API error:", error);
    if (error.code === 'insufficient_quota') {
      throw new Error("OpenAI API quota exceeded for image generation.");
    }
    throw new Error(`Image generation error: ${error.message}`);
  }
}

export async function analyzeCode(code: string, language: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a code analysis expert. Analyze the provided code and explain what it does, identify potential issues, and suggest improvements."
        },
        {
          role: "user",
          content: `Analyze this ${language} code:\n\n${code}`
        }
      ],
      temperature: 0.3,
    });

    return response.choices[0].message.content || "Unable to analyze the code.";
  } catch (error: any) {
    console.error("Code analysis error:", error);
    throw new Error(`Code analysis error: ${error.message}`);
  }
}
