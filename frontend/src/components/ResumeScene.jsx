import { useState } from 'react'

const palette = [
  { name: 'Navy', color: '#1F3A5F' },
  { name: 'Forest', color: '#1F5F4A' },
  { name: 'Burgundy', color: '#7A2230' },
  { name: 'Slate', color: '#475569' },
  { name: 'Ochre', color: '#8A6A1F' },
]
const REST = { x: 6, y: -14 }

const Lines = ({ widths }) => (
  <div className="space-y-1.5">
    {widths.map((w, i) => (
      <div key={i} className="h-1.5 rounded bg-gray-200" style={{ width: w }} />
    ))}
  </div>
)

const Block = ({ title, color, children }) => (
  <div>
    <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider" style={{ color }}>{title}</p>
    {children}
  </div>
)

export default function ResumeScene() {
  const [tilt, setTilt] = useState(REST)
  const [active, setActive] = useState(0)
  const [moving, setMoving] = useState(false)
  const accent = palette[active].color

  const onMove = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setMoving(true)
    setTilt({ x: -py * 24, y: px * 34 })
  }
  const onLeave = () => {
    setMoving(false)
    setTilt(REST)
  }

  return (
    <div>
      <div
        className="relative flex h-[27rem] items-center justify-center"
        style={{ perspective: '1100px', touchAction: 'pan-y' }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <div
          className="relative h-[22rem] w-[16.5rem]"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: moving ? 'transform 80ms linear' : 'transform 600ms ease',
          }}
        >
          <div className="absolute inset-0 rounded-md border border-line bg-white shadow-md" style={{ transform: 'translateZ(-60px) translate(22px, 22px)', opacity: 0.55 }} />
          <div className="absolute inset-0 rounded-md border border-line bg-white shadow-md" style={{ transform: 'translateZ(-30px) translate(11px, 11px)', opacity: 0.8 }} />

          <div className="absolute inset-0 overflow-hidden rounded-md border border-line bg-white shadow-xl" style={{ transform: 'translateZ(0)' }}>
            <div className="px-4 py-4 text-white transition-colors duration-300" style={{ backgroundColor: accent }}>
              <p className="text-base font-semibold leading-tight">Your Name</p>
              <p className="mt-0.5 text-[11px] opacity-80">Target role</p>
            </div>
            <div className="space-y-4 p-4">
              <Block title="Summary" color={accent}><Lines widths={['100%', '92%', '60%']} /></Block>
              <Block title="Experience" color={accent}><Lines widths={['70%', '100%', '88%', '95%', '55%']} /></Block>
              <Block title="Skills" color={accent}>
                <div className="flex flex-wrap gap-1.5">
                  {['Skill', 'Skill', 'Skill', 'Skill'].map((s, i) => (
                    <span key={i} className="rounded border px-1.5 py-0.5 text-[9px] font-medium transition-colors duration-300" style={{ borderColor: accent, color: accent }}>{s}</span>
                  ))}
                </div>
              </Block>
              <Block title="Education" color={accent}><Lines widths={['65%', '45%']} /></Block>
            </div>
          </div>

          <div className="absolute -right-10 top-24 rounded-md border border-line bg-white px-3 py-2 text-xs font-medium text-ink shadow-lg" style={{ transform: 'translateZ(70px)' }}>
            ATS-friendly layout
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-col items-center gap-3">
        <div className="flex gap-3" role="group" aria-label="Resume accent color">
          {palette.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${p.name} accent`}
              aria-pressed={i === active}
              className="h-7 w-7 rounded-full border-2 border-white shadow ring-offset-2 transition"
              style={{ backgroundColor: p.color, boxShadow: i === active ? `0 0 0 2px ${p.color}` : undefined }}
            />
          ))}
        </div>
        <p className="text-xs text-muted">Move your pointer over the resume to tilt it. Pick an accent color.</p>
      </div>
    </div>
  )
}
