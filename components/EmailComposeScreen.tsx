import React, { useState } from 'react';

interface EmailComposeScreenProps {
  onBack: () => void;
  onSend: (subject: string, body: string) => Promise<boolean>;
}

// Icons
const BackArrowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;


const EmailComposeScreen: React.FC<EmailComposeScreenProps> = ({ onBack, onSend }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim() || isSending) return;
    
    setIsSending(true);
    setError(null);
    const success = await onSend(subject, body);
    setIsSending(false);
    
    if (success) {
      onBack(); // Go back to inbox after successful send
    } else {
      setError("Failed to send. The AI agent might be busy. Please try again later.");
    }
  };

  return (
    <div className="bg-gray-900 text-white h-full flex flex-col">
      <header className="flex items-center p-3 border-b border-gray-700 bg-gray-800">
        <button onClick={onBack} className="mr-3 p-1 rounded-full hover:bg-gray-700" disabled={isSending}><BackArrowIcon /></button>
        <h1 className="text-xl font-bold flex-grow">Compose</h1>
        <button onClick={handleSend} disabled={isSending || !subject.trim() || !body.trim()} className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:opacity-50">
            <SendIcon />
        </button>
      </header>
      
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        <div className="flex items-center border-b border-gray-700 pb-2">
            <span className="text-gray-400 mr-2">To:</span>
            <span className="bg-gray-700 text-gray-200 px-2 py-1 text-sm rounded">AI Problem Solver</span>
        </div>
        <div>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-transparent py-2 text-lg focus:outline-none placeholder-gray-500"
            placeholder="Subject (Your Problem)"
            disabled={isSending}
          />
        </div>
        <div className="border-t border-gray-700 pt-2 flex-grow h-full">
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full h-full bg-transparent py-2 text-base focus:outline-none placeholder-gray-500 resize-none"
            placeholder="Compose email (add details here)"
            disabled={isSending}
          />
        </div>
        {isSending && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-300">Contacting AI Agent...</p>
            </div>
        )}
         {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      </div>
    </div>
  );
};

export default EmailComposeScreen;
