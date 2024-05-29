import { Release, FilteredRelease, packageDisplayedOS, OSEnums, archMapping } from './types';

function getDisplayedOS(filename: string) {
  for (const rule of packageDisplayedOS) {
    const regex = new RegExp(rule.regex);
    if (regex.test(filename)) {
      return rule.os;
    }
  }
  return "Unknown";
}

function getArchitecture(filename: string) {
  for (const [arch, patterns] of Object.entries(archMapping)) {
    for (const pattern of patterns) {
      const regex = new RegExp(pattern, 'i'); // 'i' flag makes the regex case-insensitive
      if (regex.test(filename)) {
        return arch;
      }
    }
  }
  return "Unknown";
}


async function fetchFilteredReleases(): Promise<FilteredRelease[]> {
  const response = await fetch('https://api.github.com/repos/PelicanPlatform/pelican/releases');
  const releases: Release[] = await response.json();

  // Sort releases by version using semver sort (consider using a library for robust sorting)
  const sortedReleases = releases.sort((a, b) => b.tag_name.localeCompare(a.tag_name, undefined, {numeric: true, sensitivity: 'base'}));

  let filteredReleases: FilteredRelease[] = [];

  for (const release of sortedReleases) {
    // Ignore the release if it's a prerelease
    if (release.prerelease) {
      continue;
    }

    filteredReleases.push({
      version: release.tag_name,
      prerelease: release.prerelease,
      assets: release.assets.map(asset => {
        return {
          name: asset.name,
          downloadUrl: asset.browser_download_url,
          id: asset.id,
          assetVersion: release.tag_name,
          osInternal: asset.name.includes('checksums.txt') ? '' : asset.name.includes('Darwin') ? 'macOS' : Object.values(OSEnums).find(os => asset.name.includes(os)) || 'Linux',
          osDisplayed: getDisplayedOS(asset.name),
          architecture: getArchitecture(asset.name),
          specialPackage: asset.name.includes('-server-') ? "Server" : asset.name.includes('-osdf-') ? "OSDF" : ""
        };
      })
    });

  }

  return filteredReleases;
}

export default fetchFilteredReleases;
