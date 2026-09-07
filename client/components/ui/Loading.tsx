export function Loading({ label = 'Loading your plan...' }: { label?: string }) {
  return <div className="grid min-h-48 place-items-center text-sm font-semibold text-slate-500"><div className="flex items-center gap-3"><span className="h-3 w-3 animate-pulse rounded-full bg-mint" />{label}</div></div>;
}
