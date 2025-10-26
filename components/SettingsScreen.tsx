import React from 'react';

interface SettingsScreenProps {
  onBack: () => void;
  onAddContact: () => void;
}

// Icons
const BackArrowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 11a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1z" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>;


const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, onAddContact }) => {
  return (
    <div className="bg-gray-900 text-white h-full flex flex-col">
      <header className="flex items-center p-3 border-b border-gray-700 bg-gray-800">
        <button onClick={onBack} className="mr-3 p-1 rounded-full hover:bg-gray-700"><BackArrowIcon /></button>
        <h1 className="text-xl font-bold">Settings</h1>
      </header>
      
      <main className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-4">
            <h2 className="text-gray-400 text-sm font-semibold uppercase px-2">AI Configuration</h2>
            <div className="bg-gray-800 rounded-lg">
                <button 
                    onClick={onAddContact}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <div className="flex items-center">
                        <UserPlusIcon />
                        <span className="ml-4 text-base font-medium">Add Custom AI Persona</span>
                    </div>
                    <ChevronRightIcon />
                </button>
            </div>
            <p className="text-xs text-gray-500 px-2">
                Create new AI contacts with custom personalities, roles, and abilities. Your custom personas will appear in the Contacts app.
            </p>
        </div>
      </main>
    </div>
  );
};

export default SettingsScreen;
