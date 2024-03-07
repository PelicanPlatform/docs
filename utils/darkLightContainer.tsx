import React, { use, useEffect, useState } from "react";
import { PaletteMode, ThemeProvider, createTheme } from '@mui/material';
import { useTheme } from 'next-themes';
import CssBaseline from '@mui/material/CssBaseline';

export const DarkLightContainer = ({ children }) => {
    const { resolvedTheme } = useTheme();
    const [theme, setTheme] = useState('dark');
    useEffect(() => {
        let mounted = true;
        if (resolvedTheme === 'system') {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                setTheme('dark');
            }
            else {
                setTheme('light');
            }
        } else {
            setTheme(resolvedTheme);
        }

        return () => {
            mounted = false;
        };
    }, [resolvedTheme]);

    const muiTheme = createTheme({
        palette: {
            mode: theme as PaletteMode,
        }
    });

    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}
