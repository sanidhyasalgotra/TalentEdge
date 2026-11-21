import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Sparkles } from 'lucide-react'
import UploadDropzone from '../components/UploadDropzone'
import ScanAnimation from '../components/ScanAnimation'
import { analyzeResume } from '../lib/api'

export default function Dashboard() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [jd, setJd] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!file) return setError('Choose a resume first.')
    setBusy(true); setError('')
    const form = new FormData()
    form.append('file', file)
    form.append('target_role', role)
    form.append('company', company)
    form.append('job_description', jd)
    try {
      const saved = await analyzeResume(form)
      navigate(`/analysis/${saved.id}`)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold">Analyze a resume</h1>
        <p className="mt-1 text-sm text-ink-soft">Add a role or job description to also get a tailored keyword match.</p>
      </div>
      <UploadDropzone file={file} onFile={setFile} disabled={busy} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label htmlFor="role" className="label">Target role (optional)</label><input id="role" className="input" maxLength={200} value={role} onChange={(e) => setRole(e.target.value)} placeholder="Backend Engineer" /></div>
        <div><label htmlFor="company" className="label">Company (optional)</label><input id="company" className="input" maxLength={200} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" /></div>
      </div>
      <div>
        <label htmlFor="jd" className="label">Job description (optional)</label>
        <textarea id="jd" rows={5} maxLength={8000} className="input" value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste the job posting here" />
      </div>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <button className="btn-primary" disabled={busy || !file}>
        {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing — this can take up to a minute…</> : <><Sparkles className="h-4 w-4" /> Analyze resume</>}
      </button>
      {busy && <ScanAnimation />}
    </form>
  )
}