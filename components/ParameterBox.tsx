import React, { useState } from "react";
import { ParameterDetail } from "../utils/types";
import { Box, Divider, Typography, IconButton, useTheme } from "@mui/material";
import { Link } from "@mui/icons-material";
import MarkdownRender from "./MarkdownRender";

// Hue per component so that a given component always gets the same pill color
const componentHues: { [key: string]: number } = {
	"*": -1, // neutral grey, since it means "every component"
	origin: 212,
	cache: 152,
	director: 266,
	registry: 28,
	client: 330,
	localcache: 190,
	broker: 82,
	plugin: 0,
};

const hueFor = (component: string) => {
	const known = componentHues[component.toLowerCase()];
	if (known !== undefined) return known;
	// Deterministic fallback so unknown components still get a stable color
	let hash = 0;
	for (let i = 0; i < component.length; i++) {
		hash = (hash * 31 + component.charCodeAt(i)) % 360;
	}
	return hash;
};

const ComponentPill: React.FC<{ component: string }> = ({ component }) => {
	const theme = useTheme();
	const dark = theme.palette.mode === "dark";
	const hue = hueFor(component);
	const neutral = hue < 0;

	const color = neutral
		? theme.palette.text.secondary
		: `hsl(${hue}, 65%, ${dark ? "72%" : "32%"})`;
	const backgroundColor = neutral
		? dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"
		: `hsla(${hue}, 65%, 50%, ${dark ? 0.22 : 0.12})`;

	return (
		<Box
			component="span"
			sx={{
				color,
				backgroundColor,
				border: `1px solid ${neutral ? "transparent" : `hsla(${hue}, 65%, 50%, 0.35)`}`,
				borderRadius: "999px",
				padding: "0.1em 0.55em",
				fontSize: "0.7rem",
				fontWeight: 700,
				lineHeight: 1.6,
				letterSpacing: "0.06em",
				textTransform: "uppercase",
				whiteSpace: "nowrap",
			}}
		>
			{component}
		</Box>
	);
};

const MetaRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
	<Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", columnGap: 0.75, rowGap: 0.5 }}>
		<Typography variant="body2" component="span" fontWeight="bold">{label}:</Typography>
		{children}
	</Box>
);

const MetaValue: React.FC<{ value: string }> = ({ value }) => (
	<Typography variant="body2" component="span" sx={{ fontFamily: "ui-monospace, monospace" }}>
		{value}
	</Typography>
);

const formatValue = (value: unknown) => (value === "" ? '""' : String(value));

export const ParameterBox: React.FC<{ parameter: ParameterDetail }> = ({ parameter }) => {

	const [hover, setHover] = useState(false);
	const parts = parameter.name.split('.');
	const parameterName = parts.length > 1 ? parts[parts.length - 1] : parameter.name;
	const parameterId = parameter.name.replaceAll(".", "-")

	return (
		<Box
			id={parameterId}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			sx={{
				marginY: "1.2em",
				// Keep hash navigation from landing underneath the sticky navbar
				scrollMarginTop: "calc(var(--nextra-navbar-height, 64px) + 1rem)",
			}}
		>
			<Box mb={1}>
				<Box display={"flex"} alignItems={"baseline"} flexWrap={"wrap"} columnGap={1}>
					<Typography variant="h5">
						{parameter.name}
					</Typography>
					{hover && (
						<IconButton
							size={"small"}
							onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
								e.stopPropagation()
								// Copy link to clipboard
								const url = new URL(window.location.href);
								url.hash = parameterId;
								await navigator.clipboard.writeText(url.toString());
								window.location.hash = parameterId
							}}>
							<Link fontSize={"small"}/>
						</IconButton>
					)}
				</Box>
			</Box>
			<Box sx={{ display: "flex", flexDirection: 'column', gap: .5 }}>
				<MetaRow label="Type">
					<MetaValue value={parameter.type} />
				</MetaRow>
				<MetaRow label="Default">
					<MetaValue value={formatValue(parameter.default)} />
				</MetaRow>
				{parameter?.root_default &&
					<MetaRow label="Root Default">
						<MetaValue value={formatValue(parameter.root_default)} />
					</MetaRow>
				}
				{parameter?.client_default &&
					<MetaRow label="Client Default">
						<MetaValue value={formatValue(parameter.client_default)} />
					</MetaRow>
				}
				{parameter?.server_default &&
					<MetaRow label="Server Default">
						<MetaValue value={formatValue(parameter.server_default)} />
					</MetaRow>
				}
			</Box>
			<Box sx={{ marginTop: "0.5em" }}>
				<MarkdownRender content={parameter.description} />
			</Box>
			{parameter.components && (
				<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, marginTop: "0.8em" }}>
					{parameter.components.map((component) => (
						<ComponentPill key={component} component={component} />
					))}
				</Box>
			)}
			<Divider sx={{ marginTop: "1.2em" }} />
		</Box>
	);
};
