import { RegisterForm } from '@/components/auth/AuthForm';

export default function RegisterPage() { return <section className="content-container flex min-h-[calc(100vh-9rem)] items-center justify-center py-12"><div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm"><p className="text-sm font-bold uppercase tracking-widest text-mint">Make it yours</p><h1 className="mt-3 text-3xl font-black">Create your account</h1><p className="mt-3 mb-8 text-slate-600">Set a goal, make a plan, and keep the signal visible.</p><RegisterForm /></div></section>; }
