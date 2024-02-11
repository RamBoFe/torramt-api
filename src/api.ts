import cors from "@koa/cors";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import environment from "./services/environment.service.ts";
import firebaseSrv from "./services/firebase.service.ts";
import routeSrv from "./services/route.service.ts";

export default class Api {
  static init(): void {
    const app = new Koa();

    app.use(cors());
    app.use(bodyParser());
    app.use(routeSrv.getRoutes());
    const ok = firebaseSrv;
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
