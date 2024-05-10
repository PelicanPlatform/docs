import React from 'react';
import { 
    Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, Tooltip} 
    from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { ReleasesTableProps } from '../utils/types';

const ReleasesTable: React.FC<ReleasesTableProps> = ({ release , data }) => {
    return(
        <TableContainer component={Paper} sx={{marginTop:"15px"}}>
        <Table aria-label="simple table">
            <TableHead>
            <TableRow>
                {data.map((tableRows) => (
                <TableCell align='center' key={tableRows}><Typography variant='h6' >{tableRows}</Typography></TableCell>
                ))}
            </TableRow>
            </TableHead>
            <TableBody>
                {release.assets.map((asset, index) => (
                    <TableRow key={index}>
                    <TableCell align='center'>{release.version}</TableCell>
                    <TableCell align='center'>{asset.architecture}</TableCell>
                    <TableCell align='center'>
                        <Link href={asset.downloadUrl}>
                                {asset.name}
                        </Link>
                        <Tooltip title={asset.packageDescription} placement='right' arrow>
                            <InfoIcon sx={{fontSize:"20px", marginLeft:"4px"}} />
                        </Tooltip>
                    </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </TableContainer>
    );
}

export default ReleasesTable;