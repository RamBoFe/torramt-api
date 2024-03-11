import { RouterContext } from "koa-router";
import { ErrorCodeEnum } from "../enums/error-code.enum.ts";
import { CustomError } from "../interfaces/custom-error.interface.ts";

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
    const _err: CustomError = err as unknown as CustomError;
    ctx.status = Object.values(ErrorCodeEnum).includes(_err.code) ? 401 : 500;
    ctx.body = err;
  }
}
