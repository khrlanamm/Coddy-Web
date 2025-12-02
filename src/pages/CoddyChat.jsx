import { useState, useEffect, useRef } from 'react';
import { askCoddy } from '../services/api';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function CoddyChat() {
  const [messages, setMessages] = useState([
    { id: 'welcome', role: 'assistant', content: 'Hai! Aku Coddy, asisten belajarmu 👋. Ada yang bisa aku bantu seputar roadmap belajarmu?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { answer } = await askCoddy(userMessage.content);
      const assistantMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: answer };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: 'Maaf, terjadi kesalahan saat menghubungi Coddy. Silakan coba lagi nanti.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="card flex-1 flex flex-col overflow-hidden p-0 shadow-lg border-0 md:border">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-full">
            <Bot size={24} className="text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-bold leading-none">Coddy Chat</h2>
            <span className="text-xs text-secondary">Asisten Belajar Pribadi</span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6 bg-slate-50">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-white border border-gray-200' : 'bg-accent-primary text-white'
                }`}
              >
                {msg.role === 'user' ? <User size={16} className="text-secondary" /> : <Bot size={16} />}
              </div>
              
              <div className={`max-w-[85%] md:max-w-[75%]`}>
                <div className={`text-xs mb-1 text-secondary ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.role === 'user' ? 'Kamu' : 'Coddy'}
                </div>
                <div 
                  className={`p-3 md:p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-accent-primary text-white rounded-tr-none' 
                      : 'bg-white text-primary border border-gray-100 rounded-tl-none'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-primary text-white flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-secondary text-sm">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="animate-pulse">Mengetik...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <form onSubmit={handleSend} className="flex gap-2 relative">
            <input
              type="text"
              className="input pr-12 py-3"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya sesuatu..."
              disabled={loading}
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent-primary text-white rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={!input.trim() || loading}
            >
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
