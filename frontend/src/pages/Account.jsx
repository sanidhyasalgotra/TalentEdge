import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Copy, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'
import { deleteAnalysis, listAnalyses } from '../lib/api'

const providerNames = {
  email: 'Email and password',
  google: 'Google',
  apple: 'Apple',
}

const fmt = (d) => (d ? new Date(d).toLocaleString() : '—')

function initialsOf(name, email) {
  const source = (name || email || '?').trim()
  const parts = source.split(/[\s@._-]+/).filter(Boolean)
  return ((parts[0]?.[0] || '?') + (parts.length > 1 ? parts[1][0] : '')).toUpperCase()
}

const Msg = ({ error, done }) => (
  <>
    {error && <p role="alert" className="text-sm text-bad">{error}</p>}
    {done && <p role="status" className="text-sm text-good">{done}</p>}
  </>
)

const Row = ({ label, children }) => (
  <div className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr] sm:items-center">
    <dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{label}</dt>
    <dd className="min-w-0 break-words text-sm">{children}</dd>
  </div>
)

export default function Account() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const meta = user?.user_metadata || {}

  // profile
  const [fullName, setFullName] = useState(meta.full_name || meta.name || '')
  const [jobTitle, setJobTitle] = useState(meta.job_title || '')
  const [phone, setPhone] = useState(meta.contact_phone || '')
  const [profile, setProfile] = useState({ busy: false, error: '', done: '' })

  // email
  const [newEmail, setNewEmail] = useState('')
  const [emailState, setEmailState] = useState({ busy: false, error: '', done: '' })

  // password
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [pw, setPw] = useState({ busy: false, error: '', done: '' })
  const [reset, setReset] = useState({ busy: false, error: '', done: '' })
  const [signingOut, setSigningOut] = useState(false)

  // usage and data
  const [stats, setStats] = useState({ loading: true, items: [], error: '' })
  const [wipe, setWipe] = useState({ busy: false, error: '', done: '' })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    listAnalyses()
      .then((items) => setStats({ loading: false, items, error: '' }))
      .catch((e) => setStats({ loading: false, items: [], error: e.message }))
  }, [])

  const saveProfile = async (e) => {
    e.preventDefault()
    setProfile({ busy: true, error: '', done: '' })
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName.trim(), job_title: jobTitle.trim(), contact_phone: phone.trim() },
    })
    setProfile(error ? { busy: false, error: error.message, done: '' } : { busy: false, error: '', done: 'Profile saved.' })
  }

  const changeEmail = async (e) => {
    e.preventDefault()
    if (newEmail.trim().toLowerCase() === (user.email || '').toLowerCase()) {
      return setEmailState({ busy: false, error: 'That is already your email address.', done: '' })
    }
    setEmailState({ busy: true, error: '', done: '' })
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() })
    if (error) return setEmailState({ busy: false, error: error.message, done: '' })
    setNewEmail('')
    setEmailState({ busy: false, error: '', done: 'Check your inbox. Open the confirmation link to finish changing your email.' })
  }

  const changePassword = async (e) => {
    e.preventDefault()
    if (password.length < 8) return setPw({ busy: false, error: 'Password must be at least 8 characters.', done: '' })
    if (password !== confirm) return setPw({ busy: false, error: 'The two passwords do not match.', done: '' })
    setPw({ busy: true, error: '', done: '' })
    const { error } = await supabase.auth.updateUser({ password })
    if (error) return setPw({ busy: false, error: error.message, done: '' })
    setPassword(''); setConfirm('')
    setPw({ busy: false, error: '', done: 'Your password has been updated.' })
  }

  const sendReset = async () => {
    setReset({ busy: true, error: '', done: '' })
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setReset(error ? { busy: false, error: error.message, done: '' } : { busy: false, error: '', done: `A reset link has been sent to ${user.email}.` })
  }

  const signOutEverywhere = async () => {
    setSigningOut(true)
    await supabase.auth.signOut({ scope: 'global' })
    navigate('/')
  }

  const wipeHistory = async () => {
    if (!stats.items.length) return
    if (!window.confirm(`Delete all ${stats.items.length} saved analyses? This cannot be undone.`)) return
    setWipe({ busy: true, error: '', done: '' })
    try {
      for (const item of stats.items) await deleteAnalysis(item.id)
      setStats({ loading: false, items: [], error: '' })
      setWipe({ busy: false, error: '', done: 'All analyses deleted.' })
    } catch (e) {
      setWipe({ busy: false, error: e.message, done: '' })
    }
  }

  const copyId = () => {
    navigator.clipboard?.writeText(user.id).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const providers = (user.app_metadata?.providers || [user.app_metadata?.provider]).filter(Boolean)
  const avatar = meta.avatar_url || meta.picture
  const displayName = meta.full_name || meta.name || user.email
  const items = stats.items
  const avgOverall = items.length ? Math.round(items.reduce((s, i) => s + i.overall_score, 0) / items.length) : null

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        {avatar ? (
          <img src={avatar} alt="" referrerPolicy="no-referrer" className="h-16 w-16 rounded-full border border-ink/10 object-cover" />
        ) : (
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-edge-light font-display text-xl font-bold text-edge-dark" aria-hidden="true">
            {initialsOf(meta.full_name || meta.name, user.email)}
          </span>
        )}
        <div className="min-w-0">
          <h1 className="truncate font-display text-3xl font-bold">{displayName}</h1>
          <p className="truncate text-sm text-ink-soft">{user.email}</p>
        </div>
      </div>

      <form onSubmit={saveProfile} className="card space-y-4">
        <h2 className="font-display text-lg font-bold">Profile</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="label">Full name</label>
            <input id="fullName" className="input" maxLength={100} autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="jobTitle" className="label">Job title (optional)</label>
            <input id="jobTitle" className="input" maxLength={100} autoComplete="organization-title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="phone" className="label">Phone (optional)</label>
            <input id="phone" type="tel" className="input" maxLength={30} autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <p className="mt-1 text-xs text-ink-faint">Saved to your profile only. It is not used to sign in.</p>
          </div>
        </div>
        <Msg error={profile.error} done={profile.done} />
        <button className="btn-primary" disabled={profile.busy}>
          {profile.busy && <Loader2 className="h-4 w-4 animate-spin" />} Save profile
        </button>
      </form>

      <section className="card">
        <h2 className="font-display text-lg font-bold">Account details</h2>
        <dl className="mt-2 divide-y divide-ink/10">
          <Row label="Email">
            {user.email}{' '}
            <span className={`ml-1 rounded px-1.5 py-0.5 text-xs font-medium ${user.email_confirmed_at ? 'bg-edge-light text-edge-dark' : 'bg-amber-soft text-warn'}`}>
              {user.email_confirmed_at ? 'Verified' : 'Not verified'}
            </span>
          </Row>
          <Row label="User ID">
            <span className="inline-flex items-center gap-2">
              <code className="break-all text-xs">{user.id}</code>
              <button type="button" onClick={copyId} className="rounded p-1 text-ink-soft hover:bg-ink/5" aria-label="Copy user ID">
                {copied ? <Check className="h-4 w-4 text-good" /> : <Copy className="h-4 w-4" />}
              </button>
            </span>
          </Row>
          <Row label="Sign-in methods">{providers.map((p) => providerNames[p] || p).join(', ') || '—'}</Row>
          <Row label="Member since">{fmt(user.created_at)}</Row>
          <Row label="Last sign-in">{fmt(user.last_sign_in_at)}</Row>
        </dl>

        <form onSubmit={changeEmail} className="mt-4 space-y-3 border-t border-ink/10 pt-4">
          <label htmlFor="newEmail" className="label">Change email address</label>
          <div className="flex flex-wrap gap-3">
            <input id="newEmail" type="email" required className="input !w-auto min-w-[14rem] flex-1" placeholder="new@example.com" autoComplete="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            <button className="btn-ghost" disabled={emailState.busy}>
              {emailState.busy && <Loader2 className="h-4 w-4 animate-spin" />} Update email
            </button>
          </div>
          <Msg error={emailState.error} done={emailState.done} />
        </form>
      </section>

      <section className="card">
        <h2 className="font-display text-lg font-bold">Your activity</h2>
        {stats.loading ? (
          <Loader2 className="mt-3 h-5 w-5 animate-spin text-edge" aria-label="Loading" />
        ) : stats.error ? (
          <p role="alert" className="mt-3 text-sm text-bad">{stats.error}</p>
        ) : (
          <dl className="mt-3 grid grid-cols-3 gap-4 text-center">
            <div><dd className="font-display text-3xl font-bold">{items.length}</dd><dt className="text-xs text-ink-soft">Analyses</dt></div>
            <div><dd className="font-display text-3xl font-bold">{avgOverall ?? '—'}</dd><dt className="text-xs text-ink-soft">Average overall score</dt></div>
            <div><dd className="text-sm font-medium leading-9">{items.length ? new Date(items[0].created_at).toLocaleDateString() : '—'}</dd><dt className="text-xs text-ink-soft">Latest analysis</dt></div>
          </dl>
        )}
      </section>

      <section className="card space-y-6">
        <h2 className="font-display text-lg font-bold">Password and security</h2>

        <form onSubmit={changePassword} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="password" className="label">New password</label>
              <input id="password" type="password" required autoComplete="new-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
              <p className="mt-1 text-xs text-ink-faint">At least 8 characters.</p>
            </div>
            <div>
              <label htmlFor="confirm" className="label">Confirm new password</label>
              <input id="confirm" type="password" required autoComplete="new-password" className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
          </div>
          <Msg error={pw.error} done={pw.done} />
          <button className="btn-primary" disabled={pw.busy}>
            {pw.busy && <Loader2 className="h-4 w-4 animate-spin" />} Update password
          </button>
        </form>

        <div className="space-y-3 border-t border-ink/10 pt-5">
          <h3 className="text-sm font-semibold">Forgot your password?</h3>
          <p className="text-sm text-ink-soft">We will email a reset link to {user.email}. Use it if you want to set a new password from your inbox.</p>
          <Msg error={reset.error} done={reset.done} />
          <button type="button" className="btn-ghost" onClick={sendReset} disabled={reset.busy}>
            {reset.busy && <Loader2 className="h-4 w-4 animate-spin" />} Email me a reset link
          </button>
        </div>

        <div className="space-y-3 border-t border-ink/10 pt-5">
          <h3 className="text-sm font-semibold">Sessions</h3>
          <p className="text-sm text-ink-soft">Sign out of TalentEdge on every device where you are logged in, including this one.</p>
          <button type="button" className="btn-ghost" onClick={signOutEverywhere} disabled={signingOut}>
            {signingOut && <Loader2 className="h-4 w-4 animate-spin" />} Sign out of all devices
          </button>
        </div>
      </section>

      <section className="card space-y-3">
        <h2 className="font-display text-lg font-bold">Your data</h2>
        <p className="text-sm text-ink-soft">Remove every saved analysis from your history. Your account stays active.</p>
        <Msg error={wipe.error} done={wipe.done} />
        <button type="button" className="btn-ghost !text-bad" onClick={wipeHistory} disabled={wipe.busy || stats.loading || !items.length}>
          {wipe.busy && <Loader2 className="h-4 w-4 animate-spin" />} Delete all my analyses
        </button>
      </section>
    </div>
  )
}
