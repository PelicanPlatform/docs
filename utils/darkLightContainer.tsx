import React from "react";
import { PaletteMode } from '@mui/material'
import {  ThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeProvider as NextThemeProvider, useTheme } from 'next-themes';

export const DarkLightContainer = ({ children }) => {
    const { resolvedTheme } = useTheme();

    const muiTheme = createTheme({
        palette: {
            mode: resolvedTheme as PaletteMode,
        }
    });

    return (
        <NextThemeProvider>
            <ThemeProvider theme={muiTheme}>
                {children}
            </ThemeProvider>
        </NextThemeProvider>
    )
}
