import { Box, Paper, Typography, Autocomplete, TextField, Divider } from '@mui/material';
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

	const parts = parameter.name.split('.');
	const groupName = parts.length > 1 ? parts.slice(0, -1).join('.') : null;
	const parameterName = parts.length > 1 ? parts[parts.length - 1] : parameter.name;

	return (
	  <Box id={parameter.name} sx={{ marginTop: "2em" }}>
		{/* If groupName exists, display it on a separate line */}
		{groupName && (
			<Typography variant="subtitle1" component="div" mb={-1}>
			{groupName}
			</Typography>
		)}
		<Typography variant="h5" >
			{parameterName}
		</Typography>
		<Paper elevation={2} sx={{ padding: "0.7em" }}>
		  <Typography variant="body1">
			{parameter.description}
		  </Typography>
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
				sx={{ width: 300, marginBottom: 2, marginLeft: "auto" }}
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
				<Typography sx={{ marginTop: "2em" }} variant="h4" gutterBottom>{group}</Typography>
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