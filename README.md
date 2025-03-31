# Pelican documentation

## How this repository is set up

To ease development of documentation this repository is the one-stop shop for creating new documentation. To do this 
it uses some symbolic linking both in the files and in git. 

The authoritative copy of the documentation lives in the pelican repo under the `/docs/pages` directory. This repository
uses git submodules to pull in the pelican repo and a symlink to link those pages to the correct location for the
documentation to be built. This means that when you change files in the pages directory you will need to commit those to 
the pelican repo, rather than the `docs` repo.

## Editing Documentation

This website uses [Nextra](https://nextra.site/) to build the documentation, it is suggested to look at their
[documentation](https://nextra.site/docs).

Some key documents that would be good to look through are:
- [Organize Files](https://nextra.site/docs/guide/organize-files)
- [Markdown](https://nextra.site/docs/guide/markdown)
- [Custom Doc Components](https://nextra.site/docs/guide/built-ins)

### Setup for local preview

You can run a build of the website on your local computer to see a live preview of the changes you make to the documentation.
To do so, you need access to `npm` and `node` (Node.js version >=14.15.0). 
You can install these packages on your computer. 
The simpler approach, however, is to launch a container with the required dependencies.

All (?) of the official Pelican containers come with the dependencies necessary to do a local build of the docs website.
(This has been tested, at least, for `hub.opensciencegrid.org/pelican_platform/pelican-dev:latest-itb`.)

Recommend the following sequence:

1. Clone the `pelican_platform/docs` repo:

   ```shell
   git clone https://github.com/pelican_platform/docs.git
   ```

2. Clone the main `pelican` repository:

   ```shell
   git clone https://github.com/pelican_platform/pelican.git
   ```

3. [Optional] Launch pelican container with necessary dependencies

   ```shell
   apptainer shell -e docker://hub.opensciencegrid.org/pelican_platform/pelican-dev:latest-itb
   ```

   or

   ```shell
   docker run -it --rm=true hub.opensciencegrid.org/pelican_platform/pelican-dev:latest-itb /bin/bash
   ```

### Launching the preview

First, move into the `docs` repository folder.

Before you can edit locally on your computer you must edit the `.env.local` file so that `PELICAN_PATH` points to your local
copy of the `pelican` repositry. This will allow the website builder to symlink in the appropriate files so that you can edit your 
finalize your documentation here, then commit the final product in your own repo.

If following the above recommended sequence, running the following command in the `docs` repository will make the necessary change:

```shell
echo "PELICAN_PATH=../pelican" > .env.local
```

> If your copy of the `pelican` repository is in a different location, change the path after `=`, either in the command above or using
> a text editor.

Next, install the dependencies of the website builder:

```shell
# Install appropriate node_modules
npm i
```

> This step will **FAIL** if the `.env.local` value of `PELICAN_PATH` is incorrect!

To launch the local website, run: 

```shell
# Run the dev server to see your documentation
npm run dev
```

If the command is successful, you'll see a bunch of output, including the message

```
  - Local:        http://localhost:3000
  - Environments: .env.local
```

The command will continue running, but you can open the link in the browser: [http://localhost:3000](http://localhost:3000). 
Once the website builder finishes building the website, the browser page will load with the live preview of the docs!

### Editing the docs

The pages used to render the documentation website are actually located in the main `pelican` repository, not the `docs` repository.
To make changes to the pages and see them in the live preview, you'll need to make the changes in the `pelican` repository.
The website builder will automatically update the live preview whenever a file is updated in the `/docs` section of the `pelican` repository.

When you are satisfied with your changes, make sure that you are making commits in the main `pelican` repository.

### Adding internal links

You can use relative or absolute links to reference other pages in the documentation.
Consider the following files:

```
/docs/pages/faq.mdx
/docs/pages/getting-started/accessing-data.mdx
```

To make a link in the `faq.mdx` file that references the `accessing-data.mdx` file (and corresponding webpage), either of the following will work:

```markdown
Here is a link to the [Accessing Data](./getting-started/accessing-data) guide using a relative reference.
*or*
Here is a link to the [Accessing Data](/getting-started/accessing-data) guide using an absolute reference.
```

Note that the root of the absolute reference is `/docs/pages`, so you should not include `/docs/pages` in the absolute reference.

### Adding Images

All images should be added to the `/public` folder. You can add them into the documentation by using the markdown image
syntax. All the images are served from website root so make sure not to let the image paths collide with the website. 

```markdown
![Image Description](/image-path)
```

## Recipes

Below is a list of all the components available to use in your markdown. Let Cannon know if you want access to any
others.

### ImageRow

![ImageRow View](.github/images/ImageRow.png)

```jsx
// At the top of your markdown file
import ImageRow from "@/components/ImageRow";

// Whereever you want a row with image on the left 50% with text on the right 50%
<ImageRow alt={"Pelican and OSDF"} src={"/pelican/pelican-and-osdf.png"}>
	A Pelican data federation provides an access layer that helps the origin
	distribute datasets in the repositories.  A client wanting an object contacts
	the manager to find the closest cache which either serves the objects from
	local storage or streams it through the origin.
</ImageRow>
```
