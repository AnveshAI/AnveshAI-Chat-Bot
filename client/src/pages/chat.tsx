import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bot } from "lucide-react";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { Sidebar } from "@/components/chat/sidebar";
import { apiRequest } from "@/lib/queryClient";
import { type Message } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Chat() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [conversationId] = useState("default"); // Use default conversation for now

  // Fetch messages for the conversation
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["/api/conversations", conversationId, "messages"],
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", `/api/conversations/${conversationId}/messages`, {
        content,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/conversations", conversationId, "messages"],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (content: string) => {
    sendMessageMutation.mutate(content);
  };

  // Show welcome message if no messages
  const showWelcome = !isLoading && messages.length === 0;

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar />
      
      <main className="flex-1 flex flex-col bg-white">
        {/* Chat Messages Area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* Welcome Message */}
          {showWelcome && (
            <div className="chat-bubble flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="bg-slate-100 rounded-2xl rounded-tl-md p-4">
                  <p className="text-slate-800">
                    Hello! I'm <strong>AnveshAI</strong>, your versatile AI assistant. I can help you with:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600">
                    <li>• Natural conversations and Q&A</li>
                    <li>• Writing, debugging, and explaining code</li>
                    <li>• Code analysis and debugging assistance</li>
                    <li>• Fetching real-time news and updates</li>
                    <li>• Creating documents and reports</li>
                  </ul>
                  <p className="mt-3 text-slate-800">What would you like to explore today?</p>
                </div>
                <div className="flex items-center mt-2 text-xs text-slate-400">
                  <span>AnveshAI</span>
                  <span className="mx-2">•</span>
                  <span>Just now</span>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((message: Message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* Loading indicator */}
          {sendMessageMutation.isPending && (
            <div className="typing-indicator flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="bg-slate-100 rounded-2xl rounded-tl-md p-4 w-16">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={sendMessageMutation.isPending}
        />
      </main>
    </div>
  );
}
