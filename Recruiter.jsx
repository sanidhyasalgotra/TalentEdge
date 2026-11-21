import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const TIPS = [
  'Where are the numbers? Show me impact, not duties.',
  '“Responsible for” tells me nothing. Start with a strong verb.',
  'Keep it to one page unless you have 10+ years.',
  'Match the job description’s keywords. Honestly.',
  'A skills section helps me scan faster.',
  'Nice. Now upload your resume and let’s see.',
  'Typos? I notice every single one.',
]

const SMILE_IDLE = 'M92 156 Q110 160 128 156'
const SMILE_HAPPY = 'M90 152 Q110 172 130 152'

export default function Recruiter({ excited = false, className = '' }) {
  const head = useRef(null)
  const eyeL = useRef(null)
  const eyeR = useRef(null)
  const pupilL = useRef(null)
  const pupilR = useRef(null)
  const tipIndex = useRef(0)
  const happyTimer = useRef(null)

  const [msg, setMsg] = useState('Hi, I’m your recruiter. I’ve got six seconds.')
  const [bubbleKey, setBubbleKey] = useState(0)
  const [happy, setHappy] = useState(false)
  const [blink, setBlink] = useState(false)

  const say = (text) => {
    setMsg(text)
    setBubbleKey((k) => k + 1)
  }

  // eyes and head follow the cursor
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2

    const look = () => {
      frame = 0
      if (!head.current) return
      const hb = head.current.getBoundingClientRect()
      const nx = Math.max(-1, Math.min(1, (mx - (hb.left + hb.width / 2)) / 400))
      const ny = Math.max(-1, Math.min(1, (my - (hb.top + hb.height / 2)) / 400))
      head.current.style.transform = `translate(${nx * 6}px, ${ny * 4}px) rotate(${nx * 5}deg)`
      ;[
        [eyeL, pupilL],
        [eyeR, pupilR],
      ].forEach(([eye, pupil]) => {
        if (!eye.current || !pupil.current) return
        const r = eye.current.getBoundingClientRect()
        const dx = mx - (r.left + r.width / 2)
        const dy = my - (r.top + r.height / 2)
        const d = Math.hypot(dx, dy) || 1
        const k = Math.min(1, d / 160) * 6
        pupil.current.style.transform = `translate(${(dx / d) * k}px, ${(dy / d) * k}px)`
      })
    }

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      if (!frame) frame = requestAnimationFrame(look)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('scroll', look, { passive: true })
    look()
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', look)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  // blink every few seconds
  useEffect(() => {
    let t1, t2
    const loop = () => {
      t1 = setTimeout(() => {
        setBlink(true)
        t2 = setTimeout(() => setBlink(false), 130)
        loop()
      }, 2200 + Math.random() * 2500)
    }
    loop()
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  // reacts when the main button is hovered
  useEffect(() => {
    if (excited) say('Go on, click it. I’m ready.')
  }, [excited])

  useEffect(() => () => clearTimeout(happyTimer.current), [])

  const onClick = () => {
    say(TIPS[tipIndex.current++ % TIPS.length])
    setHappy(true)
    clearTimeout(happyTimer.current)
    happyTimer.current = setTimeout(() => setHappy(false), 1400)
  }

  const raised = happy || excited

  return (
    <div className={`relative text-center ${className}`}>
      <motion.div
        key={bubbleKey}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        aria-live="polite"
        className="absolute -top-14 left-1/2 z-10 w-56 -translate-x-1/2 rounded-xl border border-black/10 bg-white px-3 py-2 text-left text-sm leading-snug shadow-sm lg:left-auto lg:right-2 lg:translate-x-0"
      >
        {msg}
        <span className="absolute -bottom-2 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rotate-45 border-b border-r border-black/10 bg-white lg:left-auto lg:right-12 lg:translate-x-0" />
      </motion.div>

      <button
        type="button"
        onClick={onClick}
        aria-label="Recruiter mascot. Click for a tip."
        className="block w-full cursor-pointer rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-edge"
      >
        <svg viewBox="0 0 220 280" className="h-auto w-full overflow-visible" aria-hidden="true">
          {/* body */}
          <path d="M30 280 C30 225 62 205 110 205 C158 205 190 225 190 280Z" className="fill-ink" />
          <path d="M88 205 L110 245 L132 205Z" fill="#fff" />
          <path d="M104 214h12l5 40-11 10-11-10z" className="fill-edge" />

          {/* clipboard */}
          <g transform="rotate(10 168 245)">
            <rect x="146" y="226" width="44" height="54" rx="5" fill="#fff" stroke="#d9d6cc" strokeWidth="2" />
            <rect x="159" y="221" width="18" height="9" rx="3" className="fill-edge" />
            <path d="M154 246h28M154 256h22M154 266h26" className="stroke-ink-soft" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* head */}
          <g ref={head} style={{ transformOrigin: '110px 205px', transformBox: 'view-box', transition: 'transform 120ms ease-out' }}>
            <rect x="97" y="178" width="26" height="30" rx="8" fill="#f1c9a5" />
            <ellipse cx="110" cy="118" rx="58" ry="66" fill="#f1c9a5" />
            <path d="M52 112 C48 60 86 40 112 42 C148 42 172 70 168 112 C158 88 140 80 110 80 C84 80 64 90 52 112Z" fill="#2b2118" />
            <ellipse cx="52" cy="124" rx="7" ry="12" fill="#f1c9a5" />
            <ellipse cx="168" cy="124" rx="7" ry="12" fill="#f1c9a5" />

            <g
              stroke="#2b2118"
              strokeWidth="5"
              strokeLinecap="round"
              style={{ transform: raised ? 'translateY(-6px)' : 'none', transition: 'transform 200ms' }}
            >
              <path d="M74 92l28 -4" />
              <path d="M118 88l28 4" />
            </g>

            {/* eyes */}
            <g ref={eyeL}>
              <circle cx="88" cy="112" r="15" fill="#fff" stroke="#c9c2b6" strokeWidth="1.5" />
              <circle ref={pupilL} cx="88" cy="112" r="7" fill="#1b1b1b" style={{ transition: 'transform 60ms linear' }} />
            </g>
            <g ref={eyeR}>
              <circle cx="132" cy="112" r="15" fill="#fff" stroke="#c9c2b6" strokeWidth="1.5" />
              <circle ref={pupilR} cx="132" cy="112" r="7" fill="#1b1b1b" style={{ transition: 'transform 60ms linear' }} />
            </g>
            {[88, 132].map((cx) => (
              <circle
                key={cx}
                cx={cx}
                cy="112"
                r="15.5"
                fill="#f1c9a5"
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: 'center',
                  transform: blink ? 'scaleY(1)' : 'scaleY(0)',
                  transition: 'transform 80ms',
                }}
              />
            ))}

            {/* glasses */}
            <g fill="none" className="stroke-ink" strokeWidth="3.5">
              <circle cx="88" cy="112" r="21" />
              <circle cx="132" cy="112" r="21" />
              <path d="M109 110h2M67 108l-12-4M153 108l12-4" />
            </g>

            <path d="M110 122 q-5 14 0 18 q6 2 8 -2" fill="none" stroke="#c99a76" strokeWidth="3" strokeLinecap="round" />
            <path d={happy ? SMILE_HAPPY : SMILE_IDLE} fill="none" stroke="#7a3b2e" strokeWidth="4" strokeLinecap="round" />
          </g>
        </svg>
      </button>
      <p className="mt-1 text-xs text-ink-soft">Click for a tip</p>
    </div>
  )
}
