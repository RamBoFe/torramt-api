import fs from "fs";
import path from "path";
import Router from "koa-router";
import AbstractRoute from "../models/route.abstact";

class RouteService {
  path: string;
  pathRoot: string;
  ignoredFolders: string[];
  router = new Router();

  constructor(router: Router, pathRoot: string, ignoredFolders: string[]) {
    this.router = router;
    this.pathRoot = pathRoot;
    this.ignoredFolders = ignoredFolders;
  }

  static async build(
    pathRoot = "src/routes",
    ignoredFolders = ["@eaDir"],
  ): Promise<RouteService> {
    const router = await this.load(pathRoot, ignoredFolders);
    return new RouteService(router, pathRoot, ignoredFolders);
  }

  private static async load(
    pathRoot: string,
    ignoredFolders: string[],
  ): Promise<Router> {
    const router = new Router();
    const load = async (pathRoot, ignoredFolders) => {
      const folders: string[] = [];
      const files = fs
        .readdirSync(pathRoot)
        .filter((content) => !ignoredFolders.includes(content));

      for (const file of files) {
        const pathFile = `${pathRoot}/${file}`;
        if (!fs.lstatSync(pathFile).isDirectory()) {
          let pathFileRoutes = path.relative("src/services", pathRoot);

          pathFileRoutes = path.join(pathFileRoutes, file).replace(/\\/g, "/");

          let { default: route } = await import(pathFileRoutes);

          route = route as AbstractRoute;
          router.use(route.rootPath, route.getRoutes());
        } else {
          folders.push(pathFile);
        }
      }

      await folders.forEach((folder) => load(folder, ignoredFolders));
    };

    await load(pathRoot, ignoredFolders);

    return router;
  }

  getRoutes(): Router.IMiddleware {
    return this.router.routes();
  }
}

const routeSrv = await RouteService.build();
export default routeSrv;
