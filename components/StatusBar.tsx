import React, { useState, useEffect } from 'react';

const WifiIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.556A5.5 5.5 0 0115.889 16.556M12 20h.01m-7.08-7.071a10 10 0 0114.142 0M5.636 8.636a15 15 0 012.828-2.828m8.486 0a15 15 0 012.828 2.828" />
    </svg>
);

const SignalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 15.5v-3.5c0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5v3.5c0 .28-.22.5-.5.5h-1c-.28 0-.5-.22-.5-.5zM6.5 15.5v-7c0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5v7c0 .28-.22.5-.5.5h-1c-.28 0-.5-.22-.5-.5zM11 15.5v-10c0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5v10c0 .28-.22.5-.5.5h-1c-.28 0-.5-.22-.5-.5zM15.5 15.5v-13c0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5v13c0 .28-.22.5-.5.5h-1c-.28 0-.5-.22-.5-.5z"/>
  </svg>
);

const BatteryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 6a1 1 0 011-1h10a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V6zm11.5 3.5a.5.5 0 010 1H16v-1h-1.5z" clipRule="evenodd" />
    </svg>
);


const StatusBar: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 60000);
        return () => clearInterval(timerId);
    }, []);

    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="bg-gray-900/50 backdrop-blur-sm text-white text-xs px-4 py-1 flex justify-between items-center w-full z-10 absolute top-0 left-0">
            <span className="font-semibold">{formattedTime}</span>
            <div className="flex items-center space-x-2">
                <SignalIcon />
                <WifiIcon />
                <span>100%</span>
                <BatteryIcon />
            </div>
        </div>
    );
};

export default StatusBar;