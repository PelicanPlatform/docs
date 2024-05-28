import React from "react";
import { PaletteMode } from '@mui/material'
import {  ThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeProvider as NextThemeProvider, useTheme } from 'next-themes';

export const DarkLightContainer = ({ children }) => {
    const { resolvedTheme } = useTheme();

    // Default to 'light' mode if resolvedTheme is undefined
    const mode: PaletteMode = resolvedTheme === 'dark' ? 'dark' : 'light';

    const muiTheme = createTheme({
        palette: {
            mode: mode,
        },
    });
    
    return (
        <NextThemeProvider>
            <ThemeProvider theme={muiTheme}>
                {children}
            </ThemeProvider>
        </NextThemeProvider>
    )
}
