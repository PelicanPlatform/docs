'use client';

import React, { useEffect } from 'react'
import { useTheme } from 'next-themes'
import { ThemeProvider as MuiThemeProvider, createTheme, useColorScheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const muiTheme = createTheme({
	colorSchemes: {
		dark: true,
	},
});

const MaterialThemeProvider = ({ children }: { children: React.ReactNode }) => {
	return (

		<MuiThemeProvider theme={muiTheme}>
			<>
				<CssBaseline />
				{children}
			</>
		</MuiThemeProvider>
	)
}

const ThemeUnifier = ({ children }: { children: React.ReactNode }) => {

	const { theme } = useTheme();
	const { mode, setMode } = useColorScheme();

	// Sync MUI mode with Nextra theme
	useEffect(() => {
		if(theme !== mode){
			setMode(theme as 'light' | 'dark' | 'system');
		}
	}, [theme, mode]);

	return (
		<>
			{children}
		</>
	)
}

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<MaterialThemeProvider>
			<ThemeUnifier>
				{children}
			</ThemeUnifier>
		</MaterialThemeProvider>
	)
}


export default ThemeProvider;
