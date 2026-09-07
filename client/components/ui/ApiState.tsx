export function ApiState({ message = 'Something went wrong.', onRetry }: { message?: string; onRetry?: () => void }) {
  return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800"><p>{message}</p>{onRetry && <button type="button" onClick={onRetry} className="mt-4 rounded-lg bg-red-700 px-4 py-2 font-semibold text-white">Try again</button>}</div>;
}
