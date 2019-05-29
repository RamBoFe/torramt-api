import fs from 'fs';
import path from 'path';

export const importRoutes = (koaRouter, pathDir, ignored) => {
  const directory = [];

  fs.readdirSync(pathDir)
    .filter(file => ignored.includes(file) === false)
    .map(async (file) => {
      const fileNameWithoutExt = file.replace(/\.mjs|.js/, '');

      if (!fs.lstatSync(pathDir + '/' + file).isDirectory()) {
        let pathRelative = path.relative('./helpers', pathDir);
        pathRelative = path.join(pathRelative, fileNameWithoutExt).replace(/\\/g, '/');
        const { default: Route } = await import(pathRelative);
        const pathRootRoutes = pathRelative.replace(/\.+\/(\w+)\//, '');
        koaRouter.use(`/${pathRootRoutes}`, Route);
      } else {
        directory.push(pathDir + '/' + fileNameWithoutExt);
      }
    });

  directory.map( async (d) => {
    koaRouter = importRoutes(koaRouter, d, []);
  });

  return koaRouter;
};

export default importRoutes;
