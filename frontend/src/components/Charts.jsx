import { useEffect, useState } from 'react'

const TRACK = 'rgba(20, 33, 61, 0.08)'

// Triggers the "grow" animation one frame after the first paint.
function useReady() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return ready
}

export function scoreColor(v) {
  return v >= 75 ? '#0E7C66' : v >= 50 ? '#B7791F' : '#B83232'
}

export function ChartCard({ title, caption, children }) {
  return (
    <div className="flex flex-col rounded-xl border border-ink/10 bg-white p-4">
      <h3 className="font-display text-base font-bold">{title}</h3>
      {caption && <p className="mt-0.5 text-xs text-ink-faint">{caption}</p>}
      <div className="mt-3 flex-1">{children}</div>
    </div>
  )
}

export function Legend({ data }) {
  return (
    <ul className="mt-3 space-y-1.5">
      {data.map((d) => (
        <li key={d.label} className="flex items-center justify-between gap-3 text-sm">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: d.color }} aria-hidden="true" />
            {d.label}
          </span>
          <span className="font-semibold">{d.value}</span>
        </li>
      ))}
    </ul>
  )
}

// Donut / pie chart drawn with SVG. data: [{ label, value, color }]
export function DonutChart({ data, centerValue, centerLabel, size = 132 }) {
  const ready = useReady()
  const r = 40
  const c = 2 * Math.PI * r
  const total = data.reduce((s, d) => s + d.value, 0)
  let used = 0
  const summary = data.map((d) => `${d.label}: ${d.value}`).join(', ')

  return (
    <div>
      <div className="flex justify-center">
        <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={summary}>
          <circle cx="50" cy="50" r={r} fill="none" stroke={TRACK} strokeWidth="13" />
          {total > 0 &&
            data
              .filter((d) => d.value > 0)
              .map((d) => {
                const len = (d.value / total) * c
                const offset = -used
                used += len
                return (
                  <circle
                    key={d.label}
                    cx="50" cy="50" r={r} fill="none"
                    stroke={d.color} strokeWidth="13"
                    strokeDasharray={ready ? `${len} ${c - len}` : `0 ${c}`}
                    strokeDashoffset={offset}
                    transform="rotate(-90 50 50)"
                    style={{ transition: 'stroke-dasharray 900ms ease' }}
                  />
                )
              })}
          <text x="50" y={centerLabel ? 52 : 56} textAnchor="middle" className="fill-ink font-display" fontSize="19" fontWeight="700">
            {total > 0 ? centerValue : '—'}
          </text>
          {centerLabel && total > 0 && (
            <text x="50" y="65" textAnchor="middle" fontSize="7.5" fill="#4A5568">{centerLabel}</text>
          )}
        </svg>
      </div>
      <Legend data={data} />
    </div>
  )
}

// Horizontal bars. items: [{ label, value, color, display }], max = value that fills the bar
export function BarList({ items, max = 100 }) {
  const ready = useReady()
  return (
    <ul className="space-y-4">
      {items.map((it) => (
        <li key={it.label}>
          <div className="mb-1 flex items-baseline justify-between text-sm">
            <span>{it.label}</span>
            <span className="font-semibold">{it.display ?? it.value}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-ink/10" role="meter" aria-label={it.label} aria-valuenow={it.value} aria-valuemin={0} aria-valuemax={max}>
            <div
              className="h-full rounded-full"
              style={{
                width: ready && max > 0 ? `${Math.min(100, (it.value / max) * 100)}%` : '0%',
                backgroundColor: it.color,
                transition: 'width 900ms ease',
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
