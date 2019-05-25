import fs from 'fs';
import path from 'path';
import Router from 'koa-router';

const router = new Router();

const FILENAME = typeof __filename !== 'undefined' ? __filename
  : (/^ +at (?:file:\/*(?=\/)|)(.*?):\d+:\d+$/m.exec(Error().stack) || '')[1];
const CURRENT_FILE = path.basename(FILENAME);

fs.readdirSync('./routes')
  .filter(file => file !== CURRENT_FILE)
  .map(async (file) => {
    const fileNameWithoutExt = file.replace(/\.mjs|.js/, '');
    const { default: Route } = await import(`./${fileNameWithoutExt}`);
    router.use(`/${fileNameWithoutExt}`, Route);
  });

export default router.routes();
