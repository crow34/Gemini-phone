import React from 'react';
import NavBar from './NavBar';

interface PhoneShellProps {
  children: React.ReactNode;
  onHome: () => void;
  onBack?: () => void;
}

const PhoneShell: React.FC<PhoneShellProps> = ({ children, onHome, onBack }) => {
  return (
    <div className="bg-black border-4 border-gray-700 rounded-3xl p-1 shadow-2xl w-[360px] h-[740px] md:w-[412px] md:h-[892px]">
      <div className="bg-gray-900 w-full h-full rounded-2xl flex flex-col overflow-hidden relative">
        <div className="flex-grow overflow-y-auto relative">
          {children}
        </div>
        <NavBar onHome={onHome} onBack={onBack} />
      </div>
    </div>
  );
};

export default PhoneShell;