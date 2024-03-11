import AbstractRoute from "../models/route.abstact.ts";

class UserRoute extends AbstractRoute {
  define(): void {
    this.router.get("/valid", (ctx) => {
      ctx.body = true;
    });
  }
}

const userRoute = new UserRoute("/user");
export default userRoute;
