"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import fetchFilteredReleases, { FilteredRelease } from "../utils/fetchReleases"; // Update this import based on actual file structure
import {OperatingSystems, Architectures, Version} from './Filters'; // Ensure these imports are correctly structured
import ReleasesTable from './ReleasesTable';
import data from '../public/static/releases-table-data.json';

const DownloadsComponent: React.FC = () => {
    const [originalData, setOriginalData] = useState<FilteredRelease[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [arch, setArch] = React.useState<string>('x86_64');
    const [os, setOs] = React.useState<string>('linux'); 
    const [version, setVersion] = React.useState<string>('v7.5');

    const theme = useTheme();

    const handleArch = (
        event: React.MouseEvent<HTMLElement, MouseEvent>,
        newArch: string | null,
    ) => {
        if (newArch !== arch) {
            setArch(newArch || '');
            } else {
            setArch('');
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
        if (newVersion) {
        setVersion(newVersion);
        }
    }

    useEffect(() => {
        const fetchAssets = async () => {
            setLoading(true);
            try {
                const releases = await fetchFilteredReleases(); // This function should return an array of FilteredRelease
                setOriginalData(releases);
                console.log(releases);
            } catch (e) {
                setError('Failed to fetch release assets');
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchAssets();
    }, []);

    const uniqueVersions = useMemo<string[]>(() => {
        const unique = new Set<string>();
        originalData.forEach(release => {
            unique.add(release.version.split('.').slice(0, 2).join('.')); // Only major.minor
        });
        return Array.from(unique);
    }, [originalData]);

    const filteredData = useMemo(() => {
        // Filter releases based on the selected version
        const filteredReleases = originalData.filter(release => 
          version ? release.version.startsWith(version) : true
        );
      
        // Now, filter assets within those releases based on the selected OS and Arch
        const releasesWithFilteredAssets = filteredReleases.map(release => {
          const filteredAssets = release.assets.filter(asset => {
            const osMatch = !os || asset.operatingSystem.toLowerCase().includes(os.toLowerCase());
            const archMatch = !arch || asset.architecture.includes(arch) || 
                              (arch === 'PPC64' && (asset.architecture.includes('ppc64el') || asset.architecture.includes('ppc64le')));
      
            return osMatch && archMatch;
          });
      
          // Return the release with the filtered assets
          return { ...release, assets: filteredAssets };
        }).filter(release => release.assets.length > 0); // Keep only releases with matching assets
      
        return releasesWithFilteredAssets;
      }, [arch, os, version, originalData]);
      

    const renderContent = () => {
        if (loading) {
            return <CircularProgress />;
        } else if (error) {
            return <p>{error}</p>;
        } else {
            return (
                <>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        margin: theme.spacing(1),
                        [theme.breakpoints.down('sm')]: {
                            flexDirection: 'column',
                        },
                    }}>
                        <OperatingSystems handle={handleOs} defaultOs={os} data={data.operating_systems} />
                        <Architectures handle={handleArch} defaultArch={arch} data={data.architectures} />
                        <Version handle={handleVersion} defaultVersion={version} data={uniqueVersions} />
                    </Box>
                    {filteredData.map(release => (
                        <ReleasesTable key={release.version} release={release} data={data.table_rows} /> // Assuming data.table_headers is correct
                    ))}
                </>
            );
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '1em auto',
            overflow: 'auto',
            [theme.breakpoints.down('md')]: {
                padding: theme.spacing(2),
            },
        }}>
            {renderContent()}
        </Box>
    );
};

export default DownloadsComponent;
