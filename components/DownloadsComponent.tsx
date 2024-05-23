"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { Box, CircularProgress, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import fetchFilteredReleases from "../utils/fetchReleases";
import { FilteredRelease, ArchEnums, OSEnums, SemverRegex } from '../utils/types';
import {OperatingSystems, Architectures} from './Filters';
import ReleasesTable from './ReleasesTable';
import data from '../public/static/releases-table-data.json';
import { DarkLightContainer } from '@/utils/darkLightContainer';
import { useTheme } from '@mui/material/styles';
import { parseEnum } from '@/utils/utils';

interface optionMatrix {
    arch: ArchEnums | ""
    os: OSEnums | ""
    version: string
}

const DownloadsComponent: React.FC = () => {
    const [originalData, setOriginalData] = useState<FilteredRelease[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [versions, setVersions] = useState([])
    const [selectedOptions, setSelectedOptions] = useState<optionMatrix>({
        arch: ArchEnums.X86_64,
        os: OSEnums.Linux,
        version: ""
    });
    
    const theme = useTheme();

    const handleArch = (
        event: React.MouseEvent<HTMLElement, MouseEvent>,
        newArch: string | null,
    ) => {
        if (newArch !== selectedOptions.arch) {
            setSelectedOptions(prevOptions => ({
                ...prevOptions,
                arch: newArch as ArchEnums || ''
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
                os: newOs as OSEnums || ''
            }));
        }
    };

    useEffect(() => {
        const fetchAssets = async () => {
            setLoading(true);
            try {
                const releases = await fetchFilteredReleases(); // This function should return an array of FilteredRelease
                setOriginalData(releases);
                setSelectedOptions((prev) => ({...prev, version: prev.version ? prev.version : releases[0].version}))
                setVersions(releases.map(release => release.version).filter(version => version >= "v7.6.5"))
            } catch (e) {
                setError('Failed to fetch release assets');
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        const params = new URLSearchParams(window?.location.search)
        const qVersion = params.get("version")
        const qArch = parseEnum(params.get("arch"), ArchEnums)
        const qOS = parseEnum(params.get("os"), OSEnums)
        const queryMatrix: optionMatrix = {
            arch: qArch || '',
            os: qOS || '',
            version: SemverRegex.test(qVersion) ? qVersion : ""
        }
        setSelectedOptions((prev) => (
            {
                arch: queryMatrix.arch ? queryMatrix.arch : prev.arch,
                os: queryMatrix.os ? queryMatrix.os : prev.os,
                version: queryMatrix.version ? queryMatrix.version : prev.version,
            }
        ))

        fetchAssets();
    }, []);
    

    const filteredData = useMemo(() => {
        console.log("update with", selectedOptions)
        const selectedArch = selectedOptions.arch;
        const filteredByVersion = structuredClone(originalData.filter((release) => release.version == selectedOptions.version)[0])
        if (!filteredByVersion) {
            return undefined
        }
        
        // Now, filter assets within those releases based on the selected OS and Arch
        const filteredAssets = filteredByVersion.assets.filter(asset => {
            const osMatch = !selectedOptions.os || asset.osInternal.toLowerCase().includes(selectedOptions.os.toLowerCase());
            const archMatch = !selectedArch || asset.architecture === selectedArch;
      
            return osMatch && archMatch;
          })
          .sort((a, b) => {
            // Sort by OS
            const byOS = a.osDisplayed.localeCompare(b.osDisplayed)
            if (byOS === 0) {
                if (a.specialPackage && b.specialPackage) {
                    return a.name.localeCompare(b.name)
                } else if (a.specialPackage && !b.specialPackage) {
                    return 1
                } else {
                    return -1
                }
            } else {
                return byOS
            }
          });
                
        filteredByVersion.assets = filteredAssets
        return filteredByVersion;

      }, [selectedOptions, originalData]);
      

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
                        [theme.breakpoints.down('sm')]: {
                            flexDirection: 'column',
                        },
                    }}>
                        <Box sx={{ display: "flex", flexDirection:"column", alignItems:"center", margin: "0 20px 0 0"}}>
                            <Typography variant="overline" display="block" gutterBottom>Version</Typography>
                            <Select size='small' aria-label='Version Selection' value={selectedOptions.version} onChange={(event: SelectChangeEvent) => {
                                setSelectedOptions((prev) => ({...prev, version: event.target.value}))
                            }}>
                                {versions.map((version) => {
                                    return (
                                        <MenuItem key={version} value={version}>{version}</MenuItem>
                                    )
                                })}
                            </Select>
                        </Box>
                        <OperatingSystems handle={handleOs} defaultOs={selectedOptions.os} defaultArch={selectedOptions.arch} data={Object.values(OSEnums)} />
                        <Architectures handle={handleArch} defaultArch={selectedOptions.arch} defaultOs={selectedOptions.os} archs={Object.values(ArchEnums)} />
                    </Box>
                    {filteredData && <ReleasesTable key={filteredData.version} release={filteredData} rowNames={data.table_rows} />}
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
            padding: theme.spacing(1),
        }}>
            {renderContent()}
        </Box>
        </DarkLightContainer>
    );
};

export default DownloadsComponent;
