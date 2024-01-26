import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

interface VersionProps {
  handle: (event: React.MouseEvent<HTMLElement, MouseEvent>, newAlignment: string) => void;
  defaultVersion: string;
  data: Array<string>;
}

const Version:React.FC<VersionProps> = ({handle, defaultVersion, data}) => {
  return (
    <Box sx={{ display: "flex", flexDirection:"column", alignItems:"center", margin: "0 0 0 10px"}}>
      <Typography variant="overline" display="block" gutterBottom>
      Versions
      </Typography>
      <ToggleButtonGroup
        color="primary"
        value={defaultVersion}
        exclusive
        aria-label="Version"
        onChange={handle}
        size='small'
      >
        {data.map((version) => (
          <ToggleButton key={version} value={version}>{version}</ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
    
  )
}

export default Version;
