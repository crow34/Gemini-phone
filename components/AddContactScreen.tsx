import React, { useState } from 'react';
import { type Contact, type VoiceOption } from '../types';

interface AddContactScreenProps {
  onSave: (contact: Omit<Contact, 'id' | 'avatarUrl' | 'chatHistory'>) => void;
  onCancel: () => void;
}

const BackArrowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;

const AddContactScreen: React.FC<AddContactScreenProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [systemInstruction, setSystemInstruction] = useState('');
  const [voiceName, setVoiceName] = useState<VoiceOption>('Zephyr');
  const [useGoogleSearch, setUseGoogleSearch] = useState(false);
  
  const voiceOptions: { value: VoiceOption, label: string }[] = [
    { value: 'Zephyr', label: 'Zephyr (Standard Male)' },
    { value: 'Puck', label: 'Puck (Playful Male)' },
    { value: 'Kore', label: 'Kore (Standard Female)' },
    { value: 'Charon', label: 'Charon (Deep Male)' },
    { value: 'Fenrir', label: 'Fenrir (Strong Male)' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !systemInstruction.trim()) {
      alert('Please fill in at least the name and persona fields.');
      return;
    }
    onSave({
      name,
      title,
      systemInstruction,
      voiceName,
      useGoogleSearch,
    });
  };

  return (
    <div className="bg-gray-900 text-white h-full flex flex-col">
      <header className="flex items-center p-3 border-b border-gray-700 bg-gray-800">
        <button onClick={onCancel} className="mr-3 p-1 rounded-full hover:bg-gray-700"><BackArrowIcon /></button>
        <h1 className="text-xl font-bold">Add New Contact</h1>
      </header>
      
      <form onSubmit={handleSubmit} className="flex-grow p-4 overflow-y-auto space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title / Role</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="persona" className="block text-sm font-medium text-gray-300 mb-1">Persona (System Instruction)</label>
          <textarea
            id="persona"
            value={systemInstruction}
            onChange={(e) => setSystemInstruction(e.target.value)}
            rows={6}
            className="w-full bg-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., You are Alex, a witty and curious friend. You love to talk about sci-fi movies and ask thought-provoking questions. You remember past conversations and bring up shared jokes. You speak casually."
            required
          />
        </div>
        
        <div>
          <label htmlFor="voice" className="block text-sm font-medium text-gray-300 mb-1">Voice (for Phone Calls)</label>
          <select
            id="voice"
            value={voiceName}
            onChange={(e) => setVoiceName(e.target.value as VoiceOption)}
            className="w-full bg-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {voiceOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        
        <fieldset>
          <legend className="text-sm font-medium text-gray-300 mb-2">Abilities (for Text Chat)</legend>
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id="google-search"
                name="google-search"
                type="checkbox"
                checked={useGoogleSearch}
                onChange={(e) => setUseGoogleSearch(e.target.checked)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="google-search" className="font-medium text-gray-200">Web Search</label>
              <p className="text-gray-400">Allow contact to search the web for recent information.</p>
            </div>
          </div>
        </fieldset>

        <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-500">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-500">Save Contact</button>
        </div>
      </form>
    </div>
  );
};

export default AddContactScreen;
