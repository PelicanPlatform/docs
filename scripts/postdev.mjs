import fs from 'fs';

fs.rmSync('./app', { recursive: true, force: true });
fs.rmSync('./public/pelican', { recursive: true, force: true });
