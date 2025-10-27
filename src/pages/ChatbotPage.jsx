import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../services/api';
import { FiSend } from 'react-icons/fi';

function ChatbotPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am GreenBot. How can I help you with your climate-smart farming questions today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await apiClient.post('/chatbot/ask', { prompt: input });
      const assistantMessage = { role: 'assistant', content: response.data.reply };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-surface rounded-xl shadow-md">
      <header className="p-4 border-b">
        <h1 className="text-xl font-bold text-text-primary">AI Assistant (GreenBot)</h1>
      </header>

      <div className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">🌿</div>}
                <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-secondary text-white' : 'bg-background'}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">🌿</div>
              <div className="max-w-md p-3 rounded-lg bg-background flex items-center gap-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <footer className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about soil, pests, or crops..."
            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <button type="submit" className="bg-primary text-white p-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400" disabled={isLoading || !input.trim()}>
            <FiSend size={20} />
          </button>
        </form>
      </footer>
    </div>
  );
}

export default ChatbotPage;