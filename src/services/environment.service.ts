import nconf from "nconf";
import { TorrentProviderConfig } from "./torrent.service";

type EnvironmentVariables =
  | "cloudflare_bypass_url"
  | "ygg:url"
  | "ygg:user"
  | "ygg:pwd"
  | "seedbox:host"
  | "seedbox:user"
  | "seedbox:pwd"
  | "seedbox:url"
  | "seedbox:port"
  | "seedbox:dl_path"
  | "nas:protocol"
  | "nas:host"
  | "nas:port"
  | "nas:user"
  | "nas:pwd"
  | "node:domain"
  | "node:port"
  | "ftp:uri"
  | "ftp:host"
  | "ftp:port"
  | "ftp:user"
  | "ftp:pwd"
  | "ftp:default_path"
  | "providers";

type EnvironmentVariable<T extends EnvironmentVariables> = T extends "providers"
  ? TorrentProviderConfig[]
  : string;

export class EnvironmentService {
  readonly ENV_FILE_NAME = "config.json";
  nconf!: nconf.Provider;

  constructor() {
    this.init();
  }

  init(): void {
    this.nconf = nconf
      .argv()
      .env({
        separator: "__",
        lowerCase: true,
      })
      .file({ file: this.ENV_FILE_NAME });
  }

  get<T extends EnvironmentVariables>(value: T): EnvironmentVariable<T> {
    return this.nconf.get(value);
  }
}

const environment = new EnvironmentService();
export default environment;
