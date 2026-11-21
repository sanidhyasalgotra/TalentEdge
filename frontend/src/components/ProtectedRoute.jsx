import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../lib/auth.jsx'

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()
  const location = useLocation()
  if (loading)
    return (
      <div className="flex justify-center py-24" role="status" aria-label="Loading">
        <Loader2 className="h-6 w-6 animate-spin text-edge" />
      </div>
    )
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}
