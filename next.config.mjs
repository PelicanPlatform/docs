import nextra from 'nextra'

const config = async (phase, { defaultConfig }) => {
  const withNextra = nextra({});
  return {
    ...withNextra(),
    output: 'export',
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      loader: "custom",
      imageSizes: [32, 96, 384],
      deviceSizes: [750, 1080, 1920],
    },
    transpilePackages: ["next-image-export-optimizer"],
    env: {
      nextImageExportOptimizer_imageFolderPath: "public",
      nextImageExportOptimizer_exportFolderPath: "out",
      nextImageExportOptimizer_quality: "75",
      nextImageExportOptimizer_storePicturesInWEBP: "true",
      nextImageExportOptimizer_exportFolderName: "nextImageExportOptimizer",
      nextImageExportOptimizer_generateAndUseBlurImages: "true",
    }
  }
};

export default config;
