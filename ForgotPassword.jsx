import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { configured, supabase } from '../lib/supabase'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setBusy(false)
    if (err) return setError(err.message)
    setSent(true)
  }

  return (
    <div className="mx-auto mt-6 max-w-sm">
      <h1 className="text-2xl font-semibold">Reset your password</h1>
      <p className="mt-2 text-sm text-muted">Enter the email you signed up with and we will send you a reset link.</p>
      <div className="card mt-6">
        {sent ? (
          <div role="status" className="space-y-3 text-sm">
            <p className="font-medium text-ink">Check your email.</p>
            <p>If an account exists for {email}, a reset link is on its way. It can take a few minutes. Check your spam folder too.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="email" className="label">Email</label>
              <input id="email" type="email" required autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {error && <p role="alert" className="text-sm text-bad">{error}</p>}
            <button className="btn-primary w-full" disabled={busy || !configured}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Send reset link
            </button>
          </form>
        )}
      </div>
      <p className="mt-4 text-center text-sm text-muted">
        <Link className="font-medium text-brand hover:underline" to="/login">Back to log in</Link>
      </p>
    </div>
  )
}
