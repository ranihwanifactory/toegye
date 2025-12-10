import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/geminiService';
import { Message } from '../types';

interface ChatModeProps {
  onBack: () => void;
}

const ChatMode: React.FC<ChatModeProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'model',
      text: '안녕? 나는 퇴계 이황이란다. 1000원짜리 지폐에서 나를 본 적이 있니? 궁금한 게 있으면 무엇이든 물어보렴.',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Prepare history for Gemini API (limit context window if needed, here simplified)
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await sendChatMessage(history, userMsg.text);

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="w-full h-full flex flex-col max-w-4xl mx-auto px-2 md:px-0">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm rounded-b-2xl mb-4 shadow-sm z-10 sticky top-0">
        <button 
          onClick={onBack}
          className="text-stone-500 hover:text-stone-800 font-bold flex items-center gap-2"
        >
          ← 나가기
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold text-stone-800 font-hand">퇴계 할아버지와의 대화</h2>
          <span className="text-xs text-stone-500">예의 바르게 이야기해요</span>
        </div>
        <div className="w-20"></div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4 story-scroll">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-100' : 'bg-green-100'}`}>
                {msg.role === 'user' ? '🧒' : '👴🏻'}
              </div>
              
              {/* Bubble */}
              <div
                className={`p-4 rounded-2xl shadow-sm text-lg leading-snug ${
                  msg.role === 'user'
                    ? 'bg-indigo-500 text-white rounded-tr-none'
                    : 'bg-white text-stone-800 border border-stone-200 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start w-full">
            <div className="flex flex-row items-end gap-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl shadow-md">👴🏻</div>
              <div className="bg-white border border-stone-200 p-4 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/80 backdrop-blur-md rounded-t-3xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="할아버지, 공부는 왜 해야 하나요?"
            className="flex-1 bg-stone-100 border-2 border-stone-200 rounded-full px-6 py-3 text-stone-800 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all placeholder-stone-400"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-md transform active:scale-95 ${
              !input.trim() || isTyping 
                ? 'bg-stone-300 cursor-not-allowed text-stone-500' 
                : 'bg-indigo-500 hover:bg-indigo-600 text-white'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatMode;