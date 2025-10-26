import React, { useState, useRef, useEffect } from 'react';

interface BrowserScreenProps {
  onBack: () => void;
  initialUrl?: string;
}

// Main back button to exit the browser app
const BackArrowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;

// Browser-specific navigation icons
const BrowserBackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const BrowserForwardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9a7 7 0 10-10.437 5.485" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 5v4h-4" /></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a3 3 0 00-3 3v1H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2h-2V5a3 3 0 00-3-3zm-1 5v1h2V7a1 1 0 10-2 0z" clipRule="evenodd" /></svg>;

const BrowserScreen: React.FC<BrowserScreenProps> = ({ onBack, initialUrl }) => {
  const [urlInput, setUrlInput] = useState(initialUrl || 'https://en.m.wikipedia.org/wiki/Main_Page');
  const [currentUrl, setCurrentUrl] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  // Initial navigation
  useEffect(() => {
    if (urlInput) {
      handleNavigate(urlInput);
    }
  }, []);

  const handleNavigate = (url: string) => {
    let finalUrl = url.trim();
    if (!finalUrl) return;

    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://` + finalUrl;
    }

    setIsLoading(true);
    setError(null);
    setCurrentUrl(finalUrl);
    setUrlInput(finalUrl);

    // Update history, cutting off any 'forward' history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(finalUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (canGoBack) {
      const newIndex = historyIndex - 1;
      const backUrl = history[newIndex];
      setHistoryIndex(newIndex);
      setCurrentUrl(backUrl);
      setUrlInput(backUrl);
      setIsLoading(true);
      setError(null);
    }
  };

  const goForward = () => {
    if (canGoForward) {
      const newIndex = historyIndex + 1;
      const forwardUrl = history[newIndex];
      setHistoryIndex(newIndex);
      setCurrentUrl(forwardUrl);
      setUrlInput(forwardUrl);
      setIsLoading(true);
      setError(null);
    }
  };

  const refresh = () => {
    if (currentUrl) {
      setIsLoading(true);
      setError(null);
      setIframeKey(prev => prev + 1); // Force iframe to reload
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNavigate(urlInput);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
      setIsLoading(false);
      setError(`Could not load page. The website may be offline or has security policies that prevent it from being embedded here.`);
  }

  return (
    <div className="bg-gray-100 text-black h-full flex flex-col">
      <header className="flex items-center p-2 border-b border-gray-300 bg-gray-200 shadow-sm space-x-2">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-300 transition-colors flex-shrink-0">
          <BackArrowIcon />
        </button>
        <button onClick={goBack} disabled={!canGoBack} className="p-2 rounded-full hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:hover:bg-transparent" aria-label="Go back">
          <BrowserBackIcon />
        </button>
        <button onClick={goForward} disabled={!canGoForward} className="p-2 rounded-full hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:hover:bg-transparent" aria-label="Go forward">
          <BrowserForwardIcon />
        </button>
        <button onClick={refresh} disabled={!currentUrl} className="p-2 rounded-full hover:bg-gray-300 transition-colors disabled:opacity-50" aria-label="Refresh page">
          <RefreshIcon />
        </button>
        <form onSubmit={handleFormSubmit} className="flex-grow bg-white rounded-full py-1 px-3 flex items-center border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
          <LockIcon />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Search or type URL"
            className="ml-2 text-sm text-gray-800 w-full bg-transparent focus:outline-none"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
          />
        </form>
      </header>
      
      <main className="flex-grow relative bg-white overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
            <div className="text-gray-500 font-medium">Loading...</div>
          </div>
        )}
        {error && !isLoading && (
             <div className="p-6 text-center text-red-700 flex flex-col justify-center items-center h-full bg-red-50">
                <h2 className="text-lg font-bold mb-2">Page Load Error</h2>
                <p className="text-sm">{error}</p>
            </div>
        )}
        {!error && currentUrl ? (
          <iframe
            key={iframeKey}
            src={currentUrl}
            className="w-full h-full border-none"
            title="Web Browser"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          />
        ) : !error && !isLoading && (
            <div className="p-6 text-center text-gray-500 flex flex-col justify-center items-center h-full">
                <h2 className="text-xl font-semibold mb-2">AI Employee Connect Browser</h2>
                <p>Enter a web address in the bar above to start.</p>
                <p className="text-xs mt-4 p-2 bg-yellow-100 text-yellow-800 rounded-md max-w-xs">
                    Note: For security reasons, some websites (like Google or Facebook) may not load inside this browser.
                </p>
            </div>
        )}
      </main>
    </div>
  );
};

export default BrowserScreen;