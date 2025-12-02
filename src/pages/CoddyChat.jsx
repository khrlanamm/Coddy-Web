import { useState, useEffect, useRef } from 'react';
import { askCoddy } from '../services/api';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import clsx from 'clsx';

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
    <div style={{ maxWidth: '800px', margin: '0 auto', height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        
        {/* Header */}
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: 'var(--accent-primary)', padding: '0.5rem', borderRadius: '50%' }}>
            <Bot size={24} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', lineHeight: 1 }}>Coddy Chat</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Asisten Belajar Pribadi</span>
          </div>
        </div>

        {/* Messages Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              style={{ 
                display: 'flex', 
                gap: '1rem', 
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start'
              }}
            >
              <div 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  backgroundColor: msg.role === 'user' ? 'var(--bg-secondary)' : 'var(--accent-primary)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} color="white" />}
              </div>
              
              <div style={{ maxWidth: '75%' }}>
                <div style={{ 
                  fontSize: '0.75rem', 
                  marginBottom: '0.25rem', 
                  color: 'var(--text-secondary)',
                  textAlign: msg.role === 'user' ? 'right' : 'left'
                }}>
                  {msg.role === 'user' ? 'Kamu' : 'Coddy'}
                </div>
                <div 
                  style={{ 
                    padding: '0.75rem 1rem', 
                    borderRadius: 'var(--radius)', 
                    backgroundColor: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                    color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                    lineHeight: 1.6,
                  }}
                >
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({node, ...props}) => <p style={{ marginBottom: '0.5rem', lastChild: { marginBottom: 0 } }} {...props} />,
                        ul: ({node, ...props}) => <ul style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }} {...props} />,
                        ol: ({node, ...props}) => <ol style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }} {...props} />,
                        li: ({node, ...props}) => <li style={{ marginBottom: '0.25rem' }} {...props} />,
                        a: ({node, ...props}) => <a style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }} {...props} />,
                        code: ({node, inline, className, children, ...props}) => {
                          return inline ? (
                            <code style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: '0.2em 0.4em', borderRadius: '3px', fontSize: '0.9em' }} {...props}>
                              {children}
                            </code>
                          ) : (
                            <div style={{ overflowX: 'auto', backgroundColor: 'rgba(0,0,0,0.1)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '0.5rem' }}>
                              <code {...props}>
                                {children}
                              </code>
                            </div>
                          )
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} color="white" />
              </div>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
                <span className="animate-blink" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                  Menyiapkan Jawaban...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              className="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya sesuatu tentang progress belajarmu..."
              disabled={loading}
              style={{ flex: 1 }}
            />
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={!input.trim() || loading}
              style={{ width: '48px', padding: 0 }}
            >
              <Send size={20} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
