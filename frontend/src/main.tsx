import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './index.css';
import App from './App.tsx';
import { UserProvider } from './Context/UserContext.tsx';


//copied colors from app.css
const theme = createTheme({
  palette: {
    primary: {
      main: '#4f46e5', 
    },
    secondary: {
      main: '#6366f1', 
    },
    
    background: {
      default: '#e0e7ff', 
      paper: '#ffffff',    
    },
    text: {
      primary: '#e0e7ff', 
      secondary: '#1e1b4b', 
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h3: {
      fontWeight: 700,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <UserProvider>
         <App />
      </UserProvider>
      
    </ThemeProvider>
  </StrictMode>
);
