import { RouterProvider } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import router from './router/router'
import ThemeProvider from './provider/ThemeProvider'

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
