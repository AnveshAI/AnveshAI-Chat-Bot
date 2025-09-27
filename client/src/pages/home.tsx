import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bot, User, LogOut, Plus } from "lucide-react";
import logoPath from "@assets/image_1754820376714.png";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { apiRequest } from "@/lib/queryClient";
import { type Message, type Conversation } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Home() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Fetch conversations
  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
    },
  });

  // Set current conversation to the first one, or create one if none exist
  useEffect(() => {
    if (conversations.length > 0 && !currentConversationId) {
      setCurrentConversationId(conversations[0].id);
    }
  }, [conversations, currentConversationId]);

  // Fetch messages for the current conversation
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["/api/conversations", currentConversationId, "messages"],
    enabled: !!currentConversationId,
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
    },
  });

  // Create new conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/conversations", {
        title: "New Conversation",
      });
      return response.json();
    },
    onSuccess: (newConversation) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setCurrentConversationId(newConversation.id);
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to create conversation",
        variant: "destructive",
      });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!currentConversationId) {
        throw new Error("No conversation selected");
      }
      const response = await apiRequest("POST", `/api/conversations/${currentConversationId}/messages`, {
        content,
      });
      return response.json();
    },
    onSuccess: () => {
      if (currentConversationId) {
        queryClient.invalidateQueries({
          queryKey: ["/api/conversations", currentConversationId, "messages"],
        });
      }
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
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
    if (!currentConversationId) {
      createConversationMutation.mutate();
      return;
    }
    sendMessageMutation.mutate(content);
  };

  const showWelcome = !isLoading && messages.length === 0 && currentConversationId;
  const showNoConversation = conversations.length === 0 && !createConversationMutation.isPending;

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">Conversations</h2>
            <Button
              size="sm"
              onClick={() => createConversationMutation.mutate()}
              disabled={createConversationMutation.isPending}
            >
              <Plus className="w-4 h-4 mr-1" />
              New
            </Button>
          </div>
          {user && (
            <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm text-slate-800">
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user.email || "User"}
                  </p>
                  <p className="text-xs text-slate-500">Signed in</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => window.location.href = '/api/logout'}
                className="p-1 h-8 w-8"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-4">
          {conversations.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">
              No conversations yet. Start a new one!
            </p>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setCurrentConversationId(conversation.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentConversationId === conversation.id
                      ? "bg-primary text-white"
                      : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <p className="font-medium text-sm truncate">
                    {conversation.title}
                  </p>
                  <p className="text-xs opacity-75">
                    {new Date(conversation.createdAt).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-white">
        {showNoConversation ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <img src={logoPath} alt="Anvesh Chat Bot" className="w-16 h-16 mx-auto mb-4 object-contain" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Welcome to Anvesh Chat Bot!</h3>
              <p className="text-slate-600 mb-6">
                Start your first conversation to begin chatting, get coding help, or read the latest news.
              </p>
              <Button onClick={() => createConversationMutation.mutate()}>
                Start New Conversation
              </Button>
            </div>
          </div>
        ) : (
          <>
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
                        Hello! I'm <strong>Anvesh Chat Bot</strong>, your intelligent assistant. I can help you with:
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-slate-600">
                        <li>• Natural conversations and Q&A</li>
                        <li>• Writing, debugging, and explaining code</li>
                        <li>• Fetching real-time news and updates</li>
                        <li>• General assistance and information</li>
                      </ul>
                      <p className="mt-3 text-slate-800">What would you like to explore today?</p>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-slate-400">
                      <span>Anvesh Chat Bot</span>
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
          </>
        )}
      </main>
    </div>
  );
}