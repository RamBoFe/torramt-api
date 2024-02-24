import { RouterContext } from "koa-router";
import { ErrorCodeEnum } from "../enums/error-code.enum";

/**
 * Errors middleware.
 *
 * @param ctx Router context
 * @param next Nex middleware
 */
export async function errorMiddleware(
  ctx: RouterContext,
  next: () => Promise<any>,
): Promise<void> {
  try {
    await next();
  } catch (err) {
    ctx.status = Object.values(ErrorCodeEnum).includes(err.code) ? 401 : 500;
    ctx.body = err;
  }
}
