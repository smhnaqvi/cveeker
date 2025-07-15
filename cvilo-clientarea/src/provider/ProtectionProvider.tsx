import { Outlet, Navigate } from "react-router-dom"
import { useEffect } from "react"
import Layout from "../components/Layout"
import { useSearchParams } from "react-router-dom"
import { useAuthStore } from "../stores"
import { Box, CircularProgress, Typography } from "@mui/material"

const ProtectionProvider = () => {
  const [searchParams] = useSearchParams()
  const printMode = searchParams.get('print')
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore()

  // Initialize authentication on mount
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  // Allow print mode without authentication
  if (printMode) {
    return <Outlet />
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    )
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