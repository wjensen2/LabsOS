'use client';

import { useState } from 'react';
import { Send, Mic, Paperclip, MoreVertical } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'nora';
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Hello! I\'m Nora, your AI assistant. How can I help you today?',
    sender: 'nora',
    timestamp: '10:30 AM'
  },
  {
    id: '2',
    content: 'Hi Nora! Can you help me understand the Fountain Labs platform?',
    sender: 'user',
    timestamp: '10:31 AM'
  },
  {
    id: '3',
    content: 'Of course! Fountain Labs is an innovative AI platform that helps organizations streamline their workflows. We focus on agent systems, workforce analytics, and intelligent automation. What specific aspect would you like to know more about?',
    sender: 'nora',
    timestamp: '10:31 AM'
  }
];

export function MobileNora() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate Nora's response
    setTimeout(() => {
      const noraMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I understand your question. Let me help you with that. Is there anything specific you\'d like me to elaborate on?',
        sender: 'nora',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, noraMessage]);
    }, 1000);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-lg">🤖</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">Nora AI</h3>
          <p className="text-xs text-white/80">Online • AI Assistant</p>
        </div>
        <button className="p-2">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              message.sender === 'user'
                ? 'bg-purple-600 text-white rounded-br-md'
                : 'bg-gray-100 text-gray-900 rounded-bl-md'
            }`}>
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-purple-200' : 'text-gray-500'
              }`}>
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-gray-200">
        <div className="flex gap-2 overflow-x-auto">
          {['Projects', 'Team Info', 'Analytics', 'Help'].map((action) => (
            <button
              key={action}
              className="flex-shrink-0 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full p-2">
          <button className="p-2">
            <Paperclip size={20} className="text-gray-500" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Message Nora..."
            className="flex-1 bg-transparent border-none outline-none text-sm"
          />
          <button className="p-2">
            <Mic size={20} className="text-gray-500" />
          </button>
          <button
            onClick={sendMessage}
            className="p-2 bg-purple-600 text-white rounded-full"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}