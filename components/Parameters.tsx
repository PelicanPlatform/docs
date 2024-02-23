import { Box, Typography, Autocomplete, TextField, Divider} from '@mui/material';
import React, {useState, useMemo} from "react";
import { ParametersArray, ParameterDetail } from "../utils/types";
import { ParameterBox } from "./ParameterBox";

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