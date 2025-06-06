import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles"
import theme from "./config"

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
}

export default ThemeProvider