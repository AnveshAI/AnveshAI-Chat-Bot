import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Image, Code, Newspaper, FileText } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    {
      icon: Code,
      label: "Code help",
      action: () => setMessage("Can you help me write code for "),
    },
    {
      icon: Newspaper,
      label: "Latest news",
      action: () => setMessage("What are the latest tech news headlines?"),
    },
    {
      icon: FileText,
      label: "Analyze code",
      action: () => setMessage("Analyze this code:\n```\n\n```"),
    },
  ];

  return (
    <div className="border-t border-slate-200 p-6">
      <div className="flex items-end space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Try code help, ask for news, or general questions)"
              className="resize-none border border-slate-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={1}
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!message.trim() || isLoading}
              size="sm"
              className="absolute bottom-3 right-3 w-6 h-6 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors p-0"
            >
              <Send className="w-3 h-3" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-3 mt-3">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                onClick={action.action}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-600 transition-colors"
                disabled={isLoading}
              >
                <action.icon className="w-3 h-3" />
                <span>{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
        <p>AnveshAI can use any APIs you provide. Messages are processed in real-time.</p>
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
            Online
          </span>
          <span>Press Enter to send</span>
        </div>
      </div>
    </div>
  );
}
