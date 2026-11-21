import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileSearch, ListChecks, Target } from 'lucide-react'
import { useAuth } from '../lib/auth.jsx'
import Recruiter from '../components/Recruiter.jsx'

const points = [
  { icon: FileSearch, title: 'Evidence-based feedback', text: 'Every strength and weakness points back to your actual resume text.' },
  { icon: ListChecks, title: 'Honest rewrites', text: 'Stronger bullets that keep your real facts. Missing numbers become placeholders, never inventions.' },
  { icon: Target, title: 'Role tailoring', text: 'Add a target role or job description to see matched and missing keywords.' },
]

export default function Landing() {
  const { session } = useAuth()
  const [ctaHover, setCtaHover] = useState(false)
  return (
    <div className="relative py-10 sm:py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-2xl">
        <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">See your resume the way a recruiter does.</h1>
        <p className="mt-4 text-lg text-ink-soft">
          Upload a PDF or DOCX and get a structured review: ATS readiness, strengths, gaps, keywords and concrete fixes.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            to={session ? '/app' : '/register'}
            className="btn-primary"
            onMouseEnter={() => setCtaHover(true)}
            onMouseLeave={() => setCtaHover(false)}
          >
            {session ? 'Analyze a resume' : 'Create free account'}
          </Link>
          {!session && <Link to="/login" className="btn-ghost">Log in</Link>}
        </div>
      </motion.div>

      <Recruiter
        excited={ctaHover}
        className="mx-auto mt-16 w-56 lg:absolute lg:right-0 lg:top-0 lg:mx-0 lg:mt-0 lg:w-64"
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-3">
        {points.map(({ icon: Icon, title, text }) => (
          <div key={title} className="card">
            <Icon className="h-5 w-5 text-edge" />
            <h2 className="mt-3 font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-ink-soft">{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
