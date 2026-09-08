import type { Metadata } from 'next';
import { AuthInitializer } from '@/components/auth/AuthProvider';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import './globals.css';

export const metadata: Metadata = { title: 'FitBuzz', description: 'Plan, track, and improve your fitness.' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AuthInitializer><div className="flex min-h-screen flex-col"><SiteHeader /><main className="flex-1">{children}</main><SiteFooter /></div></AuthInitializer></body></html>;
}
