import React from 'react';
import { 
    Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link} 
    from '@mui/material';
import { FilteredRelease } from '../utils/fetchReleases';



interface ReleasesTableProps {
    data: Array<string>;
    release: FilteredRelease;
}

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
                    <TableCell align='center'>{asset.operatingSystem}</TableCell>
                    <TableCell align='center'>{asset.architecture}</TableCell>
                    <TableCell align='center'>
                        <Link href={asset.downloadUrl}>{asset.name}</Link>
                    </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </TableContainer>
    );
}

export default ReleasesTable;