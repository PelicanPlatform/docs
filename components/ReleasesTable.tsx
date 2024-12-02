import React from 'react';
import { 
    Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, Tooltip,
    Chip} 
    from '@mui/material';
import { ReleasesTableProps } from '../utils/types';

const OSDFNote = "This package is compatible with Open Science Data Federation (OSDF). Download this package if you plan to use it in OSDF. Note that you need to install Pelican package first."
const ServerNote = "This package includes Pelican origin/cache server dependencies. Download this package if you want to serve a Pelican origin or cache server. Note that you need to install Pelican package first."

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
                        {
                            asset.specialPackage && (
                                <Tooltip title={asset.specialPackage === "OSDF" ? OSDFNote : ServerNote} placement='right' arrow>
                                    <Chip label={asset.specialPackage} color="primary" variant="outlined" onClick={() => {window.location.hash = "#install-osdf-or-server-package"}}/>
                                </Tooltip>
                            )
                        }
                    </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </TableContainer>
    );
}

export default ReleasesTable;