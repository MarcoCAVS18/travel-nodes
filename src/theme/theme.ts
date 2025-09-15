import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#64b5f6',
      light: '#90caf9',
      dark: '#42a5f5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#81c784',
      light: '#a5d6a7',
      dark: '#66bb6a',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    surface: {
      main: '#2d2d2d',
      light: '#3d3d3d',
      dark: '#1d1d1d',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    error: {
      main: '#f44336',
      light: '#ef5350',
      dark: '#d32f2f',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.2)',
    '0px 4px 8px rgba(0, 0, 0, 0.2)',
    '0px 6px 12px rgba(0, 0, 0, 0.3)',
    '0px 8px 16px rgba(0, 0, 0, 0.3)',
    '0px 10px 20px rgba(0, 0, 0, 0.4)',
    '0px 12px 24px rgba(0, 0, 0, 0.4)',
    '0px 16px 32px rgba(0, 0, 0, 0.5)',
    '0px 20px 40px rgba(0, 0, 0, 0.6)',
    '0px 20px 40px rgba(0, 0, 0, 0.6)',
    '0px 20px 40px rgba(0, 0, 0, 0.6)',
    '0px 20px 40px rgba(0, 0, 0, 0.6)',
    '0px 20px 40px rgba(0, 0, 0, 0.6)',
    '0px 20px 40px rgba(0, 0, 0, 0.6)',
    '0px 20px 40px rgba(0, 0, 0, 0.6)',
    '0px 20px 40px rgba(0, 0, 0, 0.6)',
    '0px 20px 40px rgba(0, 0, 0, 0.6)',
    '0px 20px 40px rgba(0, 0, 0, 0.6)',
    '0px 20px 40px rgba(0, 0, 0, 0.6)',
    '0px 20px 40px rgba(0, 0, 0, 0.6)',
    '0px 20px 40px rgba(0, 0, 0, 0.6)',
    '0px 20px 40px rgba(0, 0, 0, 0.6)',
    '0px 20px 40px rgba(0, 0, 0, 0.6)',
    '0px 20px 40px rgba(0, 0, 0, 0.6)',
    '0px 20px 40px rgba(0, 0, 0, 0.6)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          overflow: 'hidden',
          margin: 0,
          padding: 0,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: '#1a1a1a',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0px 8px 16px rgba(100, 181, 246, 0.3)',
          '&:hover': {
            boxShadow: '0px 12px 24px rgba(100, 181, 246, 0.4)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#64b5f6',
            },
          },
        },
      },
    },
  },
});

declare module '@mui/material/styles' {
  interface Palette {
    surface: {
      main: string;
      light: string;
      dark: string;
    };
  }

  interface PaletteOptions {
    surface?: {
      main: string;
      light: string;
      dark: string;
    };
  }
}