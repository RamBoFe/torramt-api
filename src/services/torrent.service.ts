import TorrentSearch, { Torrent, TorrentProvider } from "torrent-search-api";
import cloudflareSrv from "./cloudflare.service.ts";
import environment from "./environment.service.ts";

export interface TorrentProviderConfig {
  name: string;
  isActive: boolean;
  isAuth: boolean;
  override?: TorrentProvider;
}

class TorrentService {
  constructor() {
    this.init();
  }

  private init() {
    for (const providerConf of environment.get("providers")) {
      if (providerConf.isActive) {
        if (providerConf.isAuth) {
          TorrentSearch.enableProvider(
            providerConf.name,
            "username",
            "password",
          );

          if (providerConf.override) {
            TorrentSearch.overrideConfig(
              providerConf.name,
              providerConf.override,
            );
          }
        } else {
          TorrentSearch.enableProvider(providerConf.name);
        }
      }
    }
  }

  private async bypassCloudflare(provider: TorrentProvider): Promise<void> {
    if (cloudflareSrv.isSessionMustRefreshed()) {
      const cloudflareReponse = await cloudflareSrv.bypass(provider.baseUrl);

      if (cloudflareReponse) {
        provider.headers = {
          "User-Agent": cloudflareReponse.userAgent,
        };
        provider.setCookies([cloudflareReponse.cookies]);
      }
    }
  }

  getActiveProvidersWithCategories(): TorrentProvider[] {
    return TorrentSearch.getActiveProviders();
  }

  getProvider(name: string): TorrentProvider {
    return TorrentSearch.getProvider(name);
  }

  async searchTorrents(
    search: string,
    category: string,
    providerName: string,
  ): Promise<Torrent[]> {
    const provider = TorrentSearch.getProvider(providerName);
    if (provider.enableCloudFareBypass) {
      await this.bypassCloudflare(provider);

      // Switch off the old Cloudflare bypass of package.
      provider.enableCloudFareBypass = false;
    }

    const torrents = await TorrentSearch.search(
      [providerName],
      search,
      category,
      50,
    );

    // Switch on for the next time.
    provider.enableCloudFareBypass = true;

    return torrents;
  }

  dlTorrentFile(torrent: Torrent): any {
    return TorrentSearch.downloadTorrent(torrent);
  }

  getTorrentDetails(torrent: Torrent): any {
    return TorrentSearch.getTorrentDetails(torrent);
  }
}

const torrentSrv = new TorrentService();
export default torrentSrv;
