import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: (
      <>
        <img alt="Pelican Icon" loading="lazy" width="36" height="36" decoding="async" data-nimg="1"
             src="/PelicanPlatformLogoIcon.svg"
        />
        <span className={"text-2xl ps-2"}>Pelican</span>
      </>
  ),
  docsRepositoryBase: "https://github.com/PelicanPlatform/pelican/tree/main/docs",
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Pelican Documentation',
    }},
  head: (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Pelican Documentation" />
        <meta property="og:description" content="Documentation for Pelican, software made to deliver." />
        <link rel="icon" type="image/x-icon" href="https://pelicanplatform.org/favicon.ico" />
        <link rel="stylesheet" type="text/css" href="/style.css"/>
        <script src="https://cdn.tailwindcss.com"></script>
      </>
  ),
  project: {
    link: 'https://github.com/PelicanPlatform/pelican',
  },
  footer: {
    text: 'Pelican Documentation',
  },
  
}

export default config
