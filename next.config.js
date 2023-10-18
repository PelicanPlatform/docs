const fs = require('fs');
const path = require("path");
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
});

const config = (phase, { defaultConfig }) => {

  // Set up the pages symlink to whatever pelican repo is desired
  fs.rmSync('./pages', { recursive: true, force: true })
  fs.symlink(
    process.env.PELICAN_PATH + '/docs/pages',
      './pages',
    'dir',
    (err) => console.log(err)
  )

  return withNextra();
}

module.exports = config
