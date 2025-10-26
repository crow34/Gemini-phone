import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveSession, Blob, LiveServerMessage } from '@google/genai';
import { encode } from '../utils/audio';

interface CameraScreenProps {
  onBack: () => void;
  ai: GoogleGenAI;
}

// Icons
const BackArrowIcon = () => <svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const MicIcon = () => <svg xmlns="http://www.w.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-12 0H3a7.001 7.001 0 006 6.93V17H7a1 1 0 100 2h6a1 1 0 100-2h-2v-2.07z" clipRule="evenodd" /></svg>;
const CameraIcon = () => <svg xmlns="http://www.w.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>;

const CameraScreen: React.FC<CameraScreenProps> = ({ onBack, ai }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For visual query
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  const sessionRef = useRef<LiveSession | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const transcriptRef = useRef(''); // Ref to accumulate transcript chunks

  useEffect(() => {
    const startCamera = async () => {
      try {
        if (cameraStreamRef.current) {
            cameraStreamRef.current.getTracks().forEach(track => track.stop());
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        cameraStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraReady(true);
        setError(null);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access the camera. Please ensure permissions are granted.");
      }
    };
    startCamera();

    return () => {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(track => track.stop());
      }
      // Ensure any active recording resources are cleaned up on component unmount
      stopRecording(false); 
    };
  }, []);

  const captureFrame = (): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg').split(',')[1];
      }
    }
    return null;
  };
  
  const handleVisualQuery = async (query: string) => {
    if (!query.trim() || !cameraReady) return;
    
    setIsLoading(true);
    setResponse('');
    setError(null);
    
    const frame = captureFrame();
    if (!frame) {
      setError("Failed to capture frame from camera.");
      setIsLoading(false);
      return;
    }

    try {
      const imagePart = { inlineData: { mimeType: 'image/jpeg', data: frame } };
      const textPart = { text: query };

      const geminiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [textPart, imagePart] },
      });
      
      setResponse(geminiResponse.text);
    } catch (err) {
      console.error("Gemini API error:", err);
      setError("Sorry, I couldn't process that request.");
    } finally {
      setIsLoading(false);
    }
  };

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

  const startRecording = async () => {
    if (isRecording || isLoading) return;
    setIsRecording(true);
    setResponse('');
    setTranscript('');
    setError(null);
    transcriptRef.current = '';

    try {
        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        audioStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

        const sessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            config: { inputAudioTranscription: {} },
            callbacks: {
              onopen: () => {
                const source = inputAudioContextRef.current!.createMediaStreamSource(audioStreamRef.current!);
                scriptProcessorRef.current = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);

                scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                    const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                    const pcmBlob = createBlob(inputData);
                    sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
                };

                source.connect(scriptProcessorRef.current);
                scriptProcessorRef.current.connect(inputAudioContextRef.current!.destination);
              },
              onmessage: (message: LiveServerMessage) => {
                const text = message.serverContent?.inputTranscription?.text;
                if (text) {
                  transcriptRef.current += text;
                  setTranscript(transcriptRef.current);
                }
              },
              onerror: (e: Error) => {
                console.error('Gemini Live API Error:', e);
                setError('Audio transcription failed.');
                stopRecording(false);
              },
              onclose: () => {},
            }
        });
        sessionRef.current = await sessionPromise;
    } catch (err) {
        console.error("Failed to start recording:", err);
        setError("Could not access microphone.");
        setIsRecording(false);
    }
  };

  const stopRecording = (askQuery = true) => {
    if (!isRecording) return;
    setIsRecording(false);
    
    if (askQuery && transcriptRef.current.trim()) {
        handleVisualQuery(transcriptRef.current);
    }

    if (sessionRef.current) sessionRef.current.close();
    if (audioStreamRef.current) audioStreamRef.current.getTracks().forEach(track => track.stop());
    if (scriptProcessorRef.current) scriptProcessorRef.current.disconnect();
    if (inputAudioContextRef.current?.state !== 'closed') inputAudioContextRef.current.close();
  };

  return (
    <div className="bg-black text-white h-full flex flex-col">
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center p-3 bg-black/50 backdrop-blur-sm">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-white/20"><BackArrowIcon /></button>
        <h1 className="text-xl font-bold ml-3">Camera Assistant</h1>
      </header>
      
      <main className="flex-grow relative flex flex-col justify-end">
        <video ref={videoRef} autoPlay playsInline className="absolute top-0 left-0 w-full h-full object-cover z-0" />
        <canvas ref={canvasRef} className="hidden" />

        {!cameraReady && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 p-4">
                <CameraIcon />
                <p className="mt-4 text-center">{error || "Starting camera..."}</p>
            </div>
        )}

        <div className="relative z-10 p-4 space-y-3 bg-gradient-to-t from-black via-black/80 to-transparent">
          {response && !isLoading && (
            <div className="bg-black/60 backdrop-blur-md rounded-lg p-3 text-sm max-h-32 overflow-y-auto">
              <p className="font-bold text-gray-300 mb-1">Response:</p>
              <p className="whitespace-pre-wrap">{response}</p>
            </div>
          )}
          
           {transcript && (
            <div className="bg-black/60 backdrop-blur-md rounded-lg p-3 text-sm">
               <p className="font-bold text-gray-300 mb-1">You said:</p>
              <p className="italic text-gray-200">"{transcript}"</p>
            </div>
          )}

          {isLoading && (
              <div className="bg-black/60 backdrop-blur-md rounded-lg p-3 text-sm text-center">
                  <p>Thinking...</p>
              </div>
          )}

          <div className="flex items-center justify-center pt-2">
            <button
              onMouseDown={startRecording}
              onMouseUp={() => stopRecording()}
              onTouchStart={startRecording}
              onTouchEnd={() => stopRecording()}
              className={`p-4 rounded-full transition-all duration-200 ${isRecording ? 'bg-red-600 scale-110' : 'bg-blue-600'} disabled:bg-gray-600`}
              disabled={!cameraReady || isLoading}
              aria-label={isRecording ? 'Release to ask' : 'Press and hold to speak'}
            >
              <MicIcon />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CameraScreen;