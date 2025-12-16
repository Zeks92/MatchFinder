'use client'; 

import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NextAppDirEmotionCacheProvider from './utils/helpers/EmotionCache';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#42a5f5',
    },
    secondary: {
      main: '#ff9800',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      {/* MUI-jev ThemeProvider */}
      <ThemeProvider theme={theme}>
        {/* Resetovanje CSS-a */}
        <CssBaseline /> 
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}