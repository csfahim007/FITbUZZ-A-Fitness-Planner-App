import Link from 'next/link';

export default function NotFound() { return <div className="content-container py-24 text-center"><p className="text-sm font-bold uppercase tracking-widest text-mint">404</p><h1 className="mt-3 text-4xl font-black">Page not found</h1><Link href="/" className="mt-6 inline-block rounded-lg bg-mint px-5 py-3 font-bold text-white">Back home</Link></div>; }
