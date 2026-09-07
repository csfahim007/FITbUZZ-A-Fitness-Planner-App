import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="content-container flex flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} FitBuzz. Built for consistent progress.</p>
        <nav className="flex gap-5"><Link href="/terms" className="hover:text-mint">Terms</Link><Link href="/privacy" className="hover:text-mint">Privacy</Link><Link href="/contact" className="hover:text-mint">Contact</Link></nav>
      </div>
    </footer>
  );
}
