import { Box, Paper, Typography, Autocomplete, TextField, Divider, IconButton} from '@mui/material';
import {Link} from "@mui/icons-material";
import React, {useState, useMemo} from "react";

interface ParameterDetail {
	components: string[];
	default: boolean | string;
	description: string;
	name: string;
	type: string;
  }
  
interface Parameter {
	[key: string]: ParameterDetail;
  }
  
type ParametersArray = Parameter[];

const ParameterBox: React.FC<{ parameter: ParameterDetail }> = ({ parameter }) => {

	const [hover, setHover] = useState(false);

	const parts = parameter.name.split('.');
	const groupName = parts.length > 1 ? parts.slice(0, -1).join('.') : null;
	const parameterName = parts.length > 1 ? parts[parts.length - 1] : parameter.name;
	const parameterId = parameter.name.replace(".", "-")

	return (
	  <Box
				id={parameterId}
				sx={{ marginTop: ".8em" }}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				onClick={async () => {
					// Copy link to clipboard
					const url = new URL(window.location.href);
					url.hash = parameterId;
					await navigator.clipboard.writeText(url);
				}}
		>
			<Paper elevation={hover ? 3 : 1} sx={{ padding: "0.7em" }}>
				<Box mb={1}>
					<Box display={"flex"} justifyContent={"space-between"}>
						<Typography variant="h5" >
							{parameterName}
						</Typography>
						{hover && (
							<IconButton size={"small"}>
								<Link fontSize={"small"}/>
							</IconButton>
						)}
					</Box>
					{/* If groupName exists, display it on a separate line */}
					{groupName && (
							<Typography variant="subtitle2" component="div">
								{groupName}
							</Typography>
					)}
				</Box>
				<Typography variant="body1" mb={1}>
				{parameter.description}
				</Typography>
				<Box p={1} bgcolor={"#e7e7e7"}>
					{parameter.components && (
							<Typography variant="body2">
								Components: [{parameter.components.join(", ")}]
							</Typography>
					)}
					<Typography variant="body2">
						Type: {parameter.type}
					</Typography>
					<Typography variant="body2">
						Default: {parameter.default === "" ? '""' : parameter.default.toString()}
					</Typography>
				</Box>
			</Paper>
	  </Box>
	);
  };

  const Parameters: React.FC<{ parameters: ParametersArray }> = ({ parameters }) => {
	const [searchValue, setSearchValue] = useState('');
  
	const filteredParameters = useMemo(() => {
	  const searchLower = searchValue.toLowerCase();
	  return parameters.filter((parameter) => {
		const parameterName = Object.keys(parameter)[0].toLowerCase();
		return parameterName.includes(searchLower);
	  });
	}, [searchValue, parameters]);

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
		<Box>
			<Autocomplete
					disablePortal
					options={parameters.map((param) => Object.keys(param)[0])}
					onInputChange={(_, value) => setSearchValue(value)}
					sx={{marginBottom: 2}}
					fullWidth={true}
					renderInput={(params) => (
							<TextField
									{...params}
						label="Search..."
						value={searchValue}
						onChange={(event) => setSearchValue(event.target.value)}
					/>
				)}
			/>
			{Object.entries(groupedParameters).map(([group, groupParams]) => (
				<React.Fragment key={group}>
				<Typography sx={{ marginTop: ".5em" }} variant="h4" gutterBottom>{group}</Typography>
				{group && group !== "" && (
					<Divider sx={{ height: "0.5em", backgroundColor: "#0885ff", width: "100%", borderRadius: "0.5em" }} />
				)}
				{groupParams.map((param, index) => (
					<ParameterBox key={index} parameter={param} />
				))}
				</React.Fragment>
			))}
			{filteredParameters.length === 0 && searchValue ? (
				<Typography variant="h5">No results found</Typography>
			) : null}
    	</Box>
	  );
	};
	
	export default Parameters;