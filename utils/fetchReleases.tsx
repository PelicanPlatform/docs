// Typescript interfaces
export interface Asset {
    name: string;
    browser_download_url: string;
    id: number;
    // Add more properties as needed from the GitHub API response
  }
  
  export interface Release {
    assets: Asset[];
    // Add more properties as needed from the GitHub API response
  }
  
  export type FilteredAsset = {
    version: string;
    operatingSystem: string;
    architecture: string;
    packageType: string;
    downloadUrl: string;
    id: number;
  };

  const operatingSystems = ['Darwin', 'Linux', 'Windows'];
  const architectures = ['arm64', 'amd64', 'ppc64le', 'ppc64el', 'x86_64', "aarch64"];
  const packageTypes = ['tar.gz', 'zip', 'deb', 'apk', 'rpm'];

  let allFilteredAssets: FilteredAsset[] = [];

// Next.js API route or page method
async function fetchAllReleaseAssets(): Promise<FilteredAsset[]> {
  const response = await fetch('https://api.github.com/repos/PelicanPlatform/pelican/releases');
  const releases: Release[] = await response.json();

  let allFilteredAssets: FilteredAsset[] = [];

  for (const release of releases) {
    const filteredAssets: FilteredAsset[] = release.assets
      .filter(asset => asset.name.startsWith('pelican'))
      .map(asset => {
        // Extract the version from the URL
        const versionMatch = asset.browser_download_url.match(/\/releases\/download\/(v[\d.]+)/);
        let version = versionMatch ? versionMatch[1] : 'unknown';

        // Special formatting for versions from assets with "pelican-osdf" in the name
        if (asset.name.includes("pelican-osdf")) {
        version += " - OSDF"; // Append " - OSDF" to the version string
      }
  
        // Determine the operating system from the URL or filename
        const operatingSystem = operatingSystems.find(os => asset.browser_download_url.includes(os)) || 'Linux';
  
        // Determine the architecture from the filename
        const architecture = architectures.find(arch => asset.name.includes(arch)) || 'unknown';
  
        // Determine the package type from the filename
        const packageType = packageTypes.find(type => asset.name.includes(type)) || 'unknown';
  
        return {
          version,
          operatingSystem,
          architecture,
          packageType,
          downloadUrl: asset.browser_download_url,
          id: asset.id
        };
      });
    
    allFilteredAssets = allFilteredAssets.concat(filteredAssets);
  }

  return allFilteredAssets;
}

  
  export default fetchAllReleaseAssets;