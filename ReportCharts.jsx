import { BarList, ChartCard, DonutChart, scoreColor } from './Charts'

const TEAL = '#0E7C66'
const AMBER = '#B7791F'
const RED = '#B83232'
const SLATE = '#8A93A3'

const pct = (found, missing) => (found + missing > 0 ? `${Math.round((found / (found + missing)) * 100)}%` : '—')

// Every number below comes straight from the validated analysis. Nothing is estimated or invented.
export default function ReportCharts({ result }) {
  const o = result.overall_assessment
  const ats = result.ats_compatibility
  const kw = result.keywords
  const sk = result.skills_assessment
  const jm = result.job_match
  const recs = result.recommendations

  const scores = [
    { label: 'Overall', value: o.score, color: scoreColor(o.score), display: `${o.score} / 100` },
    { label: 'ATS compatibility', value: ats.score, color: scoreColor(ats.score), display: `${ats.score} / 100` },
  ]
  if (jm) scores.push({ label: 'Job alignment', value: jm.alignment_score, color: scoreColor(jm.alignment_score), display: `${jm.alignment_score} / 100` })

  const count = (p) => recs.filter((r) => r.priority === p).length

  return (
    <section className="card" aria-label="Results at a glance">
      <h2 className="mb-1 font-display text-xl font-bold">Results at a glance</h2>
      <p className="mb-4 text-xs text-ink-faint">Charts are drawn from the analysis below. Counts show how many items the report lists.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ChartCard title="Scores" caption="Out of 100">
          <BarList items={scores} max={100} />
        </ChartCard>

        <ChartCard title="Keywords" caption="Found vs missing">
          <DonutChart
            centerValue={pct(kw.present.length, kw.missing.length)}
            centerLabel="found"
            data={[
              { label: 'Found in resume', value: kw.present.length, color: TEAL },
              { label: 'Missing', value: kw.missing.length, color: AMBER },
            ]}
          />
        </ChartCard>

        <ChartCard title="Skills" caption="Found vs recommended">
          <DonutChart
            centerValue={pct(sk.present.length, sk.recommended.length)}
            centerLabel="found"
            data={[
              { label: 'Found in resume', value: sk.present.length, color: TEAL },
              { label: 'Worth adding', value: sk.recommended.length, color: AMBER },
            ]}
          />
        </ChartCard>

        <ChartCard title="Strengths vs weaknesses" caption="Points raised in this report">
          <DonutChart
            centerValue={String(result.strengths.length + result.weaknesses.length)}
            centerLabel="points"
            data={[
              { label: 'Strengths', value: result.strengths.length, color: TEAL },
              { label: 'Weaknesses', value: result.weaknesses.length, color: RED },
            ]}
          />
        </ChartCard>

        <ChartCard title="Recommendations" caption="By priority">
          <BarList
            max={Math.max(recs.length, 1)}
            items={[
              { label: 'High priority', value: count('high'), color: RED },
              { label: 'Medium priority', value: count('medium'), color: AMBER },
              { label: 'Low priority', value: count('low'), color: SLATE },
            ]}
          />
        </ChartCard>

        <ChartCard title="Experience" caption="Achievements and gaps">
          <DonutChart
            centerValue={String(result.experience_evaluation.quantified_achievements.length)}
            centerLabel="quantified"
            data={[
              { label: 'Quantified achievements', value: result.experience_evaluation.quantified_achievements.length, color: TEAL },
              { label: 'Gaps', value: result.experience_evaluation.gaps.length, color: AMBER },
            ]}
          />
        </ChartCard>
      </div>
    </section>
  )
}
