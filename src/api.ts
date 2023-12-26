import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";

// import environment from "../services/environment.service";
// import yggSrv from "./torrent-providers/yggtorrent.provider";
// import torrentSrv from "../services/torrent.service";

import routeSrv from "./services/route.service.ts";
import environment from "./services/environment.service.ts";

export default class Api {
  static init(): void {
    const app = new Koa();

    app.use(cors());
    app.use(bodyParser());
    console.log(routeSrv.getRoutes());
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
