"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { Box } from '@mui/material';
import { FilteredRelease, ArchEnums, OSEnums, SemverRegex, BinaryTypeEnums } from '../utils/types';
import { OperatingSystems, Architectures, Versions, BinaryTypes } from './Filters';
import ReleasesTable from './ReleasesTable';
import { useTheme } from '@mui/material/styles';
import { parseEnum } from '@/utils/utils';

interface optionMatrix {
    arch: ArchEnums | ""
    os: OSEnums | ""
    version: string
    binaryType: BinaryTypeEnums | ""
}

const downloadTableHeader = [
    "Version",
    "Architecture",
    "OS",
    "File",
    "Type"
]

interface DownloadsClientProps {
    // Releases resolved at build time by the server component; the first
    // entry is the newest and is the default selection.
    releases: FilteredRelease[]
}

const DownloadsClient: React.FC<DownloadsClientProps> = ({ releases }) => {
    const versions = useMemo(() => releases.map(release => release.version), [releases]);
    const [selectedOptions, setSelectedOptions] = useState<optionMatrix>({
        arch: "",
        os: "",
        version: releases[0]?.version ?? "",
        binaryType: "",
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

    const handleBinaryType = (
        event: React.MouseEvent<HTMLElement, MouseEvent>,
        newBinaryType: string | null,
    ) => {
        if (newBinaryType !== selectedOptions.binaryType) {
            setSelectedOptions(prevOptions => ({
                ...prevOptions,
                binaryType: newBinaryType as BinaryTypeEnums || ''
            }));
        }
    };

    // Query parameters override the defaults once we are in the browser.
    useEffect(() => {
      const params = new URLSearchParams(window?.location.search)
      const qVersion = params.get("version")
      const qArch = parseEnum(params.get("arch"), ArchEnums)
      const qOS = parseEnum(params.get("os"), OSEnums)
      const qBinaryType = parseEnum(params.get("binaryType"), BinaryTypeEnums)
      const queryMatrix: optionMatrix = {
        arch: qArch || '',
        os: qOS || '',
        version: SemverRegex.test(qVersion || "") && qVersion ? qVersion : "",
        binaryType: qBinaryType || "",
      }
      setSelectedOptions((prev) => (
        {
          arch: queryMatrix.arch ? queryMatrix.arch : prev.arch,
          os: queryMatrix.os ? queryMatrix.os : prev.os,
          version: queryMatrix.version ? queryMatrix.version : prev.version,
          binaryType: queryMatrix.binaryType ? queryMatrix.binaryType : prev.binaryType,
        }
      ))
    }, []);

    const filteredData = useMemo(() => {
        const selectedArch = selectedOptions.arch;
        const filteredByVersion = structuredClone(releases.filter((release) => release.version == selectedOptions.version)[0])
        if (!filteredByVersion) {
            return undefined
        }

        // Now, filter assets within those releases based on the selected OS and Arch
        const filteredAssets = filteredByVersion.assets.filter(asset => {
            const osMatch = !selectedOptions.os || asset.osInternal.toLowerCase().includes(selectedOptions.os.toLowerCase());
            const archMatch = !selectedArch || asset.architecture === selectedArch;
            const binaryTypeMatch = !selectedOptions.binaryType || asset.binaryType === selectedOptions.binaryType;

            return osMatch && archMatch && binaryTypeMatch;
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

      }, [selectedOptions, releases]);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '1em auto',
            overflow: 'auto',
            padding: theme.spacing(1),
        }}>
            {releases.length === 0 ? (
                <p>No release assets are available.</p>
            ) : (
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
                        <Versions handleChange={(e) => {setSelectedOptions((prev) => ({...prev, version: e.target.value}))}} versions={versions} value={selectedOptions.version}/>
                        <BinaryTypes handle={handleBinaryType} defaultBinaryType={selectedOptions.binaryType} />
                        <OperatingSystems handle={handleOs} defaultOs={selectedOptions.os} defaultArch={selectedOptions.arch} data={Object.values(OSEnums)} />
                        <Architectures handle={handleArch} defaultArch={selectedOptions.arch} defaultOs={selectedOptions.os} archs={Object.values(ArchEnums)} />
                    </Box>
                    {filteredData && <ReleasesTable key={filteredData.version} release={filteredData} rowNames={downloadTableHeader} />}
                </>
            )}
        </Box>
    );
};

export default DownloadsClient;
