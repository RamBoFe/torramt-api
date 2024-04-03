import { RouterContext } from "koa-router";
import { NasService } from "../services/nas.service.ts";
import userSrv, { Token } from "../services/user.service.ts";

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
  const id = (ctx.state.token as Token).data!.uid;
  const user = await userSrv.getUser(id);
  if (user && user.config) {
    const nas = user.config.nas;
    const nasSrv = new NasService({
      protocol: nas.protocol,
      host: nas.host,
      port: nas.port.toString(),
      account: nas.login,
      passwd: nas.password,
    });

    ctx.state = { ...ctx.state, nasSrv, user };
  }

  await next();
}

export default nasMiddleware;
