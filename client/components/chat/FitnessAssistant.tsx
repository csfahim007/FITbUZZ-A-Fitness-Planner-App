'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    botpress?: {
      init: (options: Record<string, unknown>) => void;
      open: () => void;
      close: () => void;
      on: (event: string, callback: () => void) => void;
    };
  }
}

const injectUrl = 'https://cdn.botpress.cloud/webchat/v3.1/inject.js';
const configUrl = 'https://files.bpcontent.cloud/2025/07/23/04/20250723044542-SQAWDIIO.js';

export function FitnessAssistant() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.botpress) { setReady(true); return; }
    const inject = document.createElement('script'); inject.src = injectUrl; inject.async = true;
    inject.onload = () => { const config = document.createElement('script'); config.src = configUrl; config.async = true; config.onload = () => { window.botpress?.init({ botId: 'ded83eb0-0b00-4e32-87ab-f1072ae3b0dc', clientId: 'dc4d0166-da23-4e60-bdc5-a19f888a4935', selector: '#fitbuzz-webchat', configuration: { version: 'v1', botName: 'Fitness Assistant', botDescription: 'Your AI fitness companion', color: '#0f766e', variant: 'solid', themeMode: 'light', showFloatingButton: false } }); setReady(true); }; document.head.appendChild(config); }; document.head.appendChild(inject);
  }, []);
  useEffect(() => { if (ready && window.botpress) { if (open) window.botpress.open(); else window.botpress.close(); } }, [open, ready]);
  return <><button type="button" onClick={() => setOpen((value) => !value)} className="fixed bottom-6 right-6 z-50 rounded-full bg-mint px-5 py-3 text-sm font-bold text-white shadow-xl hover:bg-ink">{open ? 'Close assistant' : 'Fitness assistant'}</button>{open && <div className="fixed bottom-20 right-6 z-40 h-[min(32rem,calc(100vh-7rem))] w-[min(24rem,calc(100vw-3rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"><div className="flex items-center justify-between bg-ink px-5 py-4 text-white"><div><p className="font-black">Fitness Assistant</p><p className="text-xs text-slate-300">Ask about your routine</p></div><button type="button" onClick={() => setOpen(false)} aria-label="Close assistant" className="text-xl">×</button></div><div id="fitbuzz-webchat" className="h-[calc(100%-4.5rem)]">{!ready && <p className="p-6 text-sm text-slate-500">Loading assistant...</p>}</div></div>}</>;
}
