import AbstractRoute from "../models/route.abstact.ts";
import transmissionSrv from "../services/transmission.service.ts";

class TransmissionRoute extends AbstractRoute {
  define(): void {
    this.root();
    this.get();
    this.start();
    this.stop();
    this.remove();
  }

  private root() {
    this.router.get("/", async (ctx) => {
      ctx.body = await transmissionSrv.list();
    });
  }

  private get() {
    this.router.get("/:hash", async (ctx) => {
      const { hash } = ctx.params;
      ctx.body = await transmissionSrv.get(hash.split(","));
    });
  }

  private start() {
    this.router.get("/start/:hash", async (ctx) => {
      const { hash } = ctx.params;
      ctx.body = await transmissionSrv.start(hash);
    });
  }

  private stop() {
    this.router.get("/stop/:hash", async (ctx) => {
      const { hash } = ctx.params;
      ctx.body = await transmissionSrv.stop(hash);
    });
  }

  private remove() {
    this.router.get("/remove/:hash", async (ctx) => {
      const { hash } = ctx.params;
      ctx.body = await transmissionSrv.remove(hash);
    });
  }
}

const transmissionRoute = new TransmissionRoute("/transmission");
export default transmissionRoute;
