import fs from 'fs';
import path from 'path';

const app_dir = path.resolve(process.env.PELICAN_PATH) + '/docs/app'
const public_dir = path.resolve(process.env.PELICAN_PATH) + '/docs/public'

// Copy over the dir contents from the pelican repo to the app directory
// Set up the pages symlink to point at pelican repo identified by PELICAN_PATH
fs.rmSync('./app', { recursive: true, force: true });
fs.cpSync(
		app_dir,
		'./app',
		{recursive: true},
		(err) => console.log(err)
);

// Watch for changes in the pages directory and copy them over to the app directory
fs.watch(app_dir, { recursive: true }, (eventType, filename) => {
	if (filename) {
		const srcPath = path.join(app_dir, filename);
		const destPath = path.join('./app', filename);
		if (eventType === 'change' || eventType === 'rename') {
			fs.copyFile(srcPath, destPath, (err) => {
				if (err) console.error(`Error copying file: ${err}`);
				else console.log(`Copied ${filename} to app directory`);
			});
		}
	}
})

// Copy over the dir contents from the pelican repo to the public directory
// Set up the public symlink to point at pelican repo identified by PELICAN_PATH
fs.rmSync('./public/pelican', { recursive: true, force: true });
fs.cpSync(
		public_dir,
		'./public/pelican',
		{recursive: true},
		(err) => console.log(err)
);


// Watch for changes in the public directory and copy them over to the public/pelican directory
fs.watch(public_dir, { recursive: true }, (eventType, filename) => {
	if (filename) {
		const srcPath = path.join(public_dir, filename);
		const destPath = path.join('./public/pelican', filename);
		if (eventType === 'change' || eventType === 'rename') {
			fs.copyFile(srcPath, destPath, (err) => {
				if (err) console.error(`Error copying file: ${err}`);
				else console.log(`Copied ${filename} to public/pelican directory`);
			});
		}
	}
})