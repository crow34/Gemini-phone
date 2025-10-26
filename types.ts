import type { Content } from '@google/genai';

export type VoiceOption = 'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir';

export interface Contact {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
  systemInstruction: string;
  voiceName?: VoiceOption;
  useGoogleSearch?: boolean;
  chatHistory?: Content[];
}

export interface Email {
  id: string;
  sender: 'Aura' | 'user';
  subject: string;
  body: string;
  timestamp: number;
  read: boolean;
}

export interface GroundingChunk {
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
        reviewSnippets: {
            uri: string;
            text: string;
        }[]
    }[]
  };
  web?: {
      uri: string;
      title: string;
  }
}


export enum Screen {
  HOME,
  CONTACTS,
  TEXT_CHAT,
  PHONE_CALL,
  ADD_CONTACT,
  BROWSER,
  CAMERA,
  PHOTOS,
  EMAIL_INBOX,
  EMAIL_COMPOSE,
  EMAIL_DETAIL,
  MAPS,
  SETTINGS,
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}