import { RouterContext } from "koa-router";

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
    ctx.status = 400;
    ctx.body = err;
  }
}
