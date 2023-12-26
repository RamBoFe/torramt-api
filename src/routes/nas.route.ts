import AbstractRoute from "../models/route.abstact.ts";
import nasSrv from "../services/nas.service.ts";
import environment from "../services/environment.service.ts";

interface ListQuery {
  path: string;
}

interface Transfert extends ListQuery {
  type: string;
  createSubFolder: string;
  destination: string;
}

class NasRoute extends AbstractRoute {
  define(): void {
    this.root();
    this.listFiles();
  }

  private root(): void {
    this.router.get("/transfert", async (ctx) => {
      const query: Transfert = ctx.query as Transfert;
      let dest = query.destination;
      const hasSubFolder = !!query.createSubFolder;

      if (hasSubFolder) {
        const created = await nasSrv.createFolder({
          folder_path: `/${dest}`,
          name: query.createSubFolder,
        });
        ctx.assert(created, 500, "Le répertoire n'a pas pu être créé.");
        dest = `${dest}/${query.createSubFolder}`;
      }

      try {
        await nasSrv.createTask({
          uri:
            query.type !== "d"
              ? `${environment.get("ftp:uri")}${query.path}`
              : `${environment.get("ftp:uri")}${query.path}/`,
          destination: dest,
        });
        ctx.status = 204;
      } catch (e) {
        ctx.throw(500, `Impossible de transférer la ressource (${e}).`);
      }
    });
  }

  private listFiles(): void {
    this.router.get("/listFiles", async (ctx) => {
      const query: ListQuery = ctx.query as ListQuery;

      ctx.body = query.path
        ? (await nasSrv.listFiles({ folder_path: query.path })).files
        : (await nasSrv.listShares()).shares.map((file) => ({
            isdir: file.isdir,
            name: file.name,
            path: file.path,
          }));
    });
  }
}

const nasRoute = new NasRoute("/nas");
export default nasRoute;
