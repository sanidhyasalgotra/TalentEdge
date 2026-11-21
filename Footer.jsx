import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-ink/10">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span>© {new Date().getFullYear()} TalentEdge</span>
        <nav aria-label="Legal" className="flex gap-5">
          <Link to="/privacy" className="hover:text-ink hover:underline">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-ink hover:underline">Terms of Service</Link>
        </nav>
      </div>
    </footer>
  )
}
