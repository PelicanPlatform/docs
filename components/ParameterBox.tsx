import React, { useState } from "react";
import { ParameterDetail } from "../utils/types";
import { Box, Paper, Typography, IconButton } from "@mui/material";
import { Link } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

export const ParameterBox: React.FC<{ parameter: ParameterDetail }> = ({ parameter }) => {

	const [hover, setHover] = useState(false);
	const theme = useTheme();
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
					await navigator.clipboard.writeText(url.toString());
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
				<Box p={1} sx={{
					backgroundColor: theme.palette.mode === "dark" ? "#2a2a2a" : "#f5f5f5",
					borderRadius: "0.5em",
					marginTop: "0.5em"
				}}>
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