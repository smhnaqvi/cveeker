import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { linkedInService } from '../../lib/services/linkedin.service';
import type { LinkedInAuthRequest } from '../../lib/services/types';

const LinkedInCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleLinkedInCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        // Check for OAuth errors
        if (error) {
          setError(`LinkedIn authentication failed: ${error}`);
          setIsProcessing(false);
          return;
        }

        // Check for required authorization code
        if (!code) {
          setError('Authorization code not found. Please try logging in again.');
          setIsProcessing(false);
          return;
        }

        // Verify state parameter for security
        const storedState = localStorage.getItem('linkedin_state');
        if (state && storedState && state !== storedState) {
          setError('Invalid state parameter. Please try logging in again.');
          setIsProcessing(false);
          return;
        }

        // Clean up stored state
        localStorage.removeItem('linkedin_state');

        // Prepare the callback request
        const request: LinkedInAuthRequest = {
          code,
          state: state || undefined,
        };

        // Call the backend to exchange code for token and create user/resume
        const response = await linkedInService.handleCallback(request);

        if (response.data) {
          // Store user data in localStorage or your preferred state management
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('access_token', 'linkedin-auth'); // You might want to implement proper token handling
          
          // Redirect to dashboard
          navigate('/dashboard', { replace: true });
        } else {
          setError('Failed to authenticate with LinkedIn. Please try again.');
        }
      } catch (err) {
        console.error('LinkedIn callback error:', err);
        setError('An error occurred during LinkedIn authentication. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    };

    handleLinkedInCallback();
  }, [searchParams, navigate]);

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