import path from "path";
import fs from "fs";

const app_dir = path.resolve(process.env.PELICAN_PATH) + '/docs/app'
const public_dir = path.resolve(process.env.PELICAN_PATH) + '/docs/public'

export const setup = () => {
	// Copy over the dir contents from the pelican repo to the app directory
	// Set up the pages symlink to point at pelican repo identified by PELICAN_PATH
	fs.rmSync('./app', { recursive: true, force: true });
	fs.cpSync(
			app_dir,
			'./app',
			{recursive: true},
			(err) => console.log(err)
	);

	// Copy over the dir contents from the pelican repo to the public directory
	// Set up the public symlink to point at pelican repo identified by PELICAN_PATH
	fs.rmSync('./public/pelican', { recursive: true, force: true });
	fs.cpSync(
			public_dir,
			'./public/pelican',
			{recursive: true},
			(err) => console.log(err)
	);
}

setup()
