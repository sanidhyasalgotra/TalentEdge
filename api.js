import { supabase } from './supabase'

async function request(path, options = {}) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: { ...(options.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  })
  if (res.status === 204) return null
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const detail = typeof body.detail === 'string' ? body.detail : 'Something went wrong. Please try again.'
    const err = new Error(detail)
    err.status = res.status
    throw err
  }
  return body
}

export const analyzeResume = (formData) => request('/analyze', { method: 'POST', body: formData })
export const listAnalyses = () => request('/analyses')
export const getAnalysis = (id) => request(`/analyses/${id}`)
export const deleteAnalysis = (id) => request(`/analyses/${id}`, { method: 'DELETE' })
