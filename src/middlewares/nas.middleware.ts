import { RouterContext } from "koa-router";
import { UserInterface } from "../interfaces/user.interface.ts";
import { NasService } from "../services/nas.service.ts";

/**
 * Authentication middleware.
 *
 * @param ctx Router context
 * @param next Next middleware
 */
async function nasMiddleware(
  ctx: RouterContext,
  next: () => Promise<any>,
): Promise<void> {
  if (ctx.state.user) {
    const user: UserInterface = ctx.state.user;
    if (user && user.config) {
      const nas = user.config.nas;
      const nasSrv = new NasService({
        protocol: nas.protocol,
        host: nas.host,
        port: nas.port.toString(),
        account: nas.login,
        passwd: nas.password,
      });

      ctx.state = { ...ctx.state, nasSrv };
    }
  }

  await next();
}

export default nasMiddleware;
