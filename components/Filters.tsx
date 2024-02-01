import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

interface VersionProps {
  handle: (event: React.MouseEvent<HTMLElement, MouseEvent>, newAlignment: string) => void;
  defaultVersion: string;
  data: Array<string>;
}

interface ArchitecturesProps {
  handle: (event: React.MouseEvent<HTMLElement, MouseEvent>, newAlignment: string) => void;
  defaultArch: string;
  data: Array<string>;
}

interface OperatingSystemsProps {
  handle: (event: React.MouseEvent<HTMLElement, MouseEvent>, newAlignment: string) => void;
  defaultOs: string;
  data: Array<string>;
}

export const Architectures:React.FC<ArchitecturesProps> = ({handle, defaultArch, data}) => {
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
              {data.map((arch) => (
              <ToggleButton key={arch} value={arch}>{arch}</ToggleButton>
              ))}
          </ToggleButtonGroup>
      </Box>
  )
}


export const OperatingSystems:React.FC<OperatingSystemsProps> = ({handle, defaultOs, data}) => {
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
              {data.map((operating_systems) => (
              <ToggleButton key={operating_systems} value={operating_systems}>{operating_systems}</ToggleButton>
              ))}
          </ToggleButtonGroup>
      </Box>
  )
}

export const Version:React.FC<VersionProps> = ({handle, defaultVersion, data}) => {
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
