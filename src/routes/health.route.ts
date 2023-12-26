import AbstractRoute from "../models/route.abstact.ts";

class HealthRoute extends AbstractRoute {
  define(): void {
    this.router.get("/", (ctx) => {
      ctx.body = "ok";
    });
  }
}

const healthRoute = new HealthRoute("/health");
export default healthRoute;
