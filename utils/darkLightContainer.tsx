import React, {useState} from "react";
import { PaletteMode, ThemeProvider, createTheme } from '@mui/material';
import { useTheme } from 'next-themes';
import CssBaseline from '@mui/material/CssBaseline';

export const DarkLightContainer = ({ children }) => {
    const {theme, setTheme} = useTheme()

    const getSystemTheme = () => {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      };

    // Create a theme instance with the state
    const materialTheme = React.useMemo(() => {
        // Determine the effective theme mode: 'light', 'dark', or system's preference
        const effectiveThemeMode = theme === 'system' ? getSystemTheme() : theme;

        return createTheme({
            palette: {
                mode: effectiveThemeMode as PaletteMode,
            },
        });
    }, [theme]);

    return (
        <ThemeProvider theme={materialTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}
