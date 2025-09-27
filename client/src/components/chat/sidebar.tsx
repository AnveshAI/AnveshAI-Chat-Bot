import { MessageSquare, Code, Image, Newspaper, FileText, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const capabilities = [
  {
    icon: MessageSquare,
    title: "Chat & Conversation",
    description: "Natural language discussions",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    active: true,
  },
  {
    icon: Code,
    title: "Code Support",
    description: "Write, debug, explain code",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: Image,
    title: "Code Analysis",
    description: "Paste code for review",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: Newspaper,
    title: "Real-time News",
    description: "Latest news & updates",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    icon: FileText,
    title: "Free Resources",
    description: "RSS news & coding help",
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
];

const quickCommands = [
  "Help with Python code",
  "Latest tech news", 
  "Analyze my JavaScript",
  "Explain this function",
];

export function Sidebar() {
  return (
    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Capabilities</h2>
        <div className="space-y-3">
          {capabilities.map((capability) => (
            <div
              key={capability.title}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                capability.active 
                  ? "bg-slate-50 border border-slate-200" 
                  : "hover:bg-slate-50"
              }`}
            >
              <div className={`w-8 h-8 ${capability.bgColor} rounded-lg flex items-center justify-center`}>
                <capability.icon className={`${capability.iconColor} w-4 h-4`} />
              </div>
              <div>
                <h3 className="font-medium text-slate-800">{capability.title}</h3>
                <p className="text-xs text-slate-500">{capability.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-sm font-medium text-slate-800 mb-3">Quick Commands</h3>
        <div className="space-y-2">
          {quickCommands.map((command) => (
            <div
              key={command}
              className="text-xs bg-slate-100 rounded px-2 py-1 font-mono text-slate-600 cursor-pointer hover:bg-slate-200 transition-colors"
            >
              {command}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-slate-200">
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <HelpCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
