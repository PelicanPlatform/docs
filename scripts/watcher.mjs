import path from "path";
import fs from "fs";

import { setup } from "./setup.mjs";

const app_dir = path.resolve(process.env.PELICAN_PATH) + '/docs/app'
const public_dir = path.resolve(process.env.PELICAN_PATH) + '/docs/public'

const updateFiles = (file) => {
	if (file.startsWith('app/')) {
		const relPath = file.replace('app/', '');
		const src = path.join(app_dir, relPath);
		const dest = path.join('./app', relPath);
		try {
			if (fs.existsSync(src)) {
				const stat = fs.statSync(src);
				if (stat.isDirectory()) {
					fs.cpSync(src, dest, { recursive: true });
					console.log(`Directory ${file} updated.`);
				} else {
					fs.copyFileSync(src, dest);
					console.log(`File ${file} updated.`);
				}
			} else {
				console.warn(`Source ${src} does not exist.`);
			}
		} catch (err) {
			console.error(`Error updating ${file}:`, err);
		}
	} else if (file.startsWith('public/pelican/')) {
		const relPath = file.replace('public/pelican/', '');
		const src = path.join(public_dir, relPath);
		const dest = path.join('./public/pelican', relPath);
		try {
			if (fs.existsSync(src)) {
				const stat = fs.statSync(src);
				if (stat.isDirectory()) {
					fs.cpSync(src, dest, { recursive: true });
					console.log(`Directory ${file} updated.`);
				} else {
					fs.copyFileSync(src, dest);
					console.log(`File ${file} updated.`);
				}
			} else {
				console.warn(`Source ${src} does not exist.`);
			}
		} catch (err) {
			console.error(`Error updating ${file}:`, err);
		}
	}
}

const startWatchers = () => {
	fs.watch(app_dir, { recursive: true }, (eventType, filename) => {
		if (filename) {
			updateFiles(`app/${filename}`);
		}
	})

	fs.watch(public_dir, { recursive: true }, (eventType, filename) => {
		if (filename) {
			updateFiles(`public/pelican/${filename}`);
		}
	})
}

const main = () => {
	console.log("Starting watcher...");

	setup();
	startWatchers();
}

main()
