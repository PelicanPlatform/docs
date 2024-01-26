import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

interface ArchitecturesProps {
  handle: (event: React.MouseEvent<HTMLElement, MouseEvent>, newAlignment: string) => void;
  defaultArch: string;
}

const Architectures:React.FC<ArchitecturesProps> = ({handle, defaultArch}) => {
    return (
        <Box sx={{ display: "flex", flexDirection:"column", alignItems:"center", margin: "0 10px"}}>
            <Typography variant="overline" display="block" gutterBottom>
            Architectures
            </Typography>
            <ToggleButtonGroup
                color="primary"
                value={defaultArch}
                exclusive
                aria-label="Architecture"
                onChange={handle}
                size='small'
            >
                <ToggleButton value="arm64">arm64</ToggleButton>
                <ToggleButton value="amd64">amd64</ToggleButton>
                <ToggleButton value="ppc64el">ppc64</ToggleButton>
                <ToggleButton value="x86_64">x86_64</ToggleButton>
                <ToggleButton value="aarch64">aarch64</ToggleButton>
            </ToggleButtonGroup>
        </Box>
    )
}

export default Architectures;
