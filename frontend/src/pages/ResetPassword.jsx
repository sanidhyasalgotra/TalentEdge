import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'

// Opened from the link in the reset email. Supabase signs the user in with a recovery session.
export default function ResetPassword() {
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (loading)
    return (
      <div className="flex justify-center py-24" role="status" aria-label="Loading">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    )

  if (!session)
    return (
      <div className="mx-auto mt-6 max-w-sm">
        <h1 className="text-2xl font-semibold">This link has expired</h1>
        <p className="mt-2 text-sm text-muted">Reset links work once and expire after a short time. Request a new one to continue.</p>
        <Link to="/forgot-password" className="btn-primary mt-6">Request a new link</Link>
      </div>
    )

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    if (password !== confirm) return setError('The two passwords do not match.')
    setBusy(true)
    const { error: err } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (err) return setError(err.message)
    navigate('/app', { replace: true })
  }

  return (
    <div className="mx-auto mt-6 max-w-sm">
      <h1 className="text-2xl font-semibold">Choose a new password</h1>
      <form onSubmit={submit} className="card mt-6 space-y-4">
        <div>
          <label htmlFor="password" className="label">New password</label>
          <input id="password" type="password" required autoComplete="new-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          <p className="mt-1 text-xs text-muted">At least 8 characters.</p>
        </div>
        <div>
          <label htmlFor="confirm" className="label">Confirm new password</label>
          <input id="confirm" type="password" required autoComplete="new-password" className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        {error && <p role="alert" className="text-sm text-bad">{error}</p>}
        <button className="btn-primary w-full" disabled={busy}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Save new password
        </button>
      </form>
    </div>
  )
}
