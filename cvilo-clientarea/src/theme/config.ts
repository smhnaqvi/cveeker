import { createTheme } from "@mui/material/styles"

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#10a37f', // ChatGPT green
      light: '#1a7f64',
      dark: '#0d8b6f',
    },
    secondary: {
      main: '#6b7280', // Gray
    },
    background: {
      default: '#0d1117', // GitHub dark
      paper: '#161b22', // Slightly lighter dark
    },
    text: {
      primary: '#f0f6fc',
      secondary: '#8b949e',
    },
    divider: '#30363d',
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 6,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(16, 163, 127, 0.3)',
          },
        },
        outlined: {
          borderColor: '#30363d',
          '&:hover': {
            borderColor: '#10a37f',
            backgroundColor: 'rgba(16, 163, 127, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #30363d',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '20px',
          '&:last-child': {
            paddingBottom: '20px',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
        outlined: {
          borderColor: '#30363d',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: '#30363d',
          borderRadius: 4,
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
  },
})

export default theme