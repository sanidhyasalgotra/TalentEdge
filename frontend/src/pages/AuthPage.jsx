import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { configured, supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'
import ResumeScene from '../components/ResumeScene'
import SocialLogin from '../components/SocialLogin'

export default function AuthPage({ mode }) {
  const isRegister = mode === 'register'
  const { session } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  if (session) return <Navigate to={location.state?.from || '/app'} replace />

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setNotice('')
    if (isRegister && password.length < 8) return setError('Password must be at least 8 characters.')
    setBusy(true)
    const { data, error: err } = isRegister
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (err) return setError(err.message)
    if (isRegister && !data.session) return setNotice('Check your email to confirm your account, then log in.')
    navigate('/app')
  }

  const oauth = async (provider, label) => {
    setError(''); setNotice('')
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/app` },
    })
    if (err) {
      setError(
        /not enabled|unsupported provider/i.test(err.message)
          ? `${label} sign-in is not enabled yet. Turn it on in Supabase under Authentication, Sign In / Providers.`
          : err.message
      )
    }
  }

  return (
    <div className="grid items-center gap-12 py-2 lg:grid-cols-2">
      <div className="hidden lg:block">
        <ResumeScene />
      </div>

      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-semibold">{isRegister ? 'Create your account' : 'Log in to TalentEdge'}</h1>
        {!configured && (
          <p role="alert" className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Supabase is not configured. Copy <code>frontend/.env.example</code> to <code>frontend/.env</code> and fill it in.
          </p>
        )}
        <div className="card mt-6 space-y-5">
          <SocialLogin onSelect={oauth} disabled={!configured || busy} />
          <div className="flex items-center gap-3 text-xs text-muted" role="separator">
            <span className="h-px flex-1 bg-line" /> or continue with email <span className="h-px flex-1 bg-line" />
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="email" className="label">Email</label>
              <input id="email" type="email" required autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="password" className="label">Password</label>
                {!isRegister && <Link to="/forgot-password" className="text-xs font-medium text-brand hover:underline">Forgot password?</Link>}
              </div>
              <input id="password" type="password" required autoComplete={isRegister ? 'new-password' : 'current-password'} className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
              {isRegister && <p className="mt-1 text-xs text-muted">At least 8 characters.</p>}
            </div>
            {error && <p role="alert" className="text-sm text-bad">{error}</p>}
            {notice && <p role="status" className="text-sm text-good">{notice}</p>}
            <button className="btn-primary w-full" disabled={busy || !configured}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} {isRegister ? 'Sign up' : 'Log in'}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-xs text-ink-faint">
          By continuing, you agree to our <Link className="underline hover:text-ink" to="/terms">Terms of Service</Link> and{' '}
          <Link className="underline hover:text-ink" to="/privacy">Privacy Policy</Link>.
        </p>
        <p className="mt-4 text-center text-sm text-muted">
          {isRegister ? 'Already have an account?' : 'New to TalentEdge?'}{' '}
          <Link className="font-medium text-brand hover:underline" to={isRegister ? '/login' : '/register'}>{isRegister ? 'Log in' : 'Create an account'}</Link>
        </p>
      </div>
    </div>
  )
}
