import React, { useState, useEffect, useRef } from 'react';
import { type GroundingChunk } from '../types';

interface MapsAgentResponse {
    text: string;
    chunks: GroundingChunk[];
}

interface MapsScreenProps {
  onBack: () => void;
  onAsk: (query: string) => Promise<MapsAgentResponse | null>;
  onOpenLink: (url: string) => void;
}

interface MapMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    chunks?: GroundingChunk[];
}

// Icons
const BackArrowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" /></svg>;

const MapsScreen: React.FC<MapsScreenProps> = ({ onBack, onAsk, onOpenLink }) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<MapMessage[]>([]);
    const [mapUrl, setMapUrl] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Set initial map to user's location
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setMapUrl(`https://www.google.com/maps/embed/v1/view?zoom=14&center=${latitude},${longitude}&key=${process.env.API_KEY}`);
            },
            () => {
                // Fallback location if geolocation fails or is denied (e.g., San Francisco)
                setMapUrl(`https://www.google.com/maps/embed/v1/view?zoom=12&center=37.7749,-122.4194&key=${process.env.API_KEY}`);
            }
        );
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || isLoading) return;

        const userMessage: MapMessage = { id: Date.now().toString(), sender: 'user', text: query };
        setMessages(prev => [...prev, userMessage]);
        const currentQuery = query;
        setQuery('');
        setIsLoading(true);

        const result = await onAsk(currentQuery);
        if (result) {
            const aiMessage: MapMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: result.text,
                chunks: result.chunks,
            };
            setMessages(prev => [...prev, aiMessage]);
        }
        setIsLoading(false);
    };

    return (
        <div className="bg-gray-900 text-white h-full flex flex-col">
            <header className="flex items-center p-3 border-b border-gray-700 bg-gray-800 z-10 flex-shrink-0">
                <button onClick={onBack} className="mr-3 p-1 rounded-full hover:bg-gray-700"><BackArrowIcon /></button>
                <h1 className="text-xl font-bold">Maps</h1>
            </header>
            
            <div className="h-1/3 flex-shrink-0">
                {mapUrl ? (
                    <iframe
                        src={mapUrl}
                        className="w-full h-full border-none"
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Map"
                    ></iframe>
                ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <p>Loading map...</p>
                    </div>
                )}
            </div>

            <div className="flex-grow flex flex-col p-4 overflow-y-auto">
                 <div className="space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                {msg.chunks && msg.chunks.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-gray-600 space-y-2">
                                        {msg.chunks.map((chunk, index) => chunk.maps && (
                                            <button 
                                                key={index}
                                                onClick={() => onOpenLink(chunk.maps!.uri)}
                                                className="w-full text-left bg-gray-800 hover:bg-gray-600 p-2 rounded-lg transition-colors"
                                            >
                                                <LinkIcon />
                                                <span className="font-semibold">{chunk.maps.title}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-gray-700 rounded-bl-none">
                                <div className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-3 border-t border-gray-700 bg-gray-800 flex items-center flex-shrink-0">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search or ask for directions..."
                    className="flex-grow bg-gray-700 rounded-full py-2 px-4 focus:outline-none"
                    disabled={isLoading}
                />
                <button type="submit" className="ml-3 p-2 bg-blue-600 rounded-full hover:bg-blue-500 disabled:bg-gray-600" disabled={isLoading || !query.trim()}>
                    <SendIcon />
                </button>
            </form>
        </div>
    );
};

export default MapsScreen;