import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import AnalysisReport from '../components/AnalysisReport'
import { getAnalysis } from '../lib/api'

export default function AnalysisDetail() {
  const { id } = useParams()
  const [row, setRow] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getAnalysis(id).then(setRow).catch((e) => setError(e.status === 404 ? 'Analysis not found.' : e.message))
  }, [id])

  return (
    <div>
      <Link to="/history" className="mb-4 inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink"><ArrowLeft className="h-4 w-4" /> History</Link>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {!row && !error && <Loader2 className="h-6 w-6 animate-spin text-edge" aria-label="Loading" />}
      {row && (
        <>
          <h1 className="mb-1 font-display text-3xl font-bold">{row.filename}</h1>
          <p className="mb-5 text-sm text-ink-faint">{new Date(row.created_at).toLocaleString()}{row.target_role ? ` · ${row.target_role}` : ''}{row.company ? ` at ${row.company}` : ''}</p>
          <AnalysisReport result={row.result} />
        </>
      )}
    </div>
  )
}
