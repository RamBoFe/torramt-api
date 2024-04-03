import { ShortcutKeys, UserInterface } from "../interfaces/user.interface.ts";
import nasMiddleware from "../middlewares/nas.middleware.ts";
import AbstractRoute from "../models/route.abstact.ts";
import environment from "../services/environment.service.ts";
import { NasService } from "../services/nas.service.ts";
import { Token } from "../services/user.service.ts";

interface ListQuery {
  path: string;
}

interface Transfert {
  type: string;
  createSubFolder: string;
  destination: ShortcutKeys;
  torrentName: string;
}

interface State {
  token: Token;
  user: UserInterface;
  nasSrv: NasService;
}

class NasRoute extends AbstractRoute {
  define(): void {
    this.root();
    this.listFiles();
  }

  private root(): void {
    this.router.get("/transfert", nasMiddleware, async (ctx) => {
      const { nasSrv, user } = ctx.state as State;
      const query: Transfert = ctx.query as unknown as Transfert;
      let dest = user.config.nas.shortcuts[query.destination];

      if (!query.createSubFolder.startsWith("/")) {
        query.createSubFolder = `/${query.createSubFolder}`;
      }

      try {
        if (query.createSubFolder) {
          await nasSrv.createFolder({
            folder_path: `${dest}`,
            name: query.createSubFolder.slice(1),
          });

          dest = `${dest}${query.createSubFolder}`;
        }
      } catch (e) {
        ctx.throw(500, `Le répertoire n'a pas pu être créé (${e}).`);
      }

      const ftpPath = `${environment.get("ftp:uri")}/${user.config?.seedbox
        .tag}/${query.torrentName}`;

      try {
        await nasSrv.createTask({
          uri: query.type !== "d" ? ftpPath : `${ftpPath}/`,
          destination: query.createSubFolder.startsWith("/")
            ? dest.substring(1)
            : dest,
        });
        ctx.status = 204;
      } catch (e) {
        ctx.throw(500, `Impossible de transférer la ressource (${e}).`);
      }
    });
  }

  private listFiles(): void {
    this.router.get("/listFiles", nasMiddleware, async (ctx) => {
      const { nasSrv } = ctx.state as State;
      const query: ListQuery = ctx.query as unknown as ListQuery;

      ctx.body = query.path
        ? (await nasSrv.listFiles({ folder_path: query.path })).files
        : (await nasSrv.listShares()).shares.map((file) => ({
            isdir: file.isDir,
            name: file.name,
            path: file.path,
          }));
    });
  }
}

const nasRoute = new NasRoute("/nas");
export default nasRoute;
