import { RouterContext } from "koa-router";
import userSrv, { Token } from "../services/user.service.ts";

/**
 * User middleware.
 *
 * @param ctx Router context
 * @param next Next middleware
 */
async function userMiddleware(
  ctx: RouterContext,
  next: () => Promise<any>,
): Promise<void> {
  if (ctx.state.token) {
    const id = (ctx.state.token as Token).data!.uid;
    const user = await userSrv.getUser(id);
    if (user) {
      ctx.state = { ...ctx.state, user };
    }
  }

  await next();
}

export default userMiddleware;
