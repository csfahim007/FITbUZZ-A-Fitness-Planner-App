'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/workouts', label: 'Workouts' },
  { href: '/exercises', label: 'Exercises' },
  { href: '/nutrition', label: 'Nutrition' },
];

export function SiteHeader() {
  const { user, isLoading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    setOpen(false);
    router.push('/');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="content-container flex min-h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 font-black tracking-tight text-ink">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint text-lg text-white">F</span>
          <span className="text-xl">FitBuzz</span>
        </Link>

        <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-sm md:hidden" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
          Menu
        </button>

        <nav className={`${open ? 'absolute left-4 right-4 top-20 flex' : 'hidden'} flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-xl md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
          <Link href="/" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Home</Link>
          {!isLoading && user && links.map((link) => (
            <Link key={link.href} href={link.href} className={`rounded-lg px-3 py-2 text-sm font-semibold ${pathname.startsWith(link.href) ? 'bg-lime/40 text-mint' : 'text-slate-600 hover:bg-slate-100'}`} onClick={() => setOpen(false)}>{link.label}</Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link href="/my-account" className="text-sm font-semibold text-slate-600 hover:text-mint">{user.name}</Link>
              <button type="button" onClick={handleLogout} className="rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white hover:bg-mint">Log out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-mint">Log in</Link>
              <Link href="/register" className="rounded-lg bg-mint px-4 py-2 text-sm font-bold text-white hover:bg-ink">Join free</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
