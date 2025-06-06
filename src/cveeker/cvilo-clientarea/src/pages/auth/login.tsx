import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Divider,
  Alert,
  CircularProgress,
  Link,
  Stack
} from '@mui/material'
import { GitHub, Google, Email, Visibility, VisibilityOff } from '@mui/icons-material'
import { IconButton, InputAdornment } from '@mui/material'
import { auth } from '../../lib/supabase'

// Validation schema
const schema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

interface LoginFormData {
  email: string
  password: string
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema)
  })

  const handleEmailLogin = async (data: LoginFormData) => {
    setLoading(true)
    setError(null)
    
    try {
      const { user, error: authError } = await auth.signInWithEmail(data.email, data.password)
      
      if (authError) {
        setError(authError.message)
        return
      }
      
      if (user) {
        navigate('/dashboard')
      }
    } catch (err) {
      console.error('Email login error:', err)
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { error: authError } = await auth.signInWithGoogle()
      
      if (authError) {
        setError(authError.message)
        return
      }
      
      // OAuth will redirect automatically, so we don't need to navigate here
    } catch (err) {
      console.error('Google login error:', err)
      setError('Google login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubLogin = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { error: authError } = await auth.signInWithGitHub()
      
      if (authError) {
        setError(authError.message)
        return
      }
      
      // OAuth will redirect automatically, so we don't need to navigate here
    } catch (err) {
      console.error('GitHub login error:', err)
      setError('GitHub login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={10} sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <Typography variant="h4" component="h1" fontWeight="bold" color="primary" gutterBottom>
                Welcome to CVilo
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to manage your professional resumes
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* OAuth Buttons */}
            <Stack spacing={2} mb={3}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<Google />}
                onClick={handleGoogleLogin}
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderColor: '#db4437',
                  color: '#db4437',
                  '&:hover': {
                    borderColor: '#c23321',
                    backgroundColor: 'rgba(219, 68, 55, 0.04)'
                  }
                }}
              >
                Continue with Google
              </Button>

              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<GitHub />}
                onClick={handleGitHubLogin}
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderColor: '#333',
                  color: '#333',
                  '&:hover': {
                    borderColor: '#24292e',
                    backgroundColor: 'rgba(36, 41, 46, 0.04)'
                  }
                }}
              >
                Continue with GitHub
              </Button>
            </Stack>

            {/* Divider */}
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                or continue with email
              </Typography>
            </Divider>

            {/* Email Login Form */}
            <form onSubmit={handleSubmit(handleEmailLogin)}>
              <Stack spacing={3}>
                <TextField
                  {...register('email')}
                  fullWidth
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  {...register('password')}
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ py: 1.5, mt: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Sign In'}
                </Button>
              </Stack>
            </form>

            {/* Footer Links */}
            <Box textAlign="center" mt={3}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link 
                  href="/auth/signup" 
                  underline="hover"
                  sx={{ fontWeight: 600 }}
                >
                  Sign up
                </Link>
              </Typography>
              
              <Typography variant="body2" color="text.secondary" mt={1}>
                <Link 
                  href="/auth/forgot-password" 
                  underline="hover"
                  sx={{ fontWeight: 600 }}
                >
                  Forgot your password?
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default Login
