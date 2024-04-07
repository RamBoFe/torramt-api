import userMiddleware from "../middlewares/user.middleware.ts";
import yggMiddleware from "../middlewares/ygg.middleware.ts";
import AbstractRoute from "../models/route.abstact.ts";
import torrentSrv from "../services/torrent.service.ts";
import transmissionSrv from "../services/transmission.service.ts";

interface SearchQuery {
  search: string;
}
interface DownloadQuery {
  torrent: string;
}

class TorrentRoute extends AbstractRoute {
  define(): void {
    this.root();
    this.download();
    this.details();
    this.providers();
  }

  private root() {
    this.router.get("/search", async (ctx) => {
      const search = JSON.parse((ctx.query as SearchQuery).search);
      if (!search.search || !search.provider || !search.category) {
        ctx.throw(
          400,
          "L' expression recherchée, la catégorie et le fournisseur sont requis.",
        );
      }
      ctx.body = await torrentSrv.searchTorrents(
        search.search,
        search.category,
        search.provider,
      );
    });
  }

  private download(): void {
    this.router.get("/dl", userMiddleware, yggMiddleware, async (ctx) => {
      const torrentFile = await torrentSrv.dlTorrentFile(
        JSON.parse((ctx.query as DownloadQuery).torrent),
      );
      ctx.body = await transmissionSrv.add(torrentFile);
    });
  }

  private details() {
    this.router.get("/details", userMiddleware, yggMiddleware, async (ctx) => {
      ctx.body = await torrentSrv.getTorrentDetails(
        JSON.parse((ctx.query as DownloadQuery).torrent),
      );
    });
  }

  private providers() {
    this.router.get("/providers", (ctx) => {
      ctx.body = torrentSrv.getActiveProvidersWithCategories();
    });
  }
}

const torrentRoute = new TorrentRoute("/torrents");
export default torrentRoute;
