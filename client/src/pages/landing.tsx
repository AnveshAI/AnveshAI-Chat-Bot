import { Button } from "@/components/ui/button";
import { Bot, MessageSquare, Code, Newspaper } from "lucide-react";
import logoPath from "@assets/image_1754820376714.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="mx-auto mb-6 flex justify-center">
              <img src={logoPath} alt="Anvesh Chat Bot" className="w-24 h-24 object-contain" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Welcome to <span className="text-primary">Anvesh Chat Bot</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Your intelligent chat companion with conversational support, coding assistance, 
              and real-time news updates - completely free and powered by advanced AI technology.
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8 py-3"
              onClick={() => window.location.href = '/api/login'}
            >
              Get Started - Sign In with Replit
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Natural Conversations</h3>
              <p className="text-slate-600">
                Chat naturally about any topic. Get helpful responses powered by intelligent algorithms.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Coding Support</h3>
              <p className="text-slate-600">
                Get help with programming, code analysis, debugging, and best practices across multiple languages.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Newspaper className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Real-Time News</h3>
              <p className="text-slate-600">
                Stay updated with the latest news from trusted sources using free RSS feeds.
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Why Choose Anvesh Chat Bot?</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Completely Free</h4>
                  <p className="text-slate-600">No API costs, no subscriptions - everything runs on free services.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Secure Authentication</h4>
                  <p className="text-slate-600">Sign in safely with your Replit account - no separate registration needed.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Real Data</h4>
                  <p className="text-slate-600">Get authentic news from RSS feeds and genuine coding assistance.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Always Available</h4>
                  <p className="text-slate-600">24/7 access to your conversations and AI assistance whenever you need it.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-lg text-slate-600 mb-4">Ready to get started?</p>
            <Button 
              size="lg" 
              className="text-lg px-8 py-3"
              onClick={() => window.location.href = '/api/login'}
            >
              Sign In to Start Chatting
            </Button>
            <p className="text-sm text-slate-500 mt-3">
              By signing in, you'll be able to save your conversations and access all features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}