import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConversationSchema, insertMessageSchema } from "@shared/schema";
import { generateChatResponse, generateImage, analyzeCode } from "./services/free-ai";
import { fetchNews, searchNews } from "./services/free-news";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  // Get conversations for logged in user
  app.get("/api/conversations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.listConversationsByUser(userId);
      res.json(conversations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create conversation
  app.post("/api/conversations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertConversationSchema.parse({
        ...req.body,
        userId,
      });
      const conversation = await storage.createConversation(data);
      res.json(conversation);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get messages for a conversation (protected)
  app.get("/api/conversations/:id/messages", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      // Verify user owns the conversation
      const conversation = await storage.getConversation(id);
      if (!conversation || conversation.userId !== userId) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      const messages = await storage.getMessagesByConversation(id);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Send message and get AI response (protected)
  app.post("/api/conversations/:id/messages", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.user.claims.sub;

      if (!content || typeof content !== "string") {
        return res.status(400).json({ message: "Message content is required" });
      }

      // Check if conversation exists and user owns it
      const conversation = await storage.getConversation(id);
      if (!conversation || conversation.userId !== userId) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      // Save user message
      const userMessage = await storage.createMessage({
        conversationId: id,
        role: "user",
        content,
        metadata: null,
      });

      // Get conversation history for context
      const messages = await storage.getMessagesByConversation(id);
      const chatMessages = messages.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

      let assistantResponse = "";
      let metadata: any = null;

      // Check for special commands
      if (content.startsWith("/image ")) {
        const imagePrompt = content.slice(7).trim();
        if (imagePrompt) {
          try {
            const imageResult = await generateImage(imagePrompt);
            if (imageResult.error) {
              assistantResponse = `I can't generate images with free APIs, but here are some alternatives:\n\n${imageResult.error}`;
            } else {
              assistantResponse = `I've generated an image for you: "${imagePrompt}"`;
              metadata = { 
                type: "image", 
                imageUrl: imageResult.url, 
                prompt: imagePrompt 
              };
            }
          } catch (error: any) {
            assistantResponse = `I apologize, but I encountered an error generating the image: ${error.message}`;
          }
        } else {
          assistantResponse = "Please provide a description for the image you'd like me to generate.";
        }
      } else if (content.toLowerCase().includes("news") || content.toLowerCase().includes("headlines")) {
        // Extract category if mentioned
        const categories = ["technology", "business", "sports", "entertainment", "health", "science"];
        const mentionedCategory = categories.find(cat => 
          content.toLowerCase().includes(cat)
        );
        
        try {
          const newsArticles = await fetchNews(mentionedCategory || "technology");
          assistantResponse = `Here are the latest ${mentionedCategory || "technology"} headlines:`;
          metadata = { 
            type: "news", 
            articles: newsArticles,
            category: mentionedCategory || "technology"
          };
        } catch (error: any) {
          assistantResponse = `I apologize, but I encountered an error fetching the news: ${error.message}`;
        }
      } else if (content.toLowerCase().includes("code") && (
        content.toLowerCase().includes("analyze") || 
        content.toLowerCase().includes("explain") ||
        content.toLowerCase().includes("debug")
      )) {
        // Look for code blocks in the message
        const codeMatch = content.match(/```(\w+)?\s*([\s\S]*?)```/);
        if (codeMatch) {
          const language = codeMatch[1] || "unknown";
          const code = codeMatch[2].trim();
          try {
            const analysis = await analyzeCode(code, language);
            assistantResponse = analysis;
            metadata = { type: "code_analysis", language, code };
          } catch (error: any) {
            assistantResponse = `I apologize, but I encountered an error analyzing the code: ${error.message}`;
          }
        } else {
          // Add system message for code assistance
          const codeMessages = [
            {
              role: "system" as const,
              content: "You are Anvesh Chat Bot, a versatile coding assistant. Help users with writing, debugging, and explaining code. Always provide clear examples and explanations."
            },
            ...chatMessages
          ];
          assistantResponse = await generateChatResponse(codeMessages);
        }
      } else {
        // Regular conversation
        const systemMessage = {
          role: "system" as const,
          content: `You are Anvesh Chat Bot, a versatile conversational and creative assistant. You can help with:
1. Natural conversations and Q&A
2. Coding support (write, debug, explain code)
3. Image generation (when users type /image <description>)
4. Real-time news and information
5. Document creation and text formatting

Respond in a natural, friendly, and clear way. Be helpful and informative while maintaining a conversational tone.`
        };

        const conversationMessages = [systemMessage, ...chatMessages];
        assistantResponse = await generateChatResponse(conversationMessages);
      }

      // Save assistant message
      const assistantMessage = await storage.createMessage({
        conversationId: id,
        role: "assistant",
        content: assistantResponse,
        metadata,
      });

      res.json({
        userMessage,
        assistantMessage,
      });

    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get news by category
  app.get("/api/news", async (req, res) => {
    try {
      const { category = "technology" } = req.query;
      const articles = await fetchNews(category as string);
      res.json(articles);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Search news
  app.get("/api/news/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const articles = await searchNews(q as string);
      res.json(articles);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Generate image
  app.post("/api/generate-image", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ message: "Image prompt is required" });
      }
      const result = await generateImage(prompt);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
