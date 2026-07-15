"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/register?mode=signin');
    } else if (status === 'authenticated' && !(session?.user as any)?.isPremium) {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const samplePrompts = [
    {
      title: "Tomorrow's Peak",
      desc: "What's the max temperature tomorrow? Do I need an umbrella?",
      text: "What is the forecast and peak temperature for tomorrow in Melbourne? Are there any weather warnings?"
    },
    {
      title: "Outfit Guide",
      desc: "Recommend the best outfit based on current conditions.",
      text: "Based on the current weather condition, what would be the ideal outfit recommendation for going out today in Melbourne?"
    },
    {
      title: "Layering & Gear Guide",
      desc: "Get clothing and gear advice based on wind chill and feels-like temp.",
      text: "Considering the current feels-like temperature, wind speed, and humidity in Melbourne today, what is the best layered outfit and gear recommendation for going out?"
    }
  ];

  const handleSend = async (textToSend: string) => {
    const trimmedText = textToSend.trim();

    if (!trimmedText || isLoading) return;
    const userMessage: Message = { role: 'user', content: trimmedText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      console.log("sending request");
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error('no 200 condition');
      const replyText = await response.text();
      console.log("AI got the reply", replyText);
      setMessages(prev => [...prev, { role: 'assistant', content: replyText }]);

    } catch (error) {
      console.error("error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseChat = () => {
    setMessages([]);
    setInput('');
    router.back();;
  };

  if (status === 'loading') {
    return <div className="w-[360px] md: w-[600px] min-h-screen bg-black flex items-center justify-center text-[#2DEBC9] animate-pulse">Loading Weathia Assistant...</div>;
  }

  return (
    <div className="relative w-full bg-[#161616] border border-white/5 backdrop-blur-md flex flex-col min-h-screen">

      <button
        onClick={handleCloseChat}
        className="absolute mt-4 ml-2 p-2 rounded-xl bg-white/5 text-white/40 border border-white/5 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 transition-all active:scale-95 cursor-pointer z-50 flex items-center justify-center"
        title="exit the chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="w-full bg-[#161616] border border-white/5 shadow-2xl backdrop-blur-md flex flex-col min-h-screen justify-around">

        <div className="overflow-y-auto pt-15 scrollbar-thin scrollbar-thumb-white/15 scrollbar-track-transparent">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/icons/weathia_logo.svg"
              alt="logo"
              className="w-8 h-auto object-contain"
            />
            <span className="text-xl font-medium">Weathia AI Assistant</span>
          </div>
          <div className="flex flex-col gap-4 p-5 justify-bwtween items-center">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-2">
              How can I help you today?
            </h2>
            <p className="text-xs text-center sm:text-sm text-white/50 max-w-md leading-relaxed">
              I am your Weathia AI Assistant. Ask me about real-time weather forecasts, global climate trends, or tailored travel recommendations.
            </p>
          </div>
          {messages.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center text-center justify-center my-auto animate-in fade-in duration-300">
              <div className="flex flex-col gap-6 p-3 justify-center items-stretch w-[1/2] max-w-2xl mx-auto">
                {samplePrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(prompt.text)}
                    className="flex-1 flex flex-col text-left p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-[#2DEBC9]/40 hover:bg-white/[0.08] transition-all transform active:scale-[0.98] group cursor-pointer sm:w-auto"
                  >
                    <h4 className="text-sm font-bold text-[#2DEBC9] mb-1 group-hover:text-[#2DEBC9] transition-colors">
                      {prompt.title}
                    </h4>
                    <p className="text-[12px] text-white/40 leading-snug">
                      {prompt.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div
              style={{ width: '100%', maxWidth: '500px', maxHeight: '500px' }}
              className="flex flex-col gap-6 mx-auto justify-between items-start py-2 p-4 animate-in fade-in duration-200 overflow-y-auto
             scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-white/5">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex  ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-150`}
                >
                  <div
                    className={`max-w-[500px] h-auto justify-center items-center p-3 text-sm rounded-xl leading-relaxed break-words ${msg.role === 'user'
                      ? 'text-[#2DEBC9] font-medium rounded-tr-none'
                      : 'bg-white/5 border border-white/10 text-white rounded-tl-none'
                      }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 text-white rounded-2xl rounded-tl-none p-3.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#2DEBC9] rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-[#2DEBC9] rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-[#2DEBC9] rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="w-full pb-6 px-3 flex justify-center sticky bottom-0 bg-[#161616]">
          <div
            style={{ width: '100%', maxWidth: '600px', height: '60px' }}
            className="relative flex justify-end items-center border border-[#2DEBC9] rounded-xl p-2 mx-auto
            ">
            <input
              type="text"
              placeholder={isLoading ? "AI is thinking..." : "Type your prompt here..."}
              value={input}
              disabled={isLoading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              className="w-full bg-transparent text-[14px] text-white placeholder-white/30 outline-none focus:outline-none focus:ring-0 focus:border-transparent pr-12 disabled:opacity-50"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isLoading}
              className="absolute right-3 justify-center items-center cursor-pointer disabled:cursor-not-allowed"
            >
              <img src="/icons/submit.svg" alt="submit" className="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}