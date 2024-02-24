import { RouterContext } from "koa-router";
import HealthRoute from "../routes/health.route.ts";
import userSrv from "../services/user.service.ts";

/**
 * Authentication middleware.
 *
 * @param ctx Router context
 * @param next Nex middleware
 */
async function authMiddleware(
  ctx: RouterContext,
  next: () => Promise<any>,
): Promise<void> {
  if (HealthRoute.rootPath !== "/health") {
    const token = ctx.headers.authorization.replace("Bearer", "").trim();
    const isUserAuthorized = await userSrv.isAuthorized(token);

    if (!isUserAuthorized) {
      throw new Error("Vous n'êtes pas autorisé à accéder à cette ressource.");
    }
  }

  await next();
}

export default authMiddleware;
