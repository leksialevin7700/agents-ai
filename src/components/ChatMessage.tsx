import React from 'react';
import { Message } from '../types';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAI = message.sender === 'ai';
  
  return (
    <div className={`flex items-start gap-3 mb-4 ${isAI ? '' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isAI 
          ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white' 
          : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
      }`}>
        {isAI ? <Bot size={16} /> : <User size={16} />}
      </div>
      
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
        isAI ? 'bg-white' : 'bg-gradient-to-r from-blue-500 to-teal-500'
      } rounded-2xl px-4 py-3 shadow-md`}>
        <div className={`prose prose-sm max-w-none ${
          isAI ? 'text-gray-800' : 'text-white'
        }`}>
          {isAI ? (
            <ReactMarkdown>{message.text}</ReactMarkdown>
          ) : (
            <p>{message.text}</p>
          )}
        </div>
        <span className={`text-xs mt-1 block ${
          isAI ? 'text-gray-500' : 'text-blue-100'
        }`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};