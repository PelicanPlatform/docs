import { Box, Typography, Autocomplete, TextField, Divider, IconButton} from '@mui/material';
import React, {useState, useMemo} from "react";
import { ParametersArray, ParameterDetail } from "../utils/types";
import { ParameterBox } from "./ParameterBox";
import { ParameterChips } from './ParameterChips';
import { Link } from "@mui/icons-material";
import { DarkLightContainer } from '@/utils/darkLightContainer';

const Parameters: React.FC<{ parameters: ParametersArray }> = ({ parameters }) => {
	const [searchValue, setSearchValue] = useState('');
	const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
	const [hover, setHover] = useState(false);

	const filteredParameters = useMemo(() => {
		const searchLower = searchValue.toLowerCase();
		return parameters.filter((parameter) => {
			const parameterName = Object.keys(parameter)[0].toLowerCase();
			const detail = Object.values(parameter)[0];

			// Ensure detail.components is defined and is an array before calling includes.
			const isComponentMatch = selectedComponent ? (Array.isArray(detail.components) && detail.components.includes(selectedComponent)) : true;
			return parameterName.includes(searchLower) && isComponentMatch;
		});
	}, [searchValue, parameters, selectedComponent]);
  
	const groupedParameters = useMemo(() => {
	  	const groups: { [key: string]: ParameterDetail[] } = {};
	  	filteredParameters.forEach((param) => {
			const detail = Object.values(param)[0];
			const parent = detail.name.split('.').slice(0, -1).join('.');
			const group = parent || '';
  
			if (!groups[group]) {
			groups[group] = [];
			}
			groups[group].push(detail);
		});
	  	return groups;
	}, [filteredParameters]);
	return (
		<DarkLightContainer>
	  	<Box>
			<Autocomplete
			disablePortal
			options={parameters.map((param) => Object.keys(param)[0])}
			onInputChange={(_, value) => setSearchValue(value)}
			sx={{ marginBottom: 2 }}
			fullWidth={true}
			freeSolo
			renderInput={(params) => (
				<TextField
				{...params}
				label="Search..."
				value={searchValue}
				onChange={(event) => setSearchValue(event.target.value)}
				/>
			)}
			/>
			<ParameterChips handleClick={(component) => {
			setSelectedComponent(component);
			setSearchValue('');
			}} />
			{Object.entries(groupedParameters).map(([group, groupParams]) => (
			<Box 
				key={group}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				>
				<Typography 
					sx={{ 
						marginTop: ".5em"
							
					}} 
					variant="h4" 
					gutterBottom 
					id={group}
				>
					{group}
					{hover && group && group !== "" && (
						<IconButton 
							size={"small"}
							onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
								e.stopPropagation()
								// Copy link to clipboard
								const url = new URL(window.location.href);
								url.hash = group
								await navigator.clipboard.writeText(url.toString());
							}}
						>
							<Link fontSize={"small"}/>
						</IconButton>
					)}
				</Typography>
				
				{group && group !== "" && (
				<Divider sx={{ height: "0.5em", backgroundColor: "#0885ff", width: "100%", borderRadius: "0.5em" }} />
				)}
				{groupParams.map((param, index) => (
				<ParameterBox key={index} parameter={param} />
				))}
			</Box>
			))}
			{filteredParameters.length === 0 && (searchValue || selectedComponent) ? (
			<Typography variant="h5">No results found</Typography>
			) : null}
	  	</Box>
		</DarkLightContainer>
	);
  };
  
  export default Parameters;