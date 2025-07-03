/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Divider, Stack, Alert, Typography, Link } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import FormProvider from "../../provider/FormProvider";
import { GitHub, Google, LinkedIn } from "@mui/icons-material";
import Logo from "../../components/Logo";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { linkedInService } from "../../lib/services/linkedin.service";
import { useAuthStore } from "../../stores";

const Login = () => {
  const methods = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLinkedInLoading, setIsLinkedInLoading] = useState(false);
  const { login, isLoading } = useAuthStore();

  const { handleSubmit } = methods;

  const onSubmit = async (data: any) => {
    setError(null);
    
    try {
      console.log("Email login", data);
      await login(data.email, data.password);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: unknown) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  const loginWithGoogle = () => {
    // Replace with your Google login logic
    console.log("Login with Google");
  };

  const loginWithGitHub = () => {
    // Replace with your GitHub login logic
    console.log("Login with GitHub");
  };

  const loginWithLinkedIn = async () => {
    setIsLinkedInLoading(true);
    setError(null);
    
    try {
      // Generate a random state for security
      const state = Math.random().toString(36).substring(2, 15);
      
      // Get LinkedIn authorization URL from backend
      const response = await linkedInService.getAuthURL(state);
      
      if (response.data?.auth_url) {
        // Store state in localStorage for verification during callback
        localStorage.setItem('linkedin_state', state);
        
        // Redirect to LinkedIn OAuth
        window.location.href = response.data.auth_url;
      } else {
        throw new Error('Failed to get LinkedIn authorization URL');
      }
    } catch (err) {
      console.error("LinkedIn login error:", err);
      setError("Failed to initiate LinkedIn login. Please try again.");
    } finally {
      setIsLinkedInLoading(false);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Logo />
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <FormProvider onSubmit={onSubmit} methods={methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Input name="email" label="Email" type="email" />
            <Input name="password" label="Password" type="password" />
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login with Email"}
            </Button>
          </Stack>
        </form>
      </FormProvider>

      <Box textAlign="center" mt={2}>
        <Typography variant="body2">
          Don't have an account?{" "}
          <Link component={RouterLink} to="/register">
            Sign up
          </Link>
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }}>or</Divider>

      <Stack spacing={2}>
        <Button
          onClick={loginWithLinkedIn}
          variant="outlined"
          startIcon={<LinkedIn />}
          fullWidth
          disabled={isLinkedInLoading}
        >
          {isLinkedInLoading ? "Connecting..." : "Continue with LinkedIn"}
        </Button>
        <Button
          onClick={loginWithGoogle}
          variant="outlined"
          startIcon={<Google />}
          fullWidth
        >
          Continue with Google
        </Button>
        <Button
          onClick={loginWithGitHub}
          variant="outlined"
          startIcon={<GitHub />}
          fullWidth
        >
          Continue with GitHub
        </Button>
      </Stack>
    </Box>
  );
};

export default Login;