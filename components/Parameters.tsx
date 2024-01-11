import { Box, Paper, Typography, Autocomplete, TextField } from '@mui/material';
import React from "react";


const drillDown = (object, keys, value) => {
	let currentObject = object
	keys.forEach((key, index) => {
		if(index === keys.length - 1) {
			currentObject[key] = value
		} else {
			if(currentObject[key] === undefined){
				currentObject[key] = {}
			}
			currentObject = currentObject[key]
		}
	})
}

const collectAutocompleteOptions = (parameters, prefix = '') => {
	let options = [];
	for (const [key, value] of Object.entries(parameters)) {
	if (typeof value === 'object' && value !== null && !Array.isArray(value) && (value as { name: string }).name) {
		// If it's an object with a name, add its full path to the options
		const fullPath = `${prefix}${key}`;
		options.push(fullPath);
	  } else if (typeof value === 'object' && value !== null) {
		// If it's a nested object, recursively collect names
		options = [...options, ...collectAutocompleteOptions(value, `${prefix}${key}.`)];
	  }
	}
	return options;
  };

const formatParameters = (parameters) => {

	let formattedParameters = {}

	for(const parameter of parameters) {
		let [keyComposite, value] = Object.entries(parameter)[0]

		let keys: string[] = keyComposite.split(".")

		drillDown(formattedParameters, keys, value)
	}

	return formattedParameters
}

interface ParameterBoxProps {
	name: string
	value: any
}

function ParameterBox({name, value}: ParameterBoxProps) {
	if(value?.name == undefined) {

		return (
				<Box>
					<Typography pt={2}	mb={-2} variant={`h5`} sx={{ textDecoration: 'underline' }}>{name}</Typography>
					{Object.entries(value).map(([name, value]: [string, any]) => {
						return <ParameterBox name={name} value={value} />
					})}
				</Box>
		)
	}

	return (
		<Box id={value.name} sx={{marginTop:"2em"}}>
			<Typography variant={`subtitle2`} mb={-1}>{value.name.split(".").slice(0, -1).join(".")}</Typography>
			<Typography pt={0} pb={1} variant={`h6`}>{name}</Typography>
			<Paper elevation={2} sx={{padding:"0.7em"}}>
				<Typography variant={`body1`}>{value.description}</Typography>
				{ value.components ? <Typography variant={`body2`}>Components: {`[${value.components.join(", ")}]`}</Typography> : undefined }
				<Typography variant={`body2`}>Type: {value.type}</Typography>
				<Typography variant={`body2`}>Default: {value.default == "" ? "\"\"" : value.default}</Typography>
			</Paper>
		</Box>
	)
}

export default function Parameters({parameters}) {

	parameters = formatParameters(parameters)
	const autocompleteOptions = collectAutocompleteOptions(parameters);

	const handleAutocompleteChange = (event, value) => {
		const element = document.getElementById(value);
		if (element) {
		  element.scrollIntoView({ behavior: 'smooth' });
		}
	  };

	return (
			<Box>
				<Autocomplete
					disablePortal
					options={autocompleteOptions}
					sx={{ width: 300, marginLeft: 'auto', marginRight: 0 }}
					renderInput={(params) => <TextField {...params} label="Search..." />}
					onChange={handleAutocompleteChange}
				/>
				{Object.entries(parameters).map(([name, value]) => {
					return <ParameterBox name={name} value={value} />
				})}
			</Box>
	)
}