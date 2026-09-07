'use client';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <div className="content-container py-24 text-center"><h1 className="text-3xl font-black">We hit a snag.</h1><p className="mt-3 text-slate-600">The page could not load right now.</p><button type="button" onClick={reset} className="mt-6 rounded-lg bg-mint px-5 py-3 font-bold text-white">Try again</button></div>; }
