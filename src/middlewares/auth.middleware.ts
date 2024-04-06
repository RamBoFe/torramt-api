import { RouterContext } from "koa-router";
import { ErrorCodeEnum } from "../enums/error-code.enum.ts";
import FtpRoute from "../routes/ftp.route.ts";
import HealthRoute from "../routes/health.route.ts";
import NasRoute from "../routes/nas.route.ts";
import userSrv from "../services/user.service.ts";

/**
 * Authentication middleware.
 *
 * @param ctx Router context
 * @param next Next middleware
 */
async function authMiddleware(
  ctx: RouterContext,
  next: () => Promise<any>,
): Promise<void> {
  if (HealthRoute.rootPath !== ctx.url) {
    const tokenString = ctx.headers.authorization?.replace("Bearer", "").trim();
    const token = await userSrv.checkToken(tokenString ?? "");

    if (!token.valid) {
      throw {
        code: ErrorCodeEnum.UNAUTHORIZED,
        message: "Vous n'êtes pas autorisé à accéder à cette ressource.",
      };
    }

    if (
      ctx.url.startsWith(NasRoute.rootPath) ||
      ctx.url.startsWith(FtpRoute.rootPath)
    ) {
      ctx.state = {
        token,
      };
    }
  }

  await next();
}

export default authMiddleware;
