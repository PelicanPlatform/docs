import React, { useState } from "react";
import { ParameterDetail } from "../utils/types";
import { Box, Paper, Typography, IconButton } from "@mui/material";
import { Link } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import MarkdownRender from "./MarkdownRender";

export const ParameterBox: React.FC<{ parameter: ParameterDetail }> = ({ parameter }) => {

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
		>
			<Paper elevation={hover ? 3 : 1} sx={{ padding: "0.7em" }}>
				<Box mb={1}>
					<Box display={"flex"} justifyContent={"space-between"}>
						<Typography variant="h5" >
							{parameterName}
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
					{/* If groupName exists, display it on a separate line */}
					{groupName && (
							<Typography variant="subtitle2" component="div">
								{groupName}
							</Typography>
					)}
				</Box>
				<Box>
					<MarkdownRender content={parameter.description} />
				</Box>
				<Box p={1} sx={{
					borderRadius: "0.5em",
					marginTop: "0.5em",
					backdropFilter: "contrast(1)"
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
					{parameter?.root_default &&
							<Typography variant="body2">
								Root Default: {parameter?.root_default === "" ? '""' : parameter?.root_default.toString()}
							</Typography>
					}
					{parameter?.client_default &&
							<Typography variant="body2">
								Client Default: {parameter?.client_default === "" ? '""' : parameter?.client_default.toString()}
							</Typography>
					}
					{parameter?.server_default &&
							<Typography variant="body2">
								Server Default: {parameter?.server_default === "" ? '""' : parameter?.server_default.toString()}
							</Typography>
					}
				</Box>
			</Paper>
	  </Box>
	);
  };
