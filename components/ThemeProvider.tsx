'use client';

import {createTheme} from "@mui/material/styles";
import {ThemeProvider as MuiThemeProvider} from "@mui/material/styles";
import { useTheme } from 'next-themes'

import {useMemo} from "react";

const ThemeProvider = ({children}) => {

	const theme = useTheme()

	const muiTheme = useMemo(
		() =>
			createTheme({
				palette: {
					mode: theme.theme as 'light' || 'dark',
				},
			}),
		[theme],
	);

	return <MuiThemeProvider theme={muiTheme}>
		{children}
	</MuiThemeProvider>
}

export default ThemeProvider;
