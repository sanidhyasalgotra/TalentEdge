// Decorative only: an abstract document being scanned. Shows no real data.
const bars = ['w-1/2', 'w-full', 'w-5/6', 'w-2/3', 'w-full', 'w-3/4', 'w-1/2', 'w-5/6', 'w-2/3']
const lit = new Set([1, 4, 7])

export default function HeroArt() {
  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-[19rem]" aria-hidden="true">
      <div className="absolute -inset-6 rounded-full bg-neon/10 blur-3xl" />
      <div className="relative h-full overflow-hidden rounded-2xl border border-line bg-panel p-6 shadow-glow">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full border border-neon/40 bg-neon/10" />
          <div className="space-y-2">
            <div className="h-2 w-24 rounded bg-white/20" />
            <div className="h-2 w-16 rounded bg-white/10" />
          </div>
        </div>
        <div className="space-y-3.5">
          {bars.map((w, i) => (
            <div key={i} className={`h-2 rounded ${w} ${lit.has(i) ? 'bg-neon/40' : 'bg-white/10'}`} />
          ))}
        </div>
        <div className="absolute inset-x-0 h-20 animate-scan bg-gradient-to-b from-transparent via-neon/15 to-transparent">
          <div className="absolute inset-x-0 bottom-0 h-px bg-neon/70 shadow-glow-sm" />
        </div>
      </div>
      <span className="absolute -left-3 -top-3 h-5 w-5 border-l border-t border-gold/70" />
      <span className="absolute -right-3 -top-3 h-5 w-5 border-r border-t border-gold/70" />
      <span className="absolute -bottom-3 -left-3 h-5 w-5 border-b border-l border-gold/70" />
      <span className="absolute -bottom-3 -right-3 h-5 w-5 border-b border-r border-gold/70" />
    </div>
  )
}
