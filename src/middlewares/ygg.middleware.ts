import { RouterContext } from "koa-router";
import { ProvidersEnum } from "../enums/providers.enum.ts";
import { UserInterface } from "../interfaces/user.interface.ts";
import torrentSrv from "../services/torrent.service.ts";

/**
 * Ygg middleware.
 *
 * @param ctx Router context
 * @param next Next middleware
 */
async function yggMiddleware(
  ctx: RouterContext,
  next: () => Promise<any>,
): Promise<void> {
  if (ctx.state.user) {
    const user: UserInterface = ctx.state.user;
    if (user && user.config) {
      const yggProvider = torrentSrv.getProvider(ProvidersEnum.YGGTORRENT);

      if (yggProvider) {
        yggProvider.username = user.config.ygg.login;
        yggProvider.password = user.config.ygg.password;
      }
    }
  }

  await next();
}

export default yggMiddleware;
