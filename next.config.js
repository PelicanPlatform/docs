const fs = require('fs');
const path = require("path");
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
});

const config = (phase, { defaultConfig }) => {

  process.env.NODE_PATH = `${__dirname}/node_modules`

  // Set up the pages symlink to point at pelican repo identified by PELICAN_PATH
  fs.rmSync('./pages', { recursive: true, force: true })
  fs.symlink(
    path.resolve(process.env.PELICAN_PATH) + '/docs/pages',
      './pages',
    'dir',
    (err) => console.log(err)
  )

  // Set up the public symlink to point at pelican repo identified by PELICAN_PATH
  fs.rmSync('./public/pelican', { recursive: true, force: true })
  fs.symlink(
      path.resolve(process.env.PELICAN_PATH) + '/docs/public',
      './public/pelican',
      'dir',
      (err) => console.log(err)
  )

  return {
    ...withNextra(),
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
    images: {
      loader: "custom",
      imageSizes: [32, 64, 96, 256, 384],
      deviceSizes: [750, 1080, 1920, 2048, 3840],
    },
    transpilePackages: ["next-image-export-optimizer"],
    env: {
      nextImageExportOptimizer_imageFolderPath: "public",
      nextImageExportOptimizer_exportFolderPath: "out",
      nextImageExportOptimizer_quality: "100",
      nextImageExportOptimizer_storePicturesInWEBP: "true",
      nextImageExportOptimizer_exportFolderName: "nextImageExportOptimizer",

      // If you do not want to use blurry placeholder images, then you can set
      // nextImageExportOptimizer_generateAndUseBlurImages to false and pass
      // `placeholder="empty"` to all <ExportedImage> components.
      nextImageExportOptimizer_generateAndUseBlurImages: "true",
    }
  }
}

module.exports = config
