import { FileInfo } from "ssh2-sftp-client";
import { UserInterface } from "../interfaces/user.interface.ts";
import userMiddleware from "../middlewares/user.middleware.ts";
import AbstractRoute from "../models/route.abstact.ts";
import ftpSrv from "../services/ftp.service.ts";
import { Token } from "../services/user.service.ts";

interface ListQuery {
  path: string;
}

interface State {
  token: Token;
  user: UserInterface;
}

interface DeleteQuery extends ListQuery {
  type: FileInfo["type"];
}

class FtpRoute extends AbstractRoute {
  define(): void {
    this.root();
    this.size();
    this.delete();
  }

  root(): void {
    this.router.get("/", async (ctx) => {
      const query: ListQuery = ctx.query as unknown as ListQuery;

      ctx.body = await ftpSrv.list(query.path);
    });
  }

  size(): void {
    this.router.get("/size", userMiddleware, async (ctx) => {
      const { user } = ctx.state as State;

      ctx.body = await ftpSrv.calculateSize(`/${user.config.seedbox.tag}`);
    });
  }

  delete(): void {
    this.router.del("/delete", async (ctx) => {
      const query: DeleteQuery = ctx.query as unknown as DeleteQuery;

      try {
        await ftpSrv.delete(query.path, query.type);
        ctx.status = 204;
      } catch (e) {
        ctx.throw(500, `Impossible de supprimer la ressource (${e}).`);
      }
    });
  }
}

const ftpRoute = new FtpRoute("/ftp");
export default ftpRoute;
