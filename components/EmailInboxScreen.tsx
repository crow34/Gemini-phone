import React from 'react';
import { type Email } from '../types';

interface EmailInboxScreenProps {
  emails: Email[];
  onCompose: () => void;
  onOpenEmail: (email: Email) => void;
}

const ComposeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;

const EmailInboxScreen: React.FC<EmailInboxScreenProps> = ({ emails, onCompose, onOpenEmail }) => {
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="bg-gray-900 text-white h-full flex flex-col relative">
      <header className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Inbox</h1>
      </header>
      <div className="flex-grow overflow-y-auto">
        {emails.length === 0 ? (
          <div className="text-center text-gray-400 p-8">
            <p>Your inbox is empty.</p>
            <p>Tap the compose button to ask the AI for help.</p>
          </div>
        ) : (
          <ul>
            {emails.map((email) => (
              <li 
                key={email.id} 
                className={`flex items-start p-3 border-b border-gray-800 cursor-pointer hover:bg-gray-800 ${!email.read ? 'bg-blue-900/30' : ''}`}
                onClick={() => onOpenEmail(email)}
              >
                <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${!email.read ? 'bg-blue-400' : 'bg-transparent'}`}></div>
                <div className="flex-grow overflow-hidden">
                  <div className="flex justify-between items-baseline">
                    <p className={`font-semibold text-lg truncate ${!email.read ? 'text-white' : 'text-gray-300'}`}>{email.sender}</p>
                    <p className="text-xs text-gray-400 flex-shrink-0 ml-2">{formatTimestamp(email.timestamp)}</p>
                  </div>
                  <p className={`font-medium truncate ${!email.read ? 'text-gray-200' : 'text-gray-400'}`}>{email.subject}</p>
                  <p className="text-sm text-gray-500 truncate">{email.body}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button 
        onClick={onCompose} 
        className="absolute bottom-20 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-400"
        aria-label="Compose new email"
      >
        <ComposeIcon />
      </button>
    </div>
  );
};

export default EmailInboxScreen;
