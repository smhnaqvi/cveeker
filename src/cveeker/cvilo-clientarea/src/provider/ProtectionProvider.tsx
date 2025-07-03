import { Outlet, Navigate } from "react-router-dom"
import Layout from "../components/Layout"
import { useSearchParams } from "react-router-dom"
import { useAuthStore } from "../stores"

const ProtectionProvider = () => {
  const [searchParams] = useSearchParams()
  const printMode = searchParams.get('print')
  const { isAuthenticated, isLoading } = useAuthStore()

  // Allow print mode without authentication
  if (printMode) {
    return <Outlet />
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading...</div>
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }
  
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default ProtectionProvider