import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI, Chat, Content } from '@google/genai';
import { type Contact, type Email, Screen, type GroundingChunk } from './types';
import PhoneShell from './components/PhoneShell';
import ContactsScreen from './components/ContactsScreen';
import TextChatScreen from './components/TextChatScreen';
import PhoneCallScreen from './components/PhoneCallScreen';
import AddContactScreen from './components/AddContactScreen';
import HomeScreen from './components/HomeScreen';
import BrowserScreen from './components/BrowserScreen';
import CameraScreen from './components/CameraScreen';
import ImageGeneratorScreen from './components/ImageGeneratorScreen';
import EmailInboxScreen from './components/EmailInboxScreen';
import EmailComposeScreen from './components/EmailComposeScreen';
import EmailDetailScreen from './components/EmailDetailScreen';
import MapsScreen from './components/MapsScreen';
import SettingsScreen from './components/SettingsScreen';

const defaultContacts: Contact[] = [
  {
    id: 'default-1',
    name: 'Chloe',
    title: 'Personal Research Assistant',
    avatarUrl: `https://picsum.photos/seed/chloe-assistant/200`,
    systemInstruction: 'You are Chloe, a highly efficient and knowledgeable research assistant. You are adept at sifting through information using your search tools, summarizing complex topics, and providing clear, concise answers. Your tone is professional, yet friendly and approachable. You cite your sources when possible.',
    voiceName: 'Kore',
    useGoogleSearch: true,
    chatHistory: [],
  },
  {
    id: 'default-2',
    name: 'Dr. Natalie Sherburn',
    title: 'Medical Specialist',
    avatarUrl: `https://picsum.photos/seed/natalie-doctor/200`,
    systemInstruction: "You are Dr. Natalie Sherburn, a compassionate and expert medical specialist AI. Your role is to explain complex medical concepts in an easy-to-understand and empathetic manner. IMPORTANT: At the beginning and end of every response, you MUST include the following disclaimer: 'As an AI, I am not a real doctor. This information is for educational purposes only and should not be considered medical advice. Please consult a qualified healthcare professional for any health concerns.' Your responses should be based on your general knowledge and not real-time data.",
    voiceName: 'Kore',
    useGoogleSearch: false,
    chatHistory: [],
  },
  {
    id: 'default-3',
    name: 'Claire Pallette',
    title: 'UK Solicitor',
    avatarUrl: `https://picsum.photos/seed/claire-solicitor/200`,
    systemInstruction: "You are Claire Pallette, an AI simulating a UK solicitor. You are professional, articulate, and precise. Your purpose is to provide general information about UK law. IMPORTANT: At the beginning and end of every response, you MUST include the following disclaimer: 'As an AI, I am not a registered solicitor. This information is for educational purposes only and does not constitute legal advice. You should consult a qualified human solicitor for any legal issues.'",
    voiceName: 'Kore',
    useGoogleSearch: true,
    chatHistory: [],
  },
];

const defaultEmails: Email[] = [
    {
        id: 'welcome-email-1',
        sender: 'Aura',
        subject: 'Welcome to your AI-Powered Inbox!',
        body: `Hello,

I'm Aura, your personal AI problem-solving agent. My purpose is to help you tackle any challenge you're facing.

How it works:
1. Tap the "Compose" button.
2. Write down your problem or question in the email.
3. Send it to me.

I will then research the topic online and send you back a detailed, actionable plan to help you find a solution.

Whether you need help planning a trip, learning a new skill, or fixing a leaky faucet, I'm here to assist.

Best,
Aura | Your AI Problem-Solving Partner`,
        timestamp: Date.now(),
        read: false,
    }
];

interface MapsAgentResponse {
    text: string;
    chunks: GroundingChunk[];
}

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.HOME);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [activeEmail, setActiveEmail] = useState<Email | null>(null);
  const [chatInstances, setChatInstances] = useState<{ [key: string]: Chat }>({});
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [initialBrowserUrl, setInitialBrowserUrl] = useState<string | undefined>(undefined);

  // Load contacts from localStorage on initial render
  useEffect(() => {
    try {
      const storedContacts = localStorage.getItem('ai-contacts');
      setContacts(storedContacts ? JSON.parse(storedContacts) : defaultContacts);
    } catch (error) {
      console.error("Failed to parse contacts from localStorage", error);
      setContacts(defaultContacts);
    }
  }, []);

  // Save contacts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('ai-contacts', JSON.stringify(contacts));
    } catch (error) {
       console.error("Failed to save contacts to localStorage", error);
    }
  }, [contacts]);
  
  // Load emails from localStorage on initial render
  useEffect(() => {
    try {
      const storedEmails = localStorage.getItem('ai-emails');
      setEmails(storedEmails ? JSON.parse(storedEmails) : defaultEmails);
    } catch (error) {
      console.error("Failed to parse emails from localStorage", error);
      setEmails(defaultEmails);
    }
  }, []);
  
  // Save emails to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('ai-emails', JSON.stringify(emails));
    } catch (error) {
      console.error("Failed to save emails to localStorage", error);
    }
  }, [emails]);


  const ai = useMemo(() => {
    if (process.env.API_KEY) {
      return new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return null;
  }, []);
  
  const handleSendProblemEmail = async (subject: string, body: string): Promise<boolean> => {
    if (!ai) return false;

    const problemDescription = `Problem Subject: ${subject}\n\nProblem Details: ${body}`;
    const systemInstruction = `You are a world-class problem-solving AI agent. Your name is 'Aura'. When a user sends you a problem, your task is to:
1. Thoroughly research the problem using your web search capabilities.
2. Synthesize the information you find.
3. Formulate a clear, concise, and practical step-by-step action plan that the user can follow to solve their problem.
4. Structure your entire response as a friendly and professional email.
5. Use Markdown for formatting, especially for lists (using '-') and bolding text (using '**').
6. Sign off the email as 'Aura | Your AI Problem-Solving Partner'.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: problemDescription,
            config: {
                systemInstruction,
                tools: [{googleSearch: {}}],
            },
        });

        const newEmail: Email = {
            id: `email-${Date.now()}`,
            sender: 'Aura',
            subject: `Re: ${subject}`,
            body: response.text,
            timestamp: Date.now(),
            read: false,
        };

        setEmails(prev => [newEmail, ...prev]);
        return true;
    } catch (error) {
        console.error("Error with problem-solving agent:", error);
        return false;
    }
  };

  const handleAskMapsAgent = async (query: string): Promise<MapsAgentResponse | null> => {
      if (!ai) return null;
      try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          const { latitude, longitude } = position.coords;

          const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: query,
              config: {
                  tools: [{ googleMaps: {} }],
                  toolConfig: {
                      retrievalConfig: {
                          latLng: { latitude, longitude }
                      }
                  }
              },
          });

          const text = response.text;
          const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
          return { text, chunks };

      } catch (error) {
          console.error("Error with Maps agent:", error);
          if (error instanceof GeolocationPositionError && error.code === error.PERMISSION_DENIED) {
              return { text: "I can't answer that without knowing your location. Please grant location permissions to use the Maps app.", chunks: [] };
          }
          return { text: "Sorry, I encountered an error trying to get that information. Please check your connection and try again.", chunks: [] };
      }
  };


  const handleStartChat = (contact: Contact) => {
    if (!ai) return;
    const tools = [];
    if (contact.useGoogleSearch) {
      tools.push({ googleSearch: {} });
    }
    const finalSystemInstruction = `ROLE AND PERSONA: Your primary instruction is to fully embody the following persona. Adhere to it strictly throughout our entire conversation.
---
${contact.systemInstruction}
---
RESPONSE STYLE: Always respond in a natural, conversational, and human-like manner. Avoid being overly formal or robotic.
MEMORY: Remember and refer to past parts of our conversation to show you're paying attention and to build a continuous dialogue.`;

    const newChat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: contact.chatHistory || [],
      config: {
        systemInstruction: finalSystemInstruction,
        ...(tools.length > 0 && { tools }),
      },
    });
    setChatInstances(prev => ({ ...prev, [contact.id]: newChat }));

    setActiveContact(contact);
    setCurrentScreen(Screen.TEXT_CHAT);
  };

  const handleStartCall = (contact: Contact) => {
    setActiveContact(contact);
    setCurrentScreen(Screen.PHONE_CALL);
  };
  
  const handleNavigateAddContact = () => setCurrentScreen(Screen.ADD_CONTACT);
  const handleNavigateContacts = () => setCurrentScreen(Screen.CONTACTS);
  const handleNavigateBrowser = (url?: string) => {
    setInitialBrowserUrl(url);
    setCurrentScreen(Screen.BROWSER);
  };
  const handleNavigateCamera = () => setCurrentScreen(Screen.CAMERA);
  const handleNavigatePhotos = () => setCurrentScreen(Screen.PHOTOS);
  const handleNavigateEmail = () => setCurrentScreen(Screen.EMAIL_INBOX);
  const handleNavigateMaps = () => setCurrentScreen(Screen.MAPS);
  const handleNavigateSettings = () => setCurrentScreen(Screen.SETTINGS);

  const handleOpenEmail = (email: Email) => {
    setActiveEmail(email);
    setCurrentScreen(Screen.EMAIL_DETAIL);
    // Mark as read
    setEmails(prev => prev.map(e => e.id === email.id ? { ...e, read: true } : e));
  };
  
  const handleNavigateComposeEmail = () => setCurrentScreen(Screen.EMAIL_COMPOSE);


  const handleSaveContact = (newContactData: Omit<Contact, 'id' | 'avatarUrl' | 'chatHistory'>) => {
    const newContact: Contact = {
      ...newContactData,
      id: Date.now().toString(),
      avatarUrl: `https://picsum.photos/seed/${Date.now()}/200`,
      chatHistory: [],
    };
    setContacts(prev => [...prev, newContact]);
    setCurrentScreen(Screen.CONTACTS);
  };

  const handleUpdateChatHistory = (contactId: string, history: Content[]) => {
      setContacts(prev => 
        prev.map(c => (c.id === contactId ? { ...c, chatHistory: history } : c))
      );
  };
  
  const handleDeleteContact = (contactId: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
        setContacts(prev => prev.filter(c => c.id !== contactId));
    }
  };

  const handleEndInteraction = () => {
    setCurrentScreen(Screen.HOME);
    setActiveContact(null);
    setActiveEmail(null);
    setInitialBrowserUrl(undefined);
  };

  const backAction = useMemo(() => {
    switch (currentScreen) {
      case Screen.CONTACTS:
      case Screen.BROWSER:
      case Screen.CAMERA:
      case Screen.PHOTOS:
      case Screen.EMAIL_INBOX:
      case Screen.MAPS:
      case Screen.SETTINGS:
        return () => {
            setCurrentScreen(Screen.HOME);
            setInitialBrowserUrl(undefined);
        };
      case Screen.TEXT_CHAT:
      case Screen.ADD_CONTACT:
        return () => setCurrentScreen(Screen.CONTACTS);
      case Screen.EMAIL_COMPOSE:
      case Screen.EMAIL_DETAIL:
        return () => setCurrentScreen(Screen.EMAIL_INBOX);
      default:
        return undefined;
    }
  }, [currentScreen]);


  const renderScreen = () => {
    if (!ai) {
      return <div className="text-white p-4">API Key not found. Please set the API_KEY environment variable.</div>
    }
    switch (currentScreen) {
      case Screen.TEXT_CHAT:
        return activeContact && chatInstances[activeContact.id] && (
          <TextChatScreen
            contact={activeContact}
            chat={chatInstances[activeContact.id]}
            onBack={backAction!}
            onUpdateHistory={(history) => handleUpdateChatHistory(activeContact.id, history)}
          />
        );
      case Screen.PHONE_CALL:
        return activeContact && (
          <PhoneCallScreen
            contact={activeContact}
            onEndCall={handleNavigateContacts}
            ai={ai}
          />
        );
      case Screen.ADD_CONTACT:
        return (
          <AddContactScreen
            onSave={handleSaveContact}
            onCancel={backAction!}
          />
        );
      case Screen.CONTACTS:
        return (
          <ContactsScreen
            contacts={contacts}
            onStartChat={handleStartChat}
            onStartCall={handleStartCall}
            onAddContact={handleNavigateAddContact}
            onDeleteContact={handleDeleteContact}
          />
        );
       case Screen.BROWSER:
        return <BrowserScreen onBack={backAction!} initialUrl={initialBrowserUrl} />;
      case Screen.CAMERA:
        return <CameraScreen onBack={backAction!} ai={ai} />;
      case Screen.PHOTOS:
        return <ImageGeneratorScreen onBack={backAction!} ai={ai} />;
      case Screen.EMAIL_INBOX:
        return <EmailInboxScreen emails={emails} onCompose={handleNavigateComposeEmail} onOpenEmail={handleOpenEmail} />;
      case Screen.EMAIL_COMPOSE:
        return <EmailComposeScreen onBack={backAction!} onSend={handleSendProblemEmail} />;
      case Screen.EMAIL_DETAIL:
        return activeEmail && <EmailDetailScreen email={activeEmail} onBack={backAction!} />;
      case Screen.MAPS:
        return <MapsScreen onBack={backAction!} onAsk={handleAskMapsAgent} onOpenLink={handleNavigateBrowser} />;
      case Screen.SETTINGS:
        return <SettingsScreen onBack={backAction!} onAddContact={handleNavigateAddContact} />;
      case Screen.HOME:
      default:
        return (
          <HomeScreen 
            onOpenContacts={handleNavigateContacts}
            onOpenBrowser={() => handleNavigateBrowser()}
            onOpenCamera={handleNavigateCamera}
            onOpenPhotos={handleNavigatePhotos}
            onOpenEmail={handleNavigateEmail}
            onOpenMaps={handleNavigateMaps}
            onOpenSettings={handleNavigateSettings}
          />
        );
    }
  };

  return (
    <PhoneShell onHome={handleEndInteraction} onBack={backAction}>
      {renderScreen()}
    </PhoneShell>
  );
};

export default App;