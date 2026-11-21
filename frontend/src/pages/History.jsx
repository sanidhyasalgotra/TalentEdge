import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Loader2, Trash2 } from 'lucide-react'
import { deleteAnalysis, listAnalyses } from '../lib/api'
import { ConfirmDialog, useConfirmDelete } from '../components/ConfirmDialog'

export default function History() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    listAnalyses().then(setItems).catch((e) => setError(e.message))
  }, [])

  // Runs only after the user clicks "Yes, delete" in the popup
  const remove = async (item) => {
    try {
      await deleteAnalysis(item.id)
      setItems((prev) => prev.filter((i) => i.id !== item.id))
    } catch (e) {
      setError(e.message)
    }
  }

  const { target, ask, cancel, confirm, loading } = useConfirmDelete(remove)

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">History</h1>
      {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {items === null && !error && <Loader2 className="mt-8 h-6 w-6 animate-spin text-edge" aria-label="Loading" />}
      {items?.length === 0 && (
        <div className="card mt-6 text-center">
          <p className="text-sm text-ink-soft">No analyses yet.</p>
          <Link to="/app" className="btn-primary mt-3">Analyze your first resume</Link>
        </div>
      )}
      <ul className="mt-6 space-y-3">
        {items?.map((i) => (
          <li key={i.id} className="card flex items-center justify-between gap-3 !p-4">
            <Link to={`/analysis/${i.id}`} className="flex min-w-0 flex-1 items-center gap-3">
              <FileText className="h-5 w-5 shrink-0 text-edge" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{i.filename}</span>
                <span className="block truncate text-xs text-ink-faint">
                  {new Date(i.created_at).toLocaleDateString()}{i.target_role ? ` · ${i.target_role}` : ''}
                </span>
              </span>
            </Link>
            <span className="shrink-0 text-xs text-ink-soft">Overall <strong>{i.overall_score}</strong> · ATS <strong>{i.ats_score}</strong></span>
            <button onClick={() => ask(i)} className="rounded p-2 text-ink-faint hover:bg-red-50 hover:text-red-700" aria-label={`Delete ${i.filename}`}>
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={!!target}
        title="Delete this analysis?"
        message={target ? `"${target.filename}" will be permanently removed from your history. This cannot be undone.` : ''}
        loading={loading}
        onConfirm={confirm}
        onCancel={cancel}
      />
    </div>
  )
}
