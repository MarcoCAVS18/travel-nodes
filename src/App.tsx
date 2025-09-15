import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { NodesProvider } from './contexts/NodesContext';
import { CustomThemeProvider } from './contexts/ThemeContext';
import Canvas from './components/canvas/Canvas';
import { theme } from './theme/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CustomThemeProvider>
        <NodesProvider>
          <Canvas />
        </NodesProvider>
      </CustomThemeProvider>
    </ThemeProvider>
  );
}

export default App;