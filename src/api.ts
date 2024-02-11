import cors from "@koa/cors";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import authMiddleware from "./middlewares/auth.middleware.ts";
import { errorMiddleware } from "./middlewares/error.middleware.ts";
import environment from "./services/environment.service.ts";
import routeSrv from "./services/route.service.ts";

export default class Api {
  static init(): void {
    const app = new Koa();

    app.use(cors());
    app.use(bodyParser());
    app.use(errorMiddleware);
    app.use(authMiddleware);
    app.use(routeSrv.getRoutes());

    app.listen(environment.get("node:port"), async () => {
      console.log(
        `Api Torrant listening on http://${environment.get(
          "node:domain",
        )}:${environment.get("node:port")}`,
      );
    });
  }
}

Api.init();
