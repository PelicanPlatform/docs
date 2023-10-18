const fs = require('fs');
const path = require("path");
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
});

const config = (phase, { defaultConfig }) => {

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
  }
}

module.exports = config
