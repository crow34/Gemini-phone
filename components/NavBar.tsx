import React from 'react';

interface NavBarProps {
    onHome: () => void;
    onBack?: () => void;
}

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const OverviewIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <rect x="6" y="6" width="12" height="12" rx="1" strokeWidth={2} />
    </svg>
);


const NavBar: React.FC<NavBarProps> = ({ onHome, onBack }) => {
    return (
        <div className="bg-gray-900 text-white w-full flex justify-around items-center py-2 z-10 border-t border-gray-800">
            <button 
                onClick={onBack} 
                className="p-2 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                disabled={!onBack}
                aria-label="Go back"
            >
                <BackIcon />
            </button>
            <button 
                onClick={onHome} 
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                aria-label="Go to home screen"
            >
                <HomeIcon />
            </button>
            <button 
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                aria-label="Show overview"
            >
                <OverviewIcon />
            </button>
        </div>
    );
};

export default NavBar;