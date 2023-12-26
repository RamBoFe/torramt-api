import AbstractRoute from "../models/route.abstact.ts";
import ftpSrv from "../services/ftp.service.ts";
import { FileInfo } from "ssh2-sftp-client";

interface ListQuery {
  path: string;
}

interface SizeQuery extends ListQuery {}
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
      const query: ListQuery = ctx.query as ListQuery;

      ctx.body = await ftpSrv.list(query.path);
    });
  }

  size(): void {
    this.router.get("/size", async (ctx) => {
      const query: SizeQuery = ctx.query as SizeQuery;

      ctx.body = await ftpSrv.calculateSize(query.path);
    });
  }

  delete(): void {
    this.router.del("/delete", async (ctx) => {
      const query: DeleteQuery = ctx.query as DeleteQuery;

      try {
        await ftpSrv.delete(query.path, query.type);
        ctx.status = 204;
      } catch (e) {
        ctx.throw(500, `Impossible de supprimer la ressource (${e.message}).`);
      }
    });
  }
}

const ftpRoute = new FtpRoute("/ftp");
export default ftpRoute;
