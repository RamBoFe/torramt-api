declare module "torrent-search-api" {
  export interface Torrent {
    title: string;
    time: string;
    size: string;
    magnet: string;
    desc: string;
    provider: string;
  }

  export interface TorrentProvider {
    name: string;
    baseUrl: string;
    requireAuthentification: boolean;
    supportTokenAuthentification: boolean;
    supportCookiesAuthentification: boolean;
    supportCredentialsAuthentification: boolean;
    loginUrl: string;
    loginQueryString: string;
    searchUrl: string;
    categories: any; // FIXME {key: [string]}
    defaultCategory: string;
    resultsPerPageCount: number;
    itemsSelector: string;
    itemSelectors: any; // FIXME {key: [string]}
    paginateSelector: string;
    torrentDetailsSelector: string;
    enableCloudFareBypass: boolean;
    headers: any; // FIXME {key:[string]}
    magnetSelector: string;
    autoFixUnstableUrl: boolean;
    username: string;
    password: string;
    setCookies(cookies: string[]): void;
  }

  export function lodProvider(providerParam: string): void;

  export function loadProvider(providerParam: string | TorrentProvider): void;

  export function addProvider(provider: string): void;

  export function loadProviders(...args: string[]): void;
  export function loadProviders(...args: TorrentProvider[]): void;

  export function removeProvider(providerName: string): void;

  export function enableProvider(providerName: string, args?: string[]): void;
  export function enableProvider(providerName: string, ...args: string[]): void;

  export function enablePublicProviders(): void;

  export function disableProvider(providerName: string): void;

  export function disableAllProviders(): void;

  export function getProviders(): TorrentProvider[];

  export function getActiveProviders(): TorrentProvider[];

  export function isProviderActive(name: string): boolean;

  export function search(
    query: string,
    category: string,
    limit: number,
  ): Promise<Torrent[]>;

  export function search(
    providers: string[],
    query: string,
    category: string,
    limit: number,
  ): Promise<Torrent[]>;

  export function getTorrentDetails(torrent: Torrent): Promise<string>;

  export function downloadTorrent(
    torrent: Torrent,
    filenamePath?: string,
  ): Promise<string>;

  export function overrideConfig(
    providerName: string,
    newConfig: TorrentProvider,
  ): void;

  export function getMagnet(torrent: Torrent): Promise<string>;

  export function getProvider(
    name: string,
    throwOnError?: boolean,
  ): TorrentProvider;
}
