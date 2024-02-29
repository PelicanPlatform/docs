export interface VersionProps {
    handle: (event: React.MouseEvent<HTMLElement, MouseEvent>, newAlignment: string) => void;
    defaultVersion: string;
    data: Array<string>;
  }
  
export interface ArchitecturesProps {
    handle: (event: React.MouseEvent<HTMLElement, MouseEvent>, newAlignment: string) => void;
    defaultArch: string;
    defaultOs: string;
    data: Array<string>;
  }
  
export interface OperatingSystemsProps {
    handle: (event: React.MouseEvent<HTMLElement, MouseEvent>, newAlignment: string) => void;
    defaultOs: string;
    defaultArch: string;
    data: Array<string>;
  }

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
packageInfo?: string;
packageDescription?: string;
}

export interface ReleasesTableProps {
    data: Array<string>;
    release: FilteredRelease;
}

export interface ParameterDetail {
	components: string[];
	default: boolean | string;
	description: string;
	name: string;
	type: string;
  }
  
export interface Parameter {
	[key: string]: ParameterDetail;
  }
  
export type ParametersArray = Parameter[];

export const operatingSystems = ['Darwin', 'Linux', 'Windows'];

export const architectures = ['arm64', 'amd64', 'ppc64le', 'ppc64el', 'x86_64', 'aarch64'];

export const packageType = {
    "rpm": "You want to install a .rpm package if you are using a Red Hat-based Linux distribution system such as: Red Hat Enterprise Linux, CentOS, Fedora, or openSUSE."
    , "apk": "You want to install a .apk package if you are using an Alpine Linux system."
    , "deb": "You want to install a .deb package if you are using a Linux distribution system such as: Debian, Ubuntu, or something similar."
    , "zip": "If you want a more manual setup, you can download the .zip files and extract the binary where you need it."
    , "tar.gz": "If you want a more manual setup, you can download the .tar.gz files and extract the binary where you need it."
    , "osdf": "Install this package if you want more convenient access to OSDF, including the stashcp program and the HTCondor file transfer plugin for osdf:// URLs"
    , "txt": "Download this file to verify the correctness of your other downloads."
};

export const compatibilityRules = {
    "darwin": ["arm64", "x86_64"],
    "windows": ["x86_64"],
    "linux": ["arm64", "amd64", "ppc64", "x86_64", "aarch64"]
};

export const parameterGroups = ["origin", "nsregistry", "director", "client"];