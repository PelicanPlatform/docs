import React from 'react';
import { 
    Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, Tooltip,
    Chip} 
    from '@mui/material';
import {PackageType, ReleasesTableProps} from '../utils/types';

// Default tooltip per chip type. An asset may carry its own
// packageDescription (set at fetch time) that overrides this, which is how
// the Server chip explains add-on versus standalone packaging by version.
const PackageNotes: Record<PackageType, string> = {
    OSDF: "This package is compatible with Open Science Data Federation (OSDF). Download this package if you plan to use it in OSDF. Note that you need to install Pelican package first.",
    Server: "This package provides the Pelican server (Origin, Cache, Director, or Registry).",
    Client: "This package includes Pelican client dependencies. Download this package if you want to use the Pelican client."
}

const ReleasesTable: React.FC<ReleasesTableProps> = ({ release , rowNames }) => {
    return(
        <TableContainer component={Paper} sx={{marginTop:"15px"}}>
        <Table aria-label="download table">
            <TableHead>
                <TableRow>
                    {rowNames.map((rowName) => (
                    <TableCell align='center' key={rowName}><Typography variant='h6' >{rowName}</Typography></TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {release.assets.map((asset, index) => (
                    <TableRow key={index}>
                    <TableCell align='center'>{release.version}</TableCell>
                    <TableCell align='center'>{asset.architecture}</TableCell>
                    <TableCell align='center'>{asset.osDisplayed}</TableCell>
                    <TableCell align='center'>
                        <Link href={"https://dl.pelicanplatform.org/" + asset.downloadUrl.replace("https://github.com/PelicanPlatform/pelican/releases/download/", "").substring(1)}>
                                {asset.name}
                        </Link>
                    </TableCell>
                    <TableCell>
                        <PackageTypeChip type={asset.specialPackage} description={asset.packageDescription} />
                    </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </TableContainer>
    );
}

const PackageTypeChip: React.FC<{type: PackageType, description?: string}> = ({type, description}) => {
  return (
    <Tooltip title={description ?? PackageNotes[type]} placement='right' arrow>
      <Chip label={type} color="primary" variant="outlined"/>
    </Tooltip>
  )
}

export default ReleasesTable;