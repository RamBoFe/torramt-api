import Router from "koa-router";

export default abstract class AbstractRoute {
  protected router = new Router();
  rootPath: string;

  constructor(rootPath: string) {
    this.rootPath = rootPath;
    this.define();
  }

  abstract define(): void;

  getRoutes() {
    return this.router.routes();
  }
}
