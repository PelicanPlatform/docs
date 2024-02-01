import React from 'react';
import { 
    Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, IconButton} 
    from '@mui/material';
import { FilteredAsset } from '../utils/fetchReleases';
import DownloadIcon from '@mui/icons-material/Download';



interface ReleasesTableProps {
    data: Array<string>;
    rows: FilteredAsset[];
  }

  const ReleasesTable: React.FC<ReleasesTableProps> = ({ rows, data }) => {
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
            {rows.map((row) => (
                <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                <TableCell align='center' component="th" scope="row">
                    {row.version}
                </TableCell>
                <TableCell align='center'>{row.operatingSystem}</TableCell>
                <TableCell align='center'>{row.architecture}</TableCell>
                <TableCell align='center'>{row.packageType}</TableCell>
                <TableCell align='center'><Link href={row.downloadUrl}><IconButton><DownloadIcon color='primary'/></IconButton></Link></TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    );
}

export default ReleasesTable;