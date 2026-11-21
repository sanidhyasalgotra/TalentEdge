import { AlertTriangle, ArrowRight, Check, Target } from 'lucide-react'
import ScoreRing from './ScoreRing'
import ReportCharts from './ReportCharts'

const Section = ({ n, title, children }) => (
  <section className="card">
    <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-edge-light text-xs text-edge">{n}</span>
      {title}
    </h2>
    {children}
  </section>
)

const Chips = ({ items, tone = 'neutral' }) =>
  items?.length ? (
    <ul className="flex flex-wrap gap-2">
      {items.map((k) => (
        <li key={k} className={`rounded-full px-3 py-1 text-xs font-medium ${tone === 'good' ? 'bg-edge-light text-edge-dark' : tone === 'warn' ? 'bg-amber-soft text-amber-900' : 'bg-ink/5 text-ink-soft'}`}>{k}</li>
      ))}
    </ul>
  ) : (
    <p className="text-sm text-ink-faint">None identified.</p>
  )

const priorityStyle = { high: 'bg-red-100 text-red-800', medium: 'bg-amber-soft text-amber-900', low: 'bg-ink/5 text-ink-soft' }

export default function AnalysisReport({ result }) {
  const { overall_assessment: o, ats_compatibility: ats, skills_assessment: sk, keywords, experience_evaluation: ex } = result
  return (
    <div className="space-y-4">
      <ReportCharts result={result} />
      <Section n="1" title="Overall assessment">
        <div className="flex flex-wrap items-center gap-6">
          <ScoreRing value={o.score} label="Overall" />
          <p className="min-w-[14rem] flex-1 text-sm leading-relaxed text-ink-soft">{o.summary}</p>
        </div>
      </Section>

      <Section n="2" title="ATS compatibility">
        <div className="flex flex-wrap items-start gap-6">
          <ScoreRing value={ats.score} label="ATS" />
          <div className="min-w-[14rem] flex-1">
            <ul className="list-disc space-y-1 pl-5 text-sm text-ink-soft">{ats.notes.map((n) => <li key={n}>{n}</li>)}</ul>
            <p className="mt-3 text-xs text-ink-faint">An internal estimate of how machine-readable your resume is, not a score from any real ATS.</p>
          </div>
        </div>
      </Section>

      <Section n="3" title="Strengths">
        <ul className="space-y-3">
          {result.strengths.map((s) => (
            <li key={s.point} className="flex gap-3 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-edge" />
              <span><strong>{s.point}</strong>{s.evidence !== 'n/a' && <span className="block text-ink-soft">“{s.evidence}”</span>}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section n="4" title="Weaknesses">
        <ul className="space-y-3">
          {result.weaknesses.map((w) => (
            <li key={w.point} className="flex gap-3 text-sm">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <span><strong>{w.point}</strong><span className="block text-ink-soft">{w.why_it_matters}</span></span>
            </li>
          ))}
        </ul>
      </Section>

      <Section n="5" title="Skills assessment">
        <p className="mb-3 text-sm text-ink-soft">{sk.summary}</p>
        <p className="label">Found in resume</p><Chips items={sk.present} tone="good" />
        <p className="label mt-4">Worth adding if true for you</p><Chips items={sk.recommended} tone="warn" />
      </Section>

      <Section n="6" title="Keywords">
        <p className="label">Present</p><Chips items={keywords.present} tone="good" />
        <p className="label mt-4">Missing or recommended</p><Chips items={keywords.missing} tone="warn" />
      </Section>

      <Section n="7" title="Experience & achievements">
        <p className="mb-3 text-sm text-ink-soft">{ex.summary}</p>
        <p className="label">Quantified achievements</p><Chips items={ex.quantified_achievements} tone="good" />
        <p className="label mt-4">Gaps</p><Chips items={ex.gaps} tone="warn" />
      </Section>

      <Section n="8" title="Recommendations">
        <ol className="space-y-3">
          {result.recommendations.map((r) => (
            <li key={r.action} className="text-sm">
              <span className={`mr-2 rounded px-2 py-0.5 text-xs font-semibold uppercase ${priorityStyle[r.priority]}`}>{r.priority}</span>
              <strong>{r.action}</strong>
              <span className="mt-1 block text-ink-soft">{r.why}</span>
            </li>
          ))}
        </ol>
      </Section>

      {result.bullet_improvements.length > 0 && (
        <section className="card">
          <h2 className="mb-1 font-display text-lg font-bold">Bullet improvements</h2>
          <p className="mb-3 text-xs text-ink-faint">Replace [bracketed] placeholders with your real numbers. Don’t add figures you can’t back up.</p>
          <ul className="space-y-4">
            {result.bullet_improvements.map((b) => (
              <li key={b.original} className="rounded-lg bg-paper p-3 text-sm">
                <p className="text-ink-faint line-through">{b.original}</p>
                <p className="mt-1 flex gap-2 font-medium"><ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-edge" />{b.improved}</p>
                <p className="mt-1 pl-6 text-xs text-ink-soft">{b.reason}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {result.job_match && (
        <section className="card">
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold"><Target className="h-5 w-5 text-edge" /> Role &amp; job alignment</h2>
          <div className="flex flex-wrap items-center gap-6">
            <ScoreRing value={result.job_match.alignment_score} label="Alignment" />
            <p className="min-w-[14rem] flex-1 text-sm text-ink-soft">{result.job_match.summary}</p>
          </div>
          <p className="label mt-4">Matched</p><Chips items={result.job_match.matched_keywords} tone="good" />
          <p className="label mt-4">Missing</p><Chips items={result.job_match.missing_keywords} tone="warn" />
          {result.job_match.suggestions.length > 0 && (
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-ink-soft">{result.job_match.suggestions.map((s) => <li key={s}>{s}</li>)}</ul>
          )}
        </section>
      )}
    </div>
  )
}
