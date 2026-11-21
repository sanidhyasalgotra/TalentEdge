export default function ScoreRing({ value, label, size = 112 }) {
  const r = 44
  const c = 2 * Math.PI * r
  const tone = value >= 75 ? '#0E7C66' : value >= 50 ? '#B7791F' : '#B83232'
  return (
    <figure className="flex flex-col items-center" aria-label={`${label}: ${value} out of 100`}>
      <svg width={size} height={size} viewBox="0 0 100 100" role="img">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#14213D1A" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r} fill="none" stroke={tone} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} transform="rotate(-90 50 50)"
        />
        <text x="50" y="56" textAnchor="middle" className="fill-ink font-display" fontSize="24" fontWeight="700">{value}</text>
      </svg>
      <figcaption className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-soft">{label}</figcaption>
    </figure>
  )
}
