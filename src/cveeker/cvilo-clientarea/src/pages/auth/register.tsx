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
import { authService } from "../../lib/services/auth.service";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

const Register = () => {
  const methods = useForm<RegisterFormData>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLinkedInLoading, setIsLinkedInLoading] = useState(false);

  const { handleSubmit } = methods;

  const onSubmit = async (data: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Register", data);
      const response = await authService.register(data);
      
      if (response.data) {
        // Store token in localStorage
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithGoogle = () => {
    // Replace with your Google registration logic
    console.log("Register with Google");
  };

  const registerWithGitHub = () => {
    // Replace with your GitHub registration logic
    console.log("Register with GitHub");
  };

  const registerWithLinkedIn = async () => {
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
      console.error("LinkedIn registration error:", err);
      setError("Failed to initiate LinkedIn registration. Please try again.");
    } finally {
      setIsLinkedInLoading(false);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Logo />
      </Box>
      
      <Typography variant="h4" textAlign="center" mb={3}>
        Create Account
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <FormProvider onSubmit={onSubmit} methods={methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Input name="name" label="Full Name" type="text" />
            <Input name="email" label="Email" type="email" />
            <Input name="password" label="Password" type="password" />
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </Stack>
        </form>
      </FormProvider>

      <Box textAlign="center" mt={2}>
        <Typography variant="body2">
          Already have an account?{" "}
          <Link component={RouterLink} to="/login">
            Sign in
          </Link>
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }}>or</Divider>

      <Stack spacing={2}>
        <Button
          onClick={registerWithLinkedIn}
          variant="outlined"
          startIcon={<LinkedIn />}
          fullWidth
          disabled={isLinkedInLoading}
        >
          {isLinkedInLoading ? "Connecting..." : "Continue with LinkedIn"}
        </Button>
        <Button
          onClick={registerWithGoogle}
          variant="outlined"
          startIcon={<Google />}
          fullWidth
        >
          Continue with Google
        </Button>
        <Button
          onClick={registerWithGitHub}
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

export default Register; 