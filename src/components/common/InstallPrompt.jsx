import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [prompt, setPrompt]     = useState(null);
  const [visible, setVisible]   = useState(false);
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('pwa-install-dismissed') === 'true'
  );

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
      if (!dismissed) setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [dismissed]);

  const install = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setVisible(false);
  };

  const dismiss = () => {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 z-50 max-w-sm mx-auto">
      <div className="bg-navy-900 text-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
          A
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">Install Atilia</p>
          <p className="text-xs text-navy-300 mt-0.5">Add to your home screen for quick access</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={dismiss}
            className="text-navy-400 hover:text-white text-xs px-2 py-1 rounded-lg transition-colors"
          >
            Later
          </button>
          <button
            onClick={install}
            className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
