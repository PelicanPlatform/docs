'use client';

import { Box, Typography, Divider, IconButton } from '@mui/material';
import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { ParametersArray, ParameterDetail } from "../utils/types";
import { ParameterBox } from "./ParameterBox";
import { ParameterFilters } from './ParameterFilters';
import { Link } from "@mui/icons-material";

// Parameters whose name has no dot are bucketed under this configuration category
const GENERAL_CATEGORY = "General";

// Components listed as "*" apply to every component, so they match any component filter
const ALL_COMPONENTS = "*";

const COMPONENT_PARAM = "component";
const CONFIG_PARAM = "config";

const configCategory = (name: string) =>
	name.includes('.') ? name.split('.')[0] : GENERAL_CATEGORY;

// Match the URL value case-insensitively against the known options, ignoring anything unrecognized
const readParam = (params: URLSearchParams, key: string, allowed: string[]) => {
	const raw = params.get(key)?.trim().toLowerCase();
	if (!raw) return '';
	return allowed.find((option) => option.toLowerCase() === raw) ?? '';
};

const Parameters: React.FC<{ parameters: ParametersArray }> = ({ parameters }) => {
	const [selectedComponent, setSelectedComponent] = useState('');
	const [selectedConfig, setSelectedConfig] = useState('');
	const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

	// Only the parameters that are actually rendered drive the filter options
	const visibleParameters = useMemo(
		() => parameters
			.map((parameter) => Object.values(parameter)[0])
			.filter((detail) => !detail.hidden),
		[parameters]
	);

	const componentOptions = useMemo(() => {
		const components = new Set<string>();
		visibleParameters.forEach((detail) => {
			if (!Array.isArray(detail.components)) return;
			detail.components
				.filter((component) => component !== ALL_COMPONENTS)
				.forEach((component) => components.add(component));
		});
		return Array.from(components).sort();
	}, [visibleParameters]);

	const configOptions = useMemo(() => {
		const categories = new Set<string>();
		visibleParameters.forEach((detail) => categories.add(configCategory(detail.name)));
		return Array.from(categories).sort();
	}, [visibleParameters]);

	// Hydrate the filters from the URL so that filtered links can be shared
	const hydrated = useRef(false);
	useEffect(() => {
		const applyFromUrl = () => {
			const params = new URLSearchParams(window.location.search);
			setSelectedComponent(readParam(params, COMPONENT_PARAM, componentOptions));
			setSelectedConfig(readParam(params, CONFIG_PARAM, configOptions));
			hydrated.current = true;
		};

		applyFromUrl();
		window.addEventListener('popstate', applyFromUrl);
		return () => window.removeEventListener('popstate', applyFromUrl);
	}, [componentOptions, configOptions]);

	// Mirror the filters back into the URL, leaving the hash (deep links) alone
	useEffect(() => {
		if (!hydrated.current) return;

		const url = new URL(window.location.href);
		const setParam = (key: string, value: string) => {
			if (value) {
				url.searchParams.set(key, value);
			} else {
				url.searchParams.delete(key);
			}
		};

		setParam(COMPONENT_PARAM, selectedComponent);
		setParam(CONFIG_PARAM, selectedConfig);

		if (url.toString() !== window.location.href) {
			window.history.replaceState(null, '', url.toString());
		}
	}, [selectedComponent, selectedConfig]);

	const filteredParameters = useMemo(() => {
		return visibleParameters.filter((detail) => {
			const isComponentMatch = selectedComponent === '' || (
				Array.isArray(detail.components) && (
					detail.components.includes(ALL_COMPONENTS) ||
					detail.components.includes(selectedComponent)
				)
			);
			const isConfigMatch = selectedConfig === '' ||
				configCategory(detail.name) === selectedConfig;

			return isComponentMatch && isConfigMatch;
		});
	}, [visibleParameters, selectedComponent, selectedConfig]);

	// Filtering removes parameters above the hash target, so whatever the browser
	// scrolled to on load is no longer in the right place. Re-find it once the
	// filtered list has been laid out.
	const hasFilters = selectedComponent !== '' || selectedConfig !== '';
	useEffect(() => {
		if (!hydrated.current || !hasFilters) return;

		const id = decodeURIComponent(window.location.hash.slice(1));
		if (!id) return;

		// Two frames: the first lets React commit, the second lets layout settle
		let frame = requestAnimationFrame(() => {
			frame = requestAnimationFrame(() => {
				document.getElementById(id)?.scrollIntoView();
			});
		});
		return () => cancelAnimationFrame(frame);
	}, [hasFilters, filteredParameters]);

	const groupedParameters = useMemo(() => {
		const groups: { [key: string]: ParameterDetail[] } = {};
		filteredParameters.forEach((detail) => {
			const parent = detail.name.split('.').slice(0, -1).join('.');
			const group = parent || '';

			if (!groups[group]) {
				groups[group] = [];
			}
			groups[group].push(detail);
		});
		return groups;
	}, [filteredParameters]);

	const copyGroupLink = useCallback(async (groupHash: string) => {
		const url = new URL(window.location.href);
		url.hash = groupHash;
		await navigator.clipboard.writeText(url.toString());
		window.location.hash = groupHash;
	}, []);

	return (
		<Box>
			<ParameterFilters
				componentOptions={componentOptions}
				configOptions={configOptions}
				selectedComponent={selectedComponent}
				selectedConfig={selectedConfig}
				onComponentChange={setSelectedComponent}
				onConfigChange={setSelectedConfig}
			/>
			{Object.entries(groupedParameters).map(([group, groupParams]) => {

				const group_hash = group.replaceAll('.', '-');

				return (
					<Box
						key={group}
						onMouseEnter={() => setHoveredGroup(group)}
						onMouseLeave={() => setHoveredGroup(null)}
					>
						<Typography
							sx={{
								marginTop: ".5em",
								// Keep hash navigation from landing underneath the sticky navbar
								scrollMarginTop: "calc(var(--nextra-navbar-height, 64px) + 1rem)",
							}}
							variant="h4"
							gutterBottom
							id={group_hash}
						>
							{group}
							{hoveredGroup === group && group !== "" && (
								<IconButton
									size={"small"}
									onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
										e.stopPropagation()
										await copyGroupLink(group_hash)
									}}
								>
									<Link fontSize={"small"}/>
								</IconButton>
							)}
						</Typography>

						{group !== "" && (
							<Divider sx={{height: "0.5em", backgroundColor: "#0885ff", width: "100%", borderRadius: "0.5em"}}/>
						)}
						{groupParams.map((param) => (
							<ParameterBox key={param.name} parameter={param}/>
						))}
					</Box>
				)
			})}
			{filteredParameters.length === 0 ? (
				<Typography variant="h5">No results found</Typography>
			) : null}
		</Box>
	);
};

export default Parameters;
