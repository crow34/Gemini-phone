import React from 'react';
import { type Email } from '../types';

interface EmailDetailScreenProps {
  email: Email;
  onBack: () => void;
}

const BackArrowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;

const EmailDetailScreen: React.FC<EmailDetailScreenProps> = ({ email, onBack }) => {
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString([], { dateStyle: 'long', timeStyle: 'short' });
  };
  
  // Simple markdown to HTML renderer
  const renderBody = (text: string) => {
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/^- (.*)/gm, '<li class="ml-4 list-disc">$1</li>') // List items
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>') // Wrap lists
      .replace(/\n/g, '<br />'); // Newlines
      
    // Fix for lists getting <br> inside them
    return html.replace(/<\/li><br \/>/g, '</li>');
  };

  return (
    <div className="bg-gray-900 text-white h-full flex flex-col">
      <header className="flex items-center p-3 border-b border-gray-700 bg-gray-800 sticky top-0 z-10">
        <button onClick={onBack} className="mr-3 p-1 rounded-full hover:bg-gray-700"><BackArrowIcon /></button>
        <div className="flex-grow overflow-hidden">
            <h1 className="text-xl font-bold truncate">{email.subject}</h1>
        </div>
      </header>
      
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xl mr-3 flex-shrink-0">
                {email.sender.charAt(0)}
            </div>
            <div>
                <p className="font-semibold">{email.sender}</p>
                <p className="text-xs text-gray-400">to me</p>
            </div>
        </div>
        <p className="text-xs text-gray-500 mb-6 border-b border-gray-700 pb-4">
            {formatTimestamp(email.timestamp)}
        </p>
        
        <div 
          className="prose prose-invert prose-sm text-gray-300 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: renderBody(email.body) }}
        />
      </div>
    </div>
  );
};

export default EmailDetailScreen;
