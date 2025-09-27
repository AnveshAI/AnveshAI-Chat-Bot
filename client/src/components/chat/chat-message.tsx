import { Bot, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { type Message } from "@shared/schema";
import { CodeBlock } from "./code-block";
import { NewsCard } from "./news-card";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const timeAgo = formatDistanceToNow(message.createdAt, { addSuffix: true });
  const metadata = message.metadata as any;

  return (
    <div className={`chat-bubble flex items-start space-x-3 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`flex-1 ${isUser ? "flex justify-end" : ""}`}>
        <div className={`${
          isUser 
            ? "bg-primary rounded-2xl rounded-tr-md p-4 text-white max-w-md" 
            : "bg-slate-100 rounded-2xl rounded-tl-md p-4"
        }`}>
          
          {/* Regular message content */}
          <div className={`${isUser ? "text-white" : "text-slate-800"} prose prose-sm max-w-none`}>
            <ReactMarkdown
              components={{
                code: ({ className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  const isInline = !className?.includes('language-');
                  
                  if (!isInline && language) {
                    return <CodeBlock code={String(children).replace(/\n$/, '')} language={language} />;
                  }
                  
                  return (
                    <code 
                      className={`${className} ${isUser ? "bg-blue-800 text-blue-100" : "bg-slate-200 text-slate-800"} px-1 py-0.5 rounded text-sm`} 
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Special content based on metadata */}
          {metadata && (
            <div className="mt-4">
              {metadata.type === "image" && metadata.imageUrl && (
                <div className="bg-slate-200 rounded-lg p-2">
                  <img
                    src={metadata.imageUrl}
                    alt={metadata.prompt || "Generated image"}
                    className="w-full rounded-lg shadow-sm max-w-md"
                  />
                </div>
              )}
              
              {metadata.type === "news" && metadata.articles && (
                <div className="space-y-3">
                  {metadata.articles.slice(0, 5).map((article: any, index: number) => (
                    <NewsCard key={index} article={article} />
                  ))}
                </div>
              )}
              
              {metadata.type === "code_analysis" && metadata.code && (
                <div className="mt-3">
                  <CodeBlock code={metadata.code} language={metadata.language} />
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center mt-2 text-xs text-slate-400">
          <span>{isUser ? "You" : "AnveshAI"}</span>
          <span className="mx-2">•</span>
          <span>{timeAgo}</span>
        </div>
      </div>
      
      {isUser && (
        <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-slate-600" />
        </div>
      )}
    </div>
  );
}
