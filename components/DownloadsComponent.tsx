"use client"
import React, {useState, useEffect, useMemo} from 'react';
import {Architectures, OperatingSystems, Version} from './Filters';
import ReleasesTable from './ReleasesTable';
import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import allFilteredAssets, {FilteredAsset} from "../utils/fetchReleases";
import { useTheme } from '@mui/material/styles';
import data from '../public/static/releases-table-data.json'

const DownloadsComponent: React.FC  = () => {
    const [originalData, setOriginalData] = useState<FilteredAsset[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [arch, setArch] = React.useState<string>('arm64');
    const [os, setOs] = React.useState<string>('linux');
    const [version, setVersion] = React.useState<string>('v7.4');

    const theme = useTheme();

    const handleArch = (
        event: React.MouseEvent<HTMLElement, MouseEvent>,
        newAlignment: string | null,
    ) => {
        if (newAlignment) {
        setArch(newAlignment);
        }
    };

    const handleOs = (
        event: React.MouseEvent<HTMLElement, MouseEvent>,
        newOs: string | null,
    ) => {
    if (newOs !== os) {
        setOs(newOs || '');
        } else {
        setOs('');
        }
    };

    const handleVersion = (
        event: React.MouseEvent<HTMLElement, MouseEvent>,
        newVersion: string | null,
    ) => {
        if (newVersion !== version) {
        setVersion(newVersion || '');
        } else {
        setVersion('');
        }
    }

    useEffect(() => {
        // Function to fetch release assets
        const fetchAssets = async () => {
            setLoading(true);
            try {
                const assets = await allFilteredAssets();
                setOriginalData(assets); // Save the original data
            } catch (e) {
                setError('Failed to fetch release assets');
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        // Call the fetch function
        fetchAssets();
    }, []);

    // Compute unique minor versions using useMemo
    const uniqueMinorVersions= useMemo<string[]>(() => {
        const uniqueMinors = new Set<string>();
        for (const asset of originalData) {
            const versionComponents = asset.version.split('.');
            if (versionComponents.length === 3) {
                const majorMinor = `${versionComponents[0]}.${versionComponents[1]}`;
                uniqueMinors.add(majorMinor);
            }
            if (uniqueMinors.size === 4) break;
        }
        return Array.from(uniqueMinors);
    }, [originalData]);

    // Filter data using useMemo
    const displayData = useMemo(() => {
        const filtered = originalData.filter(asset => {
            const archFilter = arch && typeof arch === 'string' && arch.includes('ppc64')
                ? asset.architecture.includes('ppc64el') || asset.architecture.includes('ppc64le')
                : asset.architecture === arch;

            const osFilter = os ? asset.operatingSystem.toLowerCase() === os : true;

            const versionFilter = version ? asset.version.includes(version.toLowerCase()) : true;

            return archFilter && osFilter && versionFilter;
        });

        return arch === '' && os === '' && version === '' ? originalData : filtered;
    }, [arch, os, version, originalData]);
        
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100vh', // Full viewport height
            width: '100vw', // Full viewport width
            maxWidth: '100%', // Prevents the box from exceeding the viewport width
            margin: '1em auto',
            overflow: 'auto', // Adds scroll on smaller devices if content overflows
            [theme.breakpoints.down('md')]: {
                // Adjust styles for medium-sized devices and smaller
                height: 'auto',
                padding: theme.spacing(2),
            },
        }}>
            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        margin: theme.spacing(1),
                        [theme.breakpoints.down('sm')]: {
                            // Adjust styles for small-sized devices
                            flexDirection: 'column',
                        },
                    }}>
                        <OperatingSystems handle={handleOs} defaultOs={os} data={data.operating_systems}/>
                        <Architectures handle={handleArch} defaultArch={arch} data={data.architectures} />
                        <Version handle={handleVersion} defaultVersion={version} data={uniqueMinorVersions}/>
                    </Box>
                    <ReleasesTable rows={displayData} data={data.table_rows}/>
                </>
            )}
        </Box>
    )
}

export default DownloadsComponent;