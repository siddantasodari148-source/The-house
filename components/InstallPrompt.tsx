'use client'
import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Check for iOS (to show specific instructions)
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    // 2. Capture the install event (Android/Desktop)
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      });
    }
  };

  if (!deferredPrompt && !isIOS) return null; // Don't show if already installed

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
      {deferredPrompt && (
        <button 
          onClick={handleInstallClick}
          className="bg-[#C6A87C] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold uppercase text-xs tracking-widest animate-bounce"
        >
          <Download size={16} /> Install App
        </button>
      )}
      
      {/* Optional: Small toast for iOS users since they can't use the button */}
      {isIOS && (
        <div className="bg-[#1A1A1A]/90 text-white px-4 py-2 rounded-xl text-[10px] backdrop-blur border border-stone-700">
          Tap <span className="font-bold">Share</span> then <span className="font-bold">Add to Home Screen</span>
        </div>
      )}
    </div>
  );
}