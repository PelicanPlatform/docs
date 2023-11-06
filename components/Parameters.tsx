import { Box } from '@mui/material';
import React from "react";
import { Typography	} from "@mui/material";


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
					<Typography pt={2}	variant={`h5`}>{name}</Typography>
					{Object.entries(value).map(([name, value]) => {
						return <ParameterBox name={name} value={value} />
					})}
				</Box>
		)
	}

	return (
		<Box>
			<Typography pt={2} variant={`h6`}>{name}</Typography>
			<Typography py={1} variant={`body1`}>{value.description}</Typography>
			<Box p={1} bgcolor={"#82828224"} borderRadius={1}>
				{ value.components ? <Typography variant={`body2`}>Components: {`[${value.components.join(", ")}]`}</Typography> : undefined }
				<Typography variant={`body2`}>Type: {value.type}</Typography>
				<Typography variant={`body2`}>Default: {value.default == "" ? "\"\"" : value.default}</Typography>
			</Box>
		</Box>
	)
}

export default function Parameters({parameters}) {

	parameters = formatParameters(parameters)

	return (
			<Box>
				{Object.entries(parameters).map(([name, value]) => {
					console.log("Outside", name, value)
					return <ParameterBox name={name} value={value} />
				})}
			</Box>
	)
}