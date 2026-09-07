import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="content-container grid gap-10 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 font-black tracking-tight text-white">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint text-lg text-ink">F</span>
            <span className="text-xl">FitBuzz</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
            Fitness planning that keeps your body, habits, and progress aligned without the noise.
          </p>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-white">Product</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li><Link href="/dashboard" className="hover:text-lime">Dashboard</Link></li>
            <li><Link href="/workouts" className="hover:text-lime">Workouts</Link></li>
            <li><Link href="/exercises" className="hover:text-lime">Exercises</Link></li>
            <li><Link href="/nutrition" className="hover:text-lime">Nutrition</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-white">Company</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li><Link href="/contact" className="hover:text-lime">Contact</Link></li>
            <li><Link href="/terms" className="hover:text-lime">Terms</Link></li>
            <li><Link href="/privacy" className="hover:text-lime">Privacy</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-white">Built for</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li>Body-first routines</li>
            <li>Recovery-aware planning</li>
            <li>Simple weekly progress</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="content-container flex flex-col gap-3 py-5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} FitBuzz. Built for consistent progress.</p>
          <nav className="flex gap-5">
            <Link href="/terms" className="hover:text-lime">Terms</Link>
            <Link href="/privacy" className="hover:text-lime">Privacy</Link>
            <Link href="/contact" className="hover:text-lime">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
