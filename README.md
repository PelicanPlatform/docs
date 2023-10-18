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

### Adding Images

All images should be added to the `/public` folder. You can add them into the documentation by using the markdown image
syntax. All the images are served from website root so make sure not to let the image paths collide with the website. 

```markdown
![Image Description](/image-path)
```

## Example 

Let's say that I want to add some documentation for some website changes I just made. 

