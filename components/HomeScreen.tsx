import React, { useState, useEffect } from 'react';
import StatusBar from './StatusBar';

interface HomeScreenProps {
  onOpenContacts: () => void;
  onOpenBrowser: () => void;
  onOpenCamera: () => void;
  onOpenPhotos: () => void;
  onOpenEmail: () => void;
  onOpenMaps: () => void;
  onOpenSettings: () => void;
}

// Dock Icons
const PhoneAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
  </svg>
);

const BrowserAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.527 1.907 6.011 6.011 0 01-1.631 3.033 2.498 2.498 0 01-1.473 1.318A5.002 5.002 0 0112 15a5 5 0 01-3.232-1.332 2.5 2.5 0 01-1.332-2.366c0-.448.099-.872.28-1.258a6.01 6.01 0 01-2.386-1.019z" clipRule="evenodd" />
  </svg>
);

const MessagesAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H6.414l-2.414 2.414A2 2 0 012 14.586V5z" />
  </svg>
);

const CameraAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);


// Grid App Icons
const PhotosAppIcon = () => (
  <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
    </svg>
  </div>
);

const SettingsAppIcon = () => (
  <div className="w-14 h-14 bg-gray-700 rounded-2xl flex items-center justify-center shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
      </svg>
  </div>
);


const EmailAppIcon = () => (
    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
    </div>
);

const MapsAppIcon = () => (
    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
        <div className="w-full h-full relative">
            <div className="absolute top-0 left-0 w-full h-full bg-green-300"></div>
            <div className="absolute top-1/2 left-0 w-full h-1/2 bg-blue-400"></div>
            <div className="absolute top-1/3 left-1/3 w-2 h-8 bg-yellow-400 transform -rotate-45"></div>
            <div className="absolute top-1/4 left-1/2 w-8 h-2 bg-yellow-400 transform -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
        </div>
    </div>
);


// Weather Icons
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const PartlyCloudyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h1m8-9v1M3.88 5.88l.7.7M16.95 16.95l.7.7M21 12h-1M8 4.05v.01M16 20v-1m4-12.12l-.7-.7M5.88 18.12l-.7-.7M12 21V6a2 2 0 00-2-2H8a4 4 0 00-4 4v.5A3.5 3.5 0 008 11h8a3.5 3.5 0 003.5-3.5V7a2 2 0 00-2-2h-1" /></svg>;
const CloudIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>;
const RainIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15zm4-2v2m4-2v4m4-2v2" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300 inline mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;

interface WeatherData {
  city: string;
  temperature: number;
  weatherCode: number;
}

const WeatherWidget: React.FC = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const [weatherResponse, locationResponse] = await Promise.all([
                        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`),
                        fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
                    ]);

                    if (!weatherResponse.ok || !locationResponse.ok) {
                        throw new Error('Failed to fetch weather or location data.');
                    }
                    
                    const weatherData = await weatherResponse.json();
                    const locationData = await locationResponse.json();
                    
                    const city = locationData.address?.city || locationData.address?.town || locationData.address?.village || 'Current Location';

                    setWeather({
                        city: city,
                        temperature: Math.round(weatherData.current.temperature_2m),
                        weatherCode: weatherData.current.weather_code,
                    });
                    setError(null);

                } catch (err) {
                    console.error("Error fetching data:", err);
                    setError("Could not fetch weather data.");
                }
            },
            (err) => {
                 setError(err.code === err.PERMISSION_DENIED ? "Location access denied." : "Could not get location.");
            }
        );
    }, []);

    const getWeatherIcon = (code: number) => {
        if (code === 0) return <SunIcon />;
        if (code >= 1 && code <= 2) return <PartlyCloudyIcon />;
        if (code === 3) return <CloudIcon />;
        if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <RainIcon />;
        // Add more icon mappings as needed for snow, fog, etc.
        return <CloudIcon />; // Default icon
    };

    return (
         <div className="bg-black/20 backdrop-blur-md rounded-2xl p-3 mt-6 w-full max-w-xs transition-all duration-500">
            {!weather && !error && <p className="text-center text-gray-300 text-sm">Loading weather...</p>}
            {error && <p className="text-center text-yellow-300 text-sm">{error}</p>}
            {weather && (
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        {getWeatherIcon(weather.weatherCode)}
                        <div className="ml-3">
                            <p className="text-4xl font-bold">{weather.temperature}°C</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-semibold flex items-center justify-end"><LocationIcon />{weather.city}</p>
                    </div>
                </div>
            )}
        </div>
    );
};


const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenContacts, onOpenBrowser, onOpenCamera, onOpenPhotos, onOpenEmail, onOpenMaps, onOpenSettings }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const formattedDate = time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  
  return (
    <div className="bg-[url('https://source.unsplash.com/random/412x892?nature,dark,abstract')] bg-cover bg-center text-white h-full flex flex-col">
      <StatusBar />
      
      <div className="flex-grow flex flex-col items-center pt-24 px-4">
         <h1 className="text-7xl font-thin tracking-tight" style={{textShadow: '0 2px 8px rgba(0,0,0,0.7)'}}>{formattedTime}</h1>
         <p className="text-lg" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>{formattedDate}</p>
         <WeatherWidget />
      </div>

      <div className="flex-grow p-4">
        <div className="grid grid-cols-4 gap-y-6">
            <button onClick={onOpenPhotos} className="flex flex-col items-center space-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-white rounded-lg">
                <PhotosAppIcon />
                <span className="text-xs" style={{textShadow: '0 1px 2px rgba(0,0,0,0.8)'}}>Photos</span>
            </button>
             <button onClick={onOpenSettings} className="flex flex-col items-center space-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-white rounded-lg">
                <SettingsAppIcon />
                <span className="text-xs" style={{textShadow: '0 1px 2px rgba(0,0,0,0.8)'}}>Settings</span>
            </button>
             <button onClick={onOpenEmail} className="flex flex-col items-center space-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-white rounded-lg">
                <EmailAppIcon />
                <span className="text-xs" style={{textShadow: '0 1px 2px rgba(0,0,0,0.8)'}}>Email</span>
            </button>
             <button onClick={onOpenMaps} className="flex flex-col items-center space-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-white rounded-lg">
                <MapsAppIcon />
                <span className="text-xs" style={{textShadow: '0 1px 2px rgba(0,0,0,0.8)'}}>Maps</span>
            </button>
        </div>
      </div>

      <div className="bg-black/30 backdrop-blur-lg rounded-t-3xl p-2 m-0 mt-auto">
        <div className="flex justify-around items-center h-16">
            <button
              onClick={onOpenContacts}
              className="p-3 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Open Phone Contacts"
            >
              <PhoneAppIcon />
            </button>
            <button
              onClick={onOpenContacts}
              className="p-3 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Open Messages"
            >
              <MessagesAppIcon />
            </button>
            <button
              onClick={onOpenBrowser}
              className="p-3 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Open Browser"
            >
              <BrowserAppIcon />
            </button>
            <button
              onClick={onOpenCamera}
              className="p-3 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Open Camera"
            >
              <CameraAppIcon />
            </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;