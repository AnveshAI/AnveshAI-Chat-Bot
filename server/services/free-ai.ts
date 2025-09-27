// Advanced AI service using Google Gemini 2.5 Pro
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI with API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function generateChatResponse(messages: ChatMessage[]): Promise<string> {
  try {
    // If no API key is provided, fallback to basic responses
    if (!process.env.GEMINI_API_KEY) {
      return getFallbackResponse(messages);
    }

    // Convert messages to Gemini format
    const systemPrompt = `You are Anvesh Chat Bot, an intelligent and helpful AI assistant. You are knowledgeable, conversational, and can help with a wide variety of topics including:

- Programming and coding in any language
- General questions and conversations
- Problem-solving and analysis
- Creative writing and brainstorming
- Technical explanations
- And much more

Respond in a helpful, friendly, and professional manner. If you're helping with code, provide clear explanations and well-formatted code examples. Be concise but thorough in your responses.`;

    // Prepare conversation history for Gemini
    let hasSystemMessage = false;
    const geminiMessages = messages.map(msg => {
      if (msg.role === "system") {
        hasSystemMessage = true;
        return { role: "user", parts: [{ text: msg.content }] };
      }
      return {
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      };
    });

    // Add default system prompt only if no system message exists
    if (!hasSystemMessage) {
      geminiMessages.unshift({
        role: "user",
        parts: [{ text: systemPrompt }]
      });
      geminiMessages.push({
        role: "model",
        parts: [{ text: "Hello! I'm Anvesh Chat Bot, your intelligent assistant. How can I help you today?" }]
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: geminiMessages,
      config: {
        maxOutputTokens: 2048,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });

    return response.text || "I apologize, but I couldn't generate a response. Please try again.";

  } catch (error: any) {
    console.error("Gemini AI error:", error);
    // Fallback to basic responses if AI fails
    return getFallbackResponse(messages);
  }
}

function getFallbackResponse(messages: ChatMessage[]): string {
  const lastMessage = messages[messages.length - 1];
  const content = lastMessage.content.toLowerCase();

  // Basic fallback responses
  if (content.includes('hello') || content.includes('hi')) {
    return "Hello! I'm Anvesh Chat Bot, your intelligent assistant. I can help with conversations, coding support, and much more. How can I assist you today?";
  }

  if (content.includes('thank') || content.includes('thanks')) {
    return "You're welcome! I'm here to help whenever you need assistance.";
  }

  if (content.includes('code') || content.includes('programming')) {
    return "I can help with coding! What programming language or specific problem are you working with?";
  }

  return "I'm here to help! Could you please be more specific about what you'd like assistance with?";
}

export async function analyzeCode(code: string, language: string): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return getBasicCodeAnalysis(code, language);
    }

    const prompt = `Please analyze this ${language} code and provide:
1. A brief overview of what it does
2. Code quality assessment
3. Potential improvements
4. Best practices recommendations
5. Any bugs or issues you notice

Here's the code:
\`\`\`${language}
${code}
\`\`\``;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return response.text || getBasicCodeAnalysis(code, language);

  } catch (error: any) {
    console.error("Code analysis error:", error);
    return getBasicCodeAnalysis(code, language);
  }
}

function getBasicCodeAnalysis(code: string, language: string): string {
  const lines = code.split('\n').length;
  const hasComments = code.includes('//') || code.includes('#') || code.includes('/*');
  const hasFunctions = code.includes('function') || code.includes('def ') || code.includes('=>');
  
  let analysis = `## Code Analysis (${language})\n\n`;
  analysis += `**Basic Stats:**\n`;
  analysis += `• Lines of code: ${lines}\n`;
  analysis += `• Contains comments: ${hasComments ? 'Yes' : 'No'}\n`;
  analysis += `• Contains functions: ${hasFunctions ? 'Yes' : 'No'}\n\n`;
  analysis += `**Recommendations:**\n`;
  analysis += `• Add comments to explain complex logic\n`;
  analysis += `• Use meaningful variable names\n`;
  analysis += `• Consider error handling\n`;

  return analysis;
}

export async function generateImage(prompt: string): Promise<{ url: string; error?: string }> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return { 
        url: "", 
        error: "Image generation requires an API key. Currently using basic fallback responses."
      };
    }

    // Note: Gemini 2.0 Flash supports image generation, but it's still in preview
    // For now, we'll provide helpful guidance
    return { 
      url: "", 
      error: `I can help you create images! For the prompt "${prompt}", I recommend using:

• **Free options:**
  - Craiyon.com (formerly DALL-E mini)
  - Leonardo.ai (free tier)
  - Stable Diffusion Online

• **Advanced options:**
  - DALL-E 3 via OpenAI
  - Midjourney
  - Adobe Firefly

Would you like me to help you refine your prompt or suggest specific techniques for better results?`
    };

  } catch (error: any) {
    return { 
      url: "", 
      error: "I encountered an error with image generation. Please try the suggested free alternatives above."
    };
  }
}