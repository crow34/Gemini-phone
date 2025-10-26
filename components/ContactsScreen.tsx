import React from 'react';
import { type Contact } from '../types';

interface ContactsScreenProps {
  contacts: Contact[];
  onStartChat: (contact: Contact) => void;
  onStartCall: (contact: Contact) => void;
  onAddContact: () => void;
  onDeleteContact: (contactId: string) => void;
}

const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const MessageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;


const ContactsScreen: React.FC<ContactsScreenProps> = ({ contacts, onStartChat, onStartCall, onAddContact, onDeleteContact }) => {
  return (
    <div className="bg-gray-900 text-white h-full flex flex-col relative">
      <header className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Contacts</h1>
      </header>
      <div className="flex-grow overflow-y-auto">
        {contacts.length === 0 ? (
          <div className="text-center text-gray-400 p-8">
            <p>Your contact list is empty.</p>
            <p>Tap the '+' button to add your first AI contact!</p>
          </div>
        ) : (
          <ul>
            {contacts.map((contact) => (
              <li key={contact.id} className="flex items-center p-3 border-b border-gray-800 group">
                <img src={contact.avatarUrl} alt={contact.name} className="w-12 h-12 rounded-full mr-4" />
                <div className="flex-grow">
                  <p className="font-semibold text-lg">{contact.name}</p>
                  <p className="text-sm text-gray-400">{contact.title}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => onStartCall(contact)} className="p-2 rounded-full text-green-400 hover:bg-green-900 transition-colors">
                    <PhoneIcon />
                  </button>
                  <button onClick={() => onStartChat(contact)} className="p-2 rounded-full text-blue-400 hover:bg-blue-900 transition-colors">
                    <MessageIcon />
                  </button>
                   <button onClick={() => onDeleteContact(contact.id)} className="p-2 rounded-full text-gray-500 hover:bg-red-900 hover:text-red-400 transition-colors">
                    <TrashIcon />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
       <button onClick={onAddContact} className="absolute bottom-20 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-400">
          <PlusIcon />
        </button>
    </div>
  );
};

export default ContactsScreen;