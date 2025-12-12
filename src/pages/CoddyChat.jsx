import { useState, useEffect, useRef } from 'react';
import { askCoddy } from '../services/api';
import { Send, Loader2 } from 'lucide-react';
import { BotMessage } from '../components/BotMessage';
import { UserMessage } from '../components/UserMessage';
import { useTheme } from '../hooks/useTheme';
import { motion, AnimatePresence } from 'motion/react';
import coddyLogo from '../assets/logo.svg';

export default function CoddyChat() {
  const [messages, setMessages] = useState([
    { 
      id: 'welcome', 
      role: 'assistant', 
      content: 'Hai! 👋 Saya Coddy, mentor AI Anda. Saya di sini untuk membantu Anda merencanakan perjalanan belajar yang sempurna!',
      timestamp: new Date()
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { answer } = await askCoddy(userMessage.content);
      const assistantMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: answer,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: 'Maaf, terjadi kesalahan saat menghubungi Coddy. Silakan coba lagi nanti.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {message.role === 'assistant' ? (
                <BotMessage 
                  content={message.content} 
                  timestamp={message.timestamp} 
                />
              ) : (
                <UserMessage 
                  content={message.content} 
                  timestamp={message.timestamp} 
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#36BFB0] flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-500/30">
                <img src={coddyLogo} alt="Coddy" className="h-10 w-auto" />
              </div>
              <div
                className={`${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-100"
                } rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border`}
              >
                <div className="flex gap-1 items-center h-6">
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        className={`border-t ${
          isDarkMode
            ? "border-gray-700 bg-gray-800"
            : "border-gray-200 bg-white"
        } px-4 py-4 mb-16 md:mb-0`} 
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ketik pesan Anda..."
              disabled={loading}
              className={`flex-1 px-4 py-3 border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#36BFB0] focus:border-transparent`}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="px-6 py-3 bg-[#36BFB0] text-white rounded-xl hover:bg-[#2da89a] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
