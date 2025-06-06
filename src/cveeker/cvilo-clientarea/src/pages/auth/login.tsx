/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Divider, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import FormProvider from "../../provider/FormProvider";
import { GitHub, Google } from "@mui/icons-material";
import Logo from "../../components/Logo";
import Input from "../../components/Input";
import Button from "../../components/Button";

const Login = () => {
  const methods = useForm();

  const { handleSubmit } = methods;

  const onSubmit = (data: any) => {
    console.log("Email login", data);
    // Handle login with email/password here
  };

  const loginWithGoogle = () => {
    // Replace with your Google login logic
    console.log("Login with Google");
  };

  const loginWithGitHub = () => {
    // Replace with your GitHub login logic
    console.log("Login with GitHub");
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Logo />
      </Box>
      <FormProvider methods={methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Input name="email" label="Email" type="email" />
            <Input name="password" label="Password" type="password" />
            <Button type="submit" variant="contained" fullWidth>
              Login with Email
            </Button>
          </Stack>
        </form>
      </FormProvider>

      <Divider sx={{ my: 3 }}>or</Divider>

      <Stack spacing={2}>
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