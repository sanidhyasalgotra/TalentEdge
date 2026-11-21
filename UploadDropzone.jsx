import { useRef, useState } from 'react'
import { FileText, UploadCloud, X } from 'lucide-react'

const MAX_MB = 5

export function validateFile(file) {
  const name = file.name.toLowerCase()
  if (!name.endsWith('.pdf') && !name.endsWith('.docx')) return 'Please upload a PDF or DOCX file.'
  if (file.size > MAX_MB * 1024 * 1024) return `File is too large. Maximum size is ${MAX_MB} MB.`
  if (file.size === 0) return 'This file is empty.'
  return null
}

export default function UploadDropzone({ file, onFile, disabled }) {
  const input = useRef(null)
  const [over, setOver] = useState(false)
  const [error, setError] = useState('')

  const accept = (f) => {
    if (!f) return
    const problem = validateFile(f)
    setError(problem || '')
    onFile(problem ? null : f)
  }

  if (file)
    return (
      <div className="card flex items-center justify-between !p-4">
        <span className="flex min-w-0 items-center gap-3">
          <FileText className="h-5 w-5 shrink-0 text-edge" />
          <span className="truncate text-sm font-medium">{file.name}</span>
          <span className="shrink-0 text-xs text-ink-faint">{(file.size / 1024).toFixed(0)} KB</span>
        </span>
        <button className="rounded p-1 hover:bg-ink/5" onClick={() => onFile(null)} disabled={disabled} aria-label="Remove file">
          <X className="h-4 w-4" />
        </button>
      </div>
    )

  return (
    <div>
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setOver(true) }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); accept(e.dataTransfer.files?.[0]) }}
        disabled={disabled}
        className={`flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${over ? 'border-edge bg-edge-light' : 'border-ink/20 bg-white hover:border-edge'}`}
      >
        <UploadCloud className="h-8 w-8 text-edge" />
        <span className="text-sm font-semibold">Drop your resume here, or click to browse</span>
        <span className="text-xs text-ink-soft">PDF or DOCX, up to {MAX_MB} MB</span>
      </button>
      <input ref={input} type="file" hidden accept=".pdf,.docx" onChange={(e) => accept(e.target.files?.[0])} />
      {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  )
}
