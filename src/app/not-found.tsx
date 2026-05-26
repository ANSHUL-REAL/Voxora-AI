export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#07070f] px-6 py-20 text-white">
      <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
          Voxora AI
        </p>
        <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          The page you are looking for does not exist or has moved.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition hover:bg-zinc-200"
        >
          Back to home
        </a>
      </div>
    </main>
  );
}
