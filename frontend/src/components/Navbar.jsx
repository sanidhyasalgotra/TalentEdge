import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../lib/auth.jsx'
import { supabase } from '../lib/supabase'

export function Logo() {
  return (
    <Link to="/" className="flex items-baseline gap-0.5 font-display text-xl font-bold text-ink" aria-label="TalentEdge home">
      Talent<span className="text-edge">Edge</span>
    </Link>
  )
}

export default function Navbar() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const link = ({ isActive }) => `text-sm font-medium ${isActive ? 'text-edge' : 'text-ink-soft hover:text-ink'}`
  const signOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }
  return (
    <header className="border-b border-ink/10 bg-paper/90">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-4 sm:gap-6" aria-label="Main">
          {session ? (
            <>
              <NavLink to="/app" className={link}>Analyze</NavLink>
              <NavLink to="/history" className={link}>History</NavLink>
              <NavLink to="/account" className={link}>Account</NavLink>
              <button onClick={signOut} className="btn-ghost !px-3 !py-1.5" aria-label="Sign out">
                <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={link}>Log in</NavLink>
              <Link to="/register" className="btn-primary !py-1.5">Get started</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
