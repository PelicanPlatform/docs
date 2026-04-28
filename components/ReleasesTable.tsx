import React from 'react';
import { 
    Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, Tooltip,
    Chip} 
    from '@mui/material';
import {PackageType, ReleasesTableProps} from '../utils/types';

const PackageNotes = {
    OSDF: "This package is compatible with Open Science Data Federation (OSDF). Download this package if you plan to use it in OSDF. Note that you need to install Pelican package first.",
    Server: "This package includes Pelican origin/cache server dependencies. Download this package if you want to serve a Pelican origin or cache server. Note that you need to install Pelican package first.",
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
                        <PackageTypeChip type={asset.specialPackage} />
                    </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </TableContainer>
    );
}

const PackageTypeChip: React.FC<{type: PackageType}> = ({type}) => {
  return (
    <Tooltip title={PackageNotes[type]} placement='right' arrow>
      <Chip label={type} color="primary" variant="outlined"/>
    </Tooltip>
  )
}

export default ReleasesTable;