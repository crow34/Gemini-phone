import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveSession, Modality, Blob, LiveServerMessage } from '@google/genai';
import { type Contact } from '../types';
import { encode, decode, decodeAudioData } from '../utils/audio';

interface PhoneCallScreenProps {
  contact: Contact;
  onEndCall: () => void;
  ai: GoogleGenAI;
}

const PhoneHangupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2 2m-2-2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V6m2-2l2 2m-2-2l2-2" /></svg>;

const PhoneCallScreen: React.FC<PhoneCallScreenProps> = ({ contact, onEndCall, ai }) => {
  const [callStatus, setCallStatus] = useState('Connecting...');
  const [callDuration, setCallDuration] = useState(0);
  const sessionRef = useRef<LiveSession | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    // Fix: Use browser-compatible type for setInterval return value instead of NodeJS.Timeout.
    let durationInterval: ReturnType<typeof setInterval>;

    const createBlob = (data: Float32Array): Blob => {
      const l = data.length;
      const int16 = new Int16Array(l);
      for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
      }
      return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
      };
    };

    const startCall = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
        }

        // Fix: Cast window to `any` to access legacy webkitAudioContext for broader browser compatibility.
        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        // Fix: Cast window to `any` to access legacy webkitAudioContext for broader browser compatibility.
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        
        streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

        const finalSystemInstruction = `ROLE AND PERSONA: Your primary instruction is to fully embody the following persona. Adhere to it strictly throughout our entire conversation.
---
${contact.systemInstruction}
---

RESPONSE STYLE: Always respond in a natural, conversational, and human-like manner. Avoid being overly formal or robotic.

MEMORY: Remember and refer to past parts of our conversation to show you're paying attention and to build a continuous dialogue.`;

        const sessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: contact.voiceName || 'Zephyr' }}},
                systemInstruction: finalSystemInstruction,
            },
            callbacks: {
              onopen: () => {
                setCallStatus('Connected');
                durationInterval = setInterval(() => setCallDuration(prev => prev + 1), 1000);
                
                const source = inputAudioContextRef.current!.createMediaStreamSource(streamRef.current!);
                scriptProcessorRef.current = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);

                scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                    const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                    const pcmBlob = createBlob(inputData);
                    sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
                };

                source.connect(scriptProcessorRef.current);
                scriptProcessorRef.current.connect(inputAudioContextRef.current!.destination);
              },
              onmessage: async (message: LiveServerMessage) => {
                  const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                  if (base64Audio && outputAudioContextRef.current) {
                      nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
                      const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current, 24000, 1);
                      const source = outputAudioContextRef.current.createBufferSource();
                      source.buffer = audioBuffer;
                      source.connect(outputAudioContextRef.current.destination);
                      source.addEventListener('ended', () => {
                        sourcesRef.current.delete(source);
                      });
                      source.start(nextStartTimeRef.current);
                      nextStartTimeRef.current += audioBuffer.duration;
                      sourcesRef.current.add(source);
                  }
                   if (message.serverContent?.interrupted) {
                      for (const source of sourcesRef.current.values()) {
                        source.stop();
                        sourcesRef.current.delete(source);
                      }
                      nextStartTimeRef.current = 0;
                    }
              },
              onerror: (e: Error) => {
                console.error('Gemini Live API Error:', e);
                setCallStatus('Error');
              },
              onclose: () => {
                setCallStatus('Call Ended');
              },
            }
        });
        
        sessionRef.current = await sessionPromise;

      } catch (err) {
        console.error('Failed to start call:', err);
        setCallStatus('Failed to connect');
      }
    };

    startCall();

    return () => {
      clearInterval(durationInterval);
      if (sessionRef.current) {
        sessionRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
      }
      if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
        inputAudioContextRef.current.close();
      }
      if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
        outputAudioContextRef.current.close();
      }
      sourcesRef.current.forEach(source => source.stop());
    };
  }, [ai, contact, onEndCall]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="bg-gray-900 text-white h-full flex flex-col items-center justify-between p-8">
      <div className="text-center mt-16">
        <img src={contact.avatarUrl} alt={contact.name} className="w-32 h-32 rounded-full mx-auto border-4 border-gray-600" />
        <h2 className="text-3xl font-bold mt-4">{contact.name}</h2>
        <p className="text-gray-400 mt-2">{callStatus === 'Connected' ? formatDuration(callDuration) : callStatus}</p>
      </div>

      <div className="mb-8">
        <button onClick={onEndCall} className="bg-red-600 p-5 rounded-full hover:bg-red-700 transition-transform transform hover:scale-110">
          <PhoneHangupIcon />
        </button>
      </div>
    </div>
  );
};

export default PhoneCallScreen;