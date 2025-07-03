import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { useAuthStore } from '../../stores';

const LinkedInCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const { updateUser } = useAuthStore();

  useEffect(() => {
    const handleLinkedInCallback = async () => {
      try {
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');

        // Check for required authorization code
        if (!accessToken || !refreshToken) {
          setError('Authorization code not found. Please try logging in again.');
          setIsProcessing(false);
          return;
        }

        // store access token and refresh token in local storage
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);

        // redirect to dashboard
        navigate('/dashboard', { replace: true });
      } catch (err) {
        console.error('LinkedIn callback error:', err);
        setError('An error occurred during LinkedIn authentication. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    };

    handleLinkedInCallback();
  }, [searchParams, navigate, updateUser]);

  if (isProcessing) {
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
          Authenticating with LinkedIn...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
        maxWidth={400}
        mx="auto"
        px={2}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
        <Typography variant="body1" textAlign="center">
          Please try logging in again or contact support if the problem persists.
        </Typography>
      </Box>
    );
  }

  return null;
};

export default LinkedInCallback; 