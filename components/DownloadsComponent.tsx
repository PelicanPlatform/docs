"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { Box, CircularProgress } from '@mui/material';
import fetchFilteredReleases from "../utils/fetchReleases";
import { FilteredRelease } from '../utils/types';
import {OperatingSystems, Architectures} from './Filters';
import ReleasesTable from './ReleasesTable';
import data from '../public/static/releases-table-data.json';
import { DarkLightContainer } from '@/utils/darkLightContainer';
import { useTheme } from '@mui/material/styles';

const architectures = {
    "PowerPC": ["ppc64el", "ppc64le"],
    "ARM64": ["aarch64", "arm64"],
    "AMD64": ["amd64", "x86_64"]
};

const DownloadsComponent: React.FC = () => {
    const [originalData, setOriginalData] = useState<FilteredRelease[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOptions, setSelectedOptions] = React.useState({
        arch: 'PowerPC',
        os: 'linux',
    });
    
    const theme = useTheme();

    const handleArch = (
        event: React.MouseEvent<HTMLElement, MouseEvent>,
        newArch: string | null,
    ) => {
        if (newArch !== selectedOptions.arch) {
            setSelectedOptions(prevOptions => ({
                ...prevOptions,
                arch: newArch || ''
            }));
        }
    };

    const handleOs = (
        event: React.MouseEvent<HTMLElement, MouseEvent>,
        newOs: string | null,
    ) => {
        if (newOs !== selectedOptions.os) {
            setSelectedOptions(prevOptions => ({
                ...prevOptions,
                os: newOs || ''
            }));
        }
    };

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

    const filteredData = useMemo(() => {
        const architectureIdentifiers = selectedOptions.arch ? (architectures[selectedOptions.arch] || []) : [];
        // Now, filter assets within those releases based on the selected OS and Arch
        const releasesWithFilteredAssets = originalData.map(release => {
          const filteredAssets = release.assets.filter(asset => {
            const osMatch = !selectedOptions.os || asset.operatingSystem.toLowerCase().includes(selectedOptions.os.toLowerCase());
            const archMatch = !selectedOptions.arch || architectureIdentifiers.some(archIdentifier => asset.architecture.includes(archIdentifier));
      
            return osMatch && archMatch;
          })
          .sort((a, b) => {
            // Sort by file extension
            const extA = a.name.split('.').pop();
            const extB = b.name.split('.').pop();
            if (extA < extB) return -1;
            if (extA > extB) return 1;
      
            // If extensions are the same, sort by name
            return a.name.localeCompare(b.name);
          });
      
          // Return the release with the filtered assets
          return { ...release, assets: filteredAssets };
        }).filter(release => release.assets.length > 0); // Keep only releases with matching assets
      
        return releasesWithFilteredAssets;
      }, [selectedOptions.arch, selectedOptions.os, originalData]);
      

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
                        <OperatingSystems handle={handleOs} defaultOs={selectedOptions.os} defaultArch={selectedOptions.arch} data={data.operating_systems} />
                        <Architectures handle={handleArch} defaultArch={selectedOptions.arch} defaultOs={selectedOptions.os} archData={architectures} />
                    </Box>
                        {filteredData.map(release => (
                                    <ReleasesTable key={release.version} release={release} data={data.table_rows} />
                                ))
                        }
                </>
            );
        }
    };

    return (
        <DarkLightContainer>
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
        </DarkLightContainer>
    );
};

export default DownloadsComponent;
