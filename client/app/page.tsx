import Link from 'next/link';
import { FitnessAssistant } from '@/components/chat/FitnessAssistant';

const featureCards = [
  {
    number: '01',
    title: 'Plan workouts',
    description: 'Build routines around your exact goals, calendar, and available equipment.',
  },
  {
    number: '02',
    title: 'Track the details',
    description: 'Capture sets, reps, calories, and habit signals without slowing down your flow.',
  },
  {
    number: '03',
    title: 'Stay consistent',
    description: 'See progress in one place and turn busy weeks into repeatable wins.',
  },
];

const bodyHighlights = [
  'Exercise library for strength, conditioning, and recovery sessions',
  'Nutrition logging with calorie and macro clarity',
  'Workouts that are easy to revisit and adjust when life changes',
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <section className="bg-ink py-20 text-white">
        <div className="content-container grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-lime">Your training, with intent</p>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl">
              Build the routine you can actually keep.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">
              FitBuzz keeps workouts, exercises, nutrition, and progress in one calm place so your next session is always clear.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/register" className="rounded-lg bg-lime px-6 py-3 font-bold text-ink transition hover:bg-white">
                Start planning
              </Link>
              <Link href="/login" className="rounded-lg border border-slate-600 px-6 py-3 font-bold text-white transition hover:border-lime hover:text-lime">
                Sign in
              </Link>
            </div>
            <div className="mt-10 grid max-w-lg gap-4 sm:grid-cols-3">
              <StatBox value="10K+" label="members" />
              <StatBox value="250K" label="sessions" />
              <StatBox value="92%" label="consistency" />
            </div>
          </div>

          <div className="relative min-h-[28rem] overflow-hidden rounded-[2rem] border border-slate-700 bg-slate-900 shadow-2xl">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/abhishek-dutta-K7m_ZPBwZ-Q-unsplash.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-ink/30 via-ink/10 to-ink/70" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-lime">Progress is a practice</p>
              <p className="mt-3 text-2xl font-black text-white">Train with structure. Recover with intention.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-container grid gap-5 py-16 md:grid-cols-3">
        {featureCards.map((card) => (
          <article key={card.number} className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
            <p className="text-3xl font-black text-mint">{card.number}</p>
            <h2 className="mt-5 text-xl font-black">{card.title}</h2>
            <p className="mt-3 text-slate-600">{card.description}</p>
          </article>
        ))}
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="content-container grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-stretch">
          <div className="rounded-[2rem] border-2 border-black bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)] sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-mint">Built for real plans</p>
            <h2 className="mt-3 text-3xl font-black text-ink sm:text-4xl">Everything you need, without the noise.</h2>
            <ul className="mt-6 space-y-4 text-slate-600">
              {bodyHighlights.map((item) => (
                <li key={item} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-mint" />
                  <span className="leading-7">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-100 p-6 text-ink shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)] sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-mint">Coach in your pocket</p>
            <h2 className="mt-3 text-3xl font-black">A better system for training and recovery.</h2>
            <div className="mt-6 space-y-4 text-slate-700">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="font-bold text-ink">Weekly focus</p>
                <p className="mt-1">Strength + mobility with a simple recovery rhythm.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="font-bold text-ink">Nutrition cues</p>
                <p className="mt-1">Log food, review consistency, and keep energy high.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="font-bold text-ink">Body-first progress</p>
                <p className="mt-1">Use your own data to keep training sustainable and motivating.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-container py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <FeaturePill title="Body" description="Train for strength, capacity, and confidence with visible momentum." />
          <FeaturePill title="CTO" description="Keep your coaching targets and priorities aligned with your weekly plan." />
          <FeaturePill title="Universal access" description="Stay connected across workouts, meals, and progress from one place." />
        </div>
      </section>

      <div className="content-container pb-16 pt-4">
        <div className="rounded-[2rem] bg-gradient-to-r from-mint to-lime p-8 text-center text-ink shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-ink/70">Ready to begin?</p>
          <h2 className="mt-3 text-3xl font-black">Make your next workout easier to start.</h2>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/register" className="rounded-lg bg-ink px-6 py-3 font-bold text-white">
              Join FitBuzz
            </Link>
            <Link href="/login" className="rounded-lg border border-ink/30 bg-white/60 px-6 py-3 font-bold text-ink">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      <FitnessAssistant />
    </div>
  );
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-white/5 p-3 text-center backdrop-blur-sm">
      <p className="text-xl font-black text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">{label}</p>
    </div>
  );
}

function FeaturePill({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-mint">{title}</p>
      <p className="mt-3 text-slate-600">{description}</p>
    </div>
  );
}
