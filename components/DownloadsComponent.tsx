"use client"
import React, {useState, useEffect} from 'react';
import OperatingSystems from './OperatingSystems';
import Architectures from './Architectures';
import Version from './Version';
import ReleasesTable from './ReleasesTable';
import { Box } from '@mui/material';
import { RotatingLines } from "react-loader-spinner";
import allFilteredAssets, {FilteredAsset} from "../utils/fetchReleases";
import { useTheme } from '@mui/material/styles';

const DownloadsComponent: React.FC  = () => {
    const [originalData, setOriginalData] = useState<FilteredAsset[]>([]);
    const [displayData, setDisplayData] = useState<FilteredAsset[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [arch, setArch] = React.useState<string>('arm64');
    const [os, setOs] = React.useState<string>('linux');
    const [version, setVersion] = React.useState<string>('v7.4');
    const [uniqueMinorVersions, setUniqueMinorVersions] = useState<string[]>([]);

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
        let ignore = false;
        const fetchAssets = async () => {
            if (!ignore) {
                setLoading(true);
            try {
                const assets = await allFilteredAssets();
                setOriginalData(assets); // Save the original data
                setDisplayData(assets);  // Start with all data displayed
            } catch (e) {
                setError('Failed to fetch release assets');
                console.error(e);
            } finally {
                setLoading(false);
            }
            } 
        };
        // Call the fetch function
        fetchAssets();

        // Cleanup function to avoid setting state on unmounted component
        return () => {
            ignore = true;
        };
    }, []);

    useEffect(() => {
        const uniqueMinors = new Set<string>();
        for (const asset of originalData) {
        const versionComponents = asset.version.split('.');
        if (versionComponents.length === 3) { // Ensure it's Major.Minor.Patch
            const majorMinor = `${versionComponents[0]}.${versionComponents[1]}`;
            uniqueMinors.add(majorMinor);
        }
        if (uniqueMinors.size === 4) break; // Stop after collecting 4 unique minors
        }
        setUniqueMinorVersions(Array.from(uniqueMinors));
    }, [originalData]);

    useEffect(() => {
        const filtered = originalData.filter(asset => {
            // Filter for architecture
            const archFilter = arch && typeof arch === 'string' && arch.includes('ppc64')
                ? asset.architecture.includes('ppc64el') || asset.architecture.includes('ppc64le')
                : asset.architecture === arch;

            // Filter for operating system, if os is set
            const osFilter = os ? asset.operatingSystem.toLowerCase() === os : true;

            // Filter for version, if version is set
            const versionFilter = version ? asset.version.includes(version.toLowerCase()) : true;

            // Return assets that match both filters
            return archFilter && osFilter && versionFilter;
        });

        const displayData = arch === '' && os === '' && version === '' ? originalData : filtered;
        setDisplayData(displayData);
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
                <RotatingLines 
                    strokeColor="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="96"
                    visible={true}
                />
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
                        <OperatingSystems handle={handleOs} defaultOs={os}/>
                        <Architectures handle={handleArch} defaultArch={arch} />
                        <Version handle={handleVersion} defaultVersion={version} data={uniqueMinorVersions}/>
                    </Box>
                    <ReleasesTable rows={displayData} />
                </>
            )}
        </Box>
    )
}

export default DownloadsComponent;