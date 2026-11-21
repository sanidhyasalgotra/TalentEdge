export default function ScoreMeter({ value, label }) {
  const tone = value >= 75 ? 'bg-good' : value >= 50 ? 'bg-warn' : 'bg-bad'
  return (
    <div className="w-44 shrink-0" role="meter" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-1 text-4xl font-semibold tabular-nums text-ink">
        {value}
        <span className="ml-1 text-base font-normal text-muted">/ 100</span>
      </p>
      <div className="mt-3 h-1.5 w-full rounded-full bg-line">
        <div className={`h-1.5 rounded-full ${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
