import nextra from 'nextra'

const config = async (phase, { defaultConfig }) => {
  const withNextra = nextra({});
  return {
    ...withNextra(),
		basePath: process.env.BASE_PATH || '',
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
      nextImageExportOptimizer_exportFolderName: "optimized_images",
      nextImageExportOptimizer_generateAndUseBlurImages: "true",
    }
  }
};

export default config;
