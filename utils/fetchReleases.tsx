export interface Asset {
  name: string;
  browser_download_url: string;
  id: number;
}

export interface Release {
  assets: Asset[];
  tag_name: string; // To determine the version of the release.
  name: string;
}

export type FilteredRelease = {
  version: string;
  assets: FilteredAsset[];
}

export type FilteredAsset = {
  name: string;
  downloadUrl: string;
  id: number;
  assetVersion: string; // Version of the release this asset belongs to
  operatingSystem: string;
  architecture: string;
}


const operatingSystems = ['Darwin', 'Linux', 'Windows'];
const architectures = ['arm64', 'amd64', 'ppc64le', 'ppc64el', 'x86_64', 'aarch64'];

async function fetchFilteredReleases(): Promise<FilteredRelease[]> {
  const response = await fetch('https://api.github.com/repos/PelicanPlatform/pelican/releases');
  const releases: Release[] = await response.json();

  // Sort releases by version using semver sort (consider using a library for robust sorting)
  const sortedReleases = releases.sort((a, b) => b.tag_name.localeCompare(a.tag_name, undefined, {numeric: true, sensitivity: 'base'}));

  // Extract major versions and find the latest minor for each
  let majorVersions = new Set<string>();
  let filteredReleases: FilteredRelease[] = [];

  for (const release of sortedReleases) {
    const [major, minor] = release.tag_name.replace('v', '').split('.').map(Number);
    const majorVersion = `${major}.${minor}`;

    if (majorVersions.size < 4 && !majorVersions.has(majorVersion)) {
      majorVersions.add(majorVersion);

      filteredReleases.push({
        version: release.tag_name,
        assets: release.assets.map(asset => ({
          name: asset.name,
          downloadUrl: asset.browser_download_url,
          id: asset.id,
          assetVersion: release.tag_name,
          operatingSystem: asset.name.includes('checksums.txt') ? '' : operatingSystems.find(os => asset.name.includes(os)) || 'Linux',
          architecture: asset.name.includes('checksums.txt') ? '' : architectures.find(arch => asset.name.includes(arch)) || 'unknown',
        }))
      });
    }
  }

  return filteredReleases;
}

export default fetchFilteredReleases;
