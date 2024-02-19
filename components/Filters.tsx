import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { compatibilityRules, ArchitecturesProps, OperatingSystemsProps, VersionProps } from '../utils/types';

export const Architectures:React.FC<ArchitecturesProps> = ({handle, defaultArch, data, defaultOs}) => {

  const isDisabled = (arch: string) => {
    // If an OS is selected, check if the current arch is compatible
    if (defaultOs) {
      return !compatibilityRules[defaultOs].includes(arch);
    }
    return false;
  };
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
                <ToggleButton key={arch} value={arch} disabled={isDisabled(arch)}>{arch}</ToggleButton>
              ))}
          </ToggleButtonGroup>
      </Box>
  )
}


export const OperatingSystems:React.FC<OperatingSystemsProps> = ({handle, defaultOs, data, defaultArch}) => {

  const isDisabled = (os: string) => {
    // If an arch is selected, check if the current os is compatible
    if (defaultArch) {
      return !Object.keys(compatibilityRules).some((compatibleOS) => {
        return compatibilityRules[compatibleOS].includes(defaultArch) && compatibleOS === os;
      });
    }
    return false;
  };
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
              {data.map((os) => (
                <ToggleButton key={os} value={os} disabled={isDisabled(os)}>
                  {os === 'darwin' ? 'MacOS' : os}
                </ToggleButton>
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
