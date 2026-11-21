// Decorative "scanning" animation: a beam sweeps the resume, good lines glow green and
// slide out as strengths, weak lines glow red and slide out as gaps.
// Pure CSS, no extra dependencies. The chip labels are illustrative, not real findings.
const LINES = [['', 45], ['g', 92], ['', 70], ['b', 85], ['g', 75], ['', 60], ['b', 80], ['g', 70], ['b', 55]]
const GOOD = ['Clear structure', 'Relevant skills', 'Quantified impact']
const BAD = ['Missing keywords', 'Vague bullets', 'Weak summary']
const at = (i) => (((44 + 18 * i) / 250) * 6).toFixed(2) // seconds when the beam reaches line i
const idx = (k) => LINES.flatMap(([t], i) => (t === k ? [i] : []))

const CSS = `
.te-scan{--ok:#13795b;--bad:#b42318;--brand:#0f766e;display:grid;grid-template-columns:1fr minmax(200px,260px) 1fr;gap:20px;align-items:center;max-width:720px;margin:0 auto}
.te-col{display:grid;gap:10px}
.te-col h4{margin:0;font:600 12px system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;opacity:.7}
.te-left{text-align:right}
.te-chip{font:500 13px system-ui,sans-serif;padding:8px 12px;border-radius:8px;border:1px solid;opacity:0;animation:te-chip 6s ease-in-out infinite both;animation-delay:var(--d)}
.te-good{color:var(--ok);border-color:var(--ok);background:rgba(19,121,91,.1);--from:-140px}
.te-bad{color:var(--bad);border-color:var(--bad);background:rgba(180,35,24,.08);--from:140px}
@keyframes te-chip{0%{opacity:0;transform:translateX(var(--from)) scale(.85)}12%,88%{opacity:1;transform:none}100%{opacity:0}}
.te-paper{position:relative;height:250px;background:#fffdf8;border:1px solid rgba(29,43,42,.15);border-radius:10px;padding:18px;overflow:hidden;box-shadow:0 8px 24px rgba(15,118,110,.14)}
.te-name{height:12px;width:45%;background:#c9d4d2;border-radius:3px;margin-bottom:14px}
.te-ln{height:8px;border-radius:3px;background:#dfe6e4;margin-bottom:10px}
.te-ln.g{animation:te-hg 6s infinite both;animation-delay:var(--d)}
.te-ln.b{animation:te-hb 6s infinite both;animation-delay:var(--d)}
@keyframes te-hg{0%{background:#dfe6e4}8%,88%{background:#8fd3b6}100%{background:#dfe6e4}}
@keyframes te-hb{0%{background:#dfe6e4}8%,88%{background:#f1a39b}100%{background:#dfe6e4}}
.te-beam{position:absolute;left:0;right:0;height:3px;background:var(--brand);box-shadow:0 0 14px 4px rgba(15,118,110,.45);animation:te-sweep 6s linear infinite}
@keyframes te-sweep{0%{top:0;opacity:0}6%{opacity:1}94%{opacity:1}100%{top:calc(100% - 3px);opacity:0}}
.te-cap{grid-column:1/-1;text-align:center;font:500 14px system-ui,sans-serif;opacity:.7;margin:6px 0 0}
@media(max-width:640px){.te-scan{grid-template-columns:1fr 1fr}.te-paper{grid-column:1/-1;order:-1}}
@media(prefers-reduced-motion:reduce){.te-beam{display:none}.te-chip{animation:none;opacity:1}.te-ln.g,.te-ln.b{animation:none}}
`

export default function ScanAnimation({ label = 'Scanning your resume…' }) {
  const gi = idx('g')
  const bi = idx('b')
  return (
    <div className="te-scan" role="status" aria-live="polite">
      <style>{CSS}</style>
      <div className="te-col te-left">
        <h4>Needs work</h4>
        {BAD.map((t, n) => (
          <div key={t} className="te-chip te-bad" style={{ '--d': `${(+at(bi[n]) + 0.5).toFixed(2)}s` }}>{t}</div>
        ))}
      </div>
      <div className="te-paper" aria-hidden="true">
        <div className="te-name" />
        {LINES.map(([k, w], i) => (
          <div key={i} className={`te-ln ${k}`} style={{ width: `${w}%`, '--d': `${at(i)}s` }} />
        ))}
        <div className="te-beam" />
      </div>
      <div className="te-col">
        <h4>Strengths</h4>
        {GOOD.map((t, n) => (
          <div key={t} className="te-chip te-good" style={{ '--d': `${(+at(gi[n]) + 0.5).toFixed(2)}s` }}>{t}</div>
        ))}
      </div>
      <p className="te-cap">{label}</p>
    </div>
  )
}
