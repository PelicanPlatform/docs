import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

interface OperatingSystemsProps {
  handle: (event: React.MouseEvent<HTMLElement, MouseEvent>, newAlignment: string) => void;
  defaultOs: string;
}
const OperatingSystems:React.FC<OperatingSystemsProps> = ({handle, defaultOs}) => {
    return (
        <Box sx={{ display: "flex", flexDirection:"column", alignItems:"center", margin: "0 10px 0 0"}}>
            <Typography variant="overline" display="block" gutterBottom>
            Operating Systems
            </Typography>
            <ToggleButtonGroup
                color="primary"
                value={defaultOs}
                exclusive
                aria-label="Platform"
                onChange={handle}
                size='small'
            >   
                <ToggleButton value="linux">linux</ToggleButton>
                <ToggleButton value="darwin">darwin</ToggleButton>
                <ToggleButton value="windows">windows</ToggleButton>
            </ToggleButtonGroup>
        </Box>
    )
}

export default OperatingSystems;
