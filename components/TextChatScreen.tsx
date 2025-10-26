import React, { useState, useEffect, useRef } from 'react';
import { type Chat, type Content } from '@google/genai';
import { type Contact, type ChatMessage } from '../types';

interface TextChatScreenProps {
  contact: Contact;
  chat: Chat;
  onBack: () => void;
  onUpdateHistory: (history: Content[]) => void;
}

const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const BackArrowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;

const TextChatScreen: React.FC<TextChatScreenProps> = ({ contact, chat, onBack, onUpdateHistory }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const history = await chat.getHistory();
        const formattedMessages: ChatMessage[] = history.map((item, index) => ({
          id: `hist-${index}-${Date.now()}`,
          sender: item.role === 'user' ? 'user' : 'ai',
          // Assuming single text part for simplicity
          text: item.parts[0]?.text ?? '',
          timestamp: Date.now() - (history.length - index) * 1000,
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Failed to load chat history", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, [chat]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: newMessage,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = newMessage;
    setNewMessage('');
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({ message: messageToSend });
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response.text,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Sorry, I encountered an error.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      const updatedHistory = await chat.getHistory();
      onUpdateHistory(updatedHistory);
    }
  };

  return (
    <div className="bg-gray-900 text-white h-full flex flex-col">
      <header className="flex items-center p-3 border-b border-gray-700 bg-gray-800">
        <button onClick={onBack} className="mr-3 p-1 rounded-full hover:bg-gray-700"><BackArrowIcon /></button>
        <img src={contact.avatarUrl} alt={contact.name} className="w-10 h-10 rounded-full mr-3" />
        <div>
          <p className="font-semibold">{contact.name}</p>
          <p className="text-xs text-gray-400">Online</p>
        </div>
      </header>

      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && messages.length > 0 && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-gray-700 rounded-bl-none">
              <div className="flex items-center space-x-1">
                 <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></span>
                 <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                 <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-700 bg-gray-800 flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow bg-gray-700 rounded-full py-2 px-4 focus:outline-none"
          disabled={isLoading}
        />
        <button type="submit" className="ml-3 p-2 bg-blue-600 rounded-full hover:bg-blue-500 disabled:bg-gray-600" disabled={isLoading || !newMessage.trim()}>
          <SendIcon />
        </button>
      </form>
    </div>
  );
};

export default TextChatScreen;
