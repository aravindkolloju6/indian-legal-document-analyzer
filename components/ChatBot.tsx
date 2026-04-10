
import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { ChatMessage } from '../types';
import { chatWithAssistant } from '../services/geminiService';

interface ChatBotProps {
  documentContext?: string;
}

export const ChatBot: React.FC<ChatBotProps> = ({ documentContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am your Indian Legal Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAssistant(input, messages, documentContext);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-legal-800 w-[90vw] sm:w-80 md:w-[340px] h-[450px] max-h-[75vh] rounded-2xl shadow-2xl flex flex-col border border-legal-200 dark:border-legal-700 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-legal-900 dark:bg-legal-900 border-b border-legal-800 p-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-legal-800 text-legal-gold rounded-full flex items-center justify-center border border-legal-700">
                <MessageSquare size={16} />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-medium text-sm tracking-wide">Legal Assistant</span>
                {documentContext && (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1.5 font-medium uppercase tracking-wider mt-0.5">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                    Context Active
                  </span>
                )}
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-legal-100 hover:text-white hover:bg-legal-800 p-2 rounded-full transition-colors flex items-center justify-center"
              aria-label="Close chat"
              title="Close chat"
            >
              <X size={22} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-legal-50 dark:bg-legal-900/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-5 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-legal-900 text-white rounded-br-sm'
                      : 'bg-white dark:bg-legal-800 text-legal-900 dark:text-legal-50 border border-legal-100 dark:border-legal-700 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-legal-800 px-5 py-4 rounded-2xl rounded-bl-sm shadow-sm border border-legal-100 dark:border-legal-700 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-legal-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-legal-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-legal-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-legal-800 border-t border-legal-100 dark:border-legal-700">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about law or document..."
                className="w-full bg-legal-50 dark:bg-legal-900/50 border border-legal-200 dark:border-legal-700 rounded pl-4 pr-12 py-3 text-[15px] focus:ring-1 focus:ring-legal-gold focus:border-legal-gold dark:text-white outline-none transition-all placeholder:text-legal-900/40 dark:placeholder:text-legal-50/40"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-1.5 p-2 bg-legal-900 text-legal-gold rounded hover:bg-legal-800 disabled:bg-legal-100 disabled:dark:bg-legal-800 disabled:text-legal-900/40 disabled:dark:text-legal-50/40 transition-colors shadow-sm"
              >
                <Send size={16} className="ml-0.5" />
              </button>
            </div>
            <p className="text-[10px] text-legal-900/40 dark:text-legal-50/40 mt-3 text-center uppercase tracking-widest">
              AI-generated info. Not professional legal advice.
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-legal-900 hover:bg-legal-800 text-legal-gold p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3 group border border-legal-800"
        >
          <MessageSquare size={24} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-serif font-medium whitespace-nowrap">
            Ask Legal Assistant
          </span>
        </button>
      )}
    </div>
  );
};
