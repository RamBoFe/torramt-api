import { RouterContext } from "koa-router";
import firebaseSrv from "../services/firebase.service.ts";

async function authMiddleware(
  ctx: RouterContext,
  next: () => Promise<any>,
): Promise<void> {
  const token = ctx.headers.authorization.replace("Bearer", "").trim();
  const decodeToken = await firebaseSrv.verifyToken(token);
  if (decodeToken) {
    const emailAuthorized = await firebaseSrv.isEmailAuthorized(
      decodeToken.email ?? "",
    );
    console.log(emailAuthorized);
  }

  await next();
}

export default authMiddleware;
