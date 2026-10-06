import React from 'react';
import fetchFilteredReleases from "../utils/fetchReleases";
import DownloadsClient from './DownloadsClient';

// Server component: the release list is fetched from GitHub once, at build
// time, and handed to the client component fully resolved, so the page
// renders the table immediately with no loading state.
const DownloadsComponent = async () => {
    const releases = await fetchFilteredReleases();
    return <DownloadsClient releases={releases} />;
};

export default DownloadsComponent;
