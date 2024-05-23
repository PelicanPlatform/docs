export interface VersionProps {
    handle: (event: React.MouseEvent<HTMLElement, MouseEvent>, newAlignment: string) => void;
    defaultVersion: string;
    data: Array<string>;
  }
  
export interface ArchitecturesProps {
  handle: (event: React.MouseEvent<HTMLElement, MouseEvent>, newAlignment: string) => void;
  defaultArch: string;
  defaultOs: string;
  archs: string[];
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
prerelease: boolean;
assets: Asset[];
tag_name: string; // To determine the version of the release.
name: string;
}

export type FilteredRelease = {
version: string;
assets: FilteredAsset[];
prerelease: boolean;
}

export type FilteredAsset = {
name: string;
downloadUrl: string;
id: number;
assetVersion: string; // Version of the release this asset belongs to
specialPackage: "OSDF" | "Server" | ""; // Special package for OSDF/Pelican server
osInternal: string;
osDisplayed: string;
architecture: string;
packageInfo?: string;
packageDescription?: string;
}

export interface ReleasesTableProps {
    rowNames: Array<string>;
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

export interface CodeBlockProps {
  node: any;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface PreProps {
  children: React.ReactNode;
}

export const SemverRegex = /^v(\d+)\.(\d+)\.(\d+)$/;

export enum OSEnums {
  Linux = "Linux",
  macOS = "macOS",
  Windows = "Windows"
}

export enum ArchEnums {
  X86_64 = "X86_64",
  ARM64 = "ARM64",
  PowerPC = "PowerPC"
}

export const archMapping = {
  [ArchEnums.X86_64]: ["amd64", "x86_64"],
  [ArchEnums.ARM64]: ["aarch64", "arm64"],
  [ArchEnums.PowerPC]: ["ppc64el", "ppc64le"],
};

export const compatibilityRules = {
  [OSEnums.macOS]: [ArchEnums.ARM64, ArchEnums.X86_64],
  [OSEnums.Windows]: [ArchEnums.X86_64],
  [OSEnums.Linux]: [ArchEnums.PowerPC, ArchEnums.ARM64, ArchEnums.X86_64]
};

export const packageDisplayedOS = [
  {
    regex: ".*\\.apk$",
    os: "Alpine"
  },
  {
    regex: ".*\\.deb$",
    os: "Ubuntu"
  },
  {
    regex: ".*\\.rpm$",
    os: "RHEL"
  },
  {
    regex: ".*_Darwin_.*",
    os: "macOS"
  },
  {
    regex: ".*_Windows_.*",
    os: "Windows"
  },
  {
    regex: ".*_Linux_.*\\.tar\\.gz$",
    os: "Linux"
  }
]

export const parameterGroups = ["origin", "registry", "director", "client", "cache"];