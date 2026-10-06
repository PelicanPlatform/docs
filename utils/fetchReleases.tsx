import semver from 'semver'
import { Release, FilteredRelease, packageDisplayedOS, OSEnums, archMapping, BinaryTypeEnums, PackageType } from './types';
import {getAllGithub} from "@/utils/utils";

const ServerAddonNote = "This package adds the Pelican origin/cache server dependencies on top of the Pelican client package. Download it if you want to serve a Pelican origin or cache. The Pelican client package must be installed first.";
const ServerStandaloneNote = "This is the standalone pelican-server binary. Download it if you want to run an Origin, Cache, Director, or Registry. It does not require the Pelican client package.";

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
  const releases = await getAllGithub<Release>('https://api.github.com/repos/PelicanPlatform/pelican/releases');

  // Sort releases by version using semver sort (consider using a library for robust sorting)
  const sortedReleases = releases.sort((a, b) => b.tag_name.localeCompare(a.tag_name, undefined, {numeric: true, sensitivity: 'base'}));

  let filteredReleases: FilteredRelease[] = [];
  let includedMinorReleases: Set<string> = new Set();

  for (const release of sortedReleases) {
    // Ignore the release if it's a prerelease
    if (release.prerelease) {
      continue;
    }

    // Ignore the release if it's a minor release that we've already included
    const minorVersion = semver.major(release.tag_name) + semver.minor(release.tag_name);
    if (includedMinorReleases.has(minorVersion)) {
      continue;
    }

    // Add the minor version to the set of included minor releases
    includedMinorReleases.add(minorVersion);

    // Before v7.26.0 pelican-server was an add-on package layered on top of
    // the pelican client package; from v7.26.0 it is a standalone binary.
    // The chip reads "Server" either way; only the explanation differs.
    const serverIsAddon = semver.lt(release.tag_name, 'v7.26.0');

    filteredReleases.push({
      version: release.tag_name,
      prerelease: release.prerelease,
      assets: release.assets.map(asset => {
        const isServer = /^pelican-server[_-]/.test(asset.name);
        const specialPackage: PackageType = asset.name.includes('-osdf-') ? "OSDF"
          : isServer ? "Server"
          : "Client";
        return {
          name: asset.name,
          downloadUrl: asset.browser_download_url,
          id: asset.id,
          assetVersion: release.tag_name,
          osInternal: asset.name.includes('checksums.txt') ? '' : asset.name.includes('Darwin') ? 'macOS' : Object.values(OSEnums).find(os => asset.name.includes(os)) || 'Linux',
          osDisplayed: getDisplayedOS(asset.name),
          architecture: getArchitecture(asset.name),
          specialPackage,
          packageDescription: isServer ? (serverIsAddon ? ServerAddonNote : ServerStandaloneNote) : undefined,
          binaryType: isServer ? BinaryTypeEnums.Server : BinaryTypeEnums.Client
        };
      })
    });
  }



  return filteredReleases;
}

export default fetchFilteredReleases;
