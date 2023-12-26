import {
  Torrent,
  TransmissionOptions,
} from "transmission-client/typings/interface";
import { Transmission } from "transmission-client";
import pick from "lodash.pick";
import environment from "./environment.service.ts";

export class TransmissionService {
  private readonly CONFIG: TransmissionOptions = {
    host: environment.get("seedbox:host"),
    username: environment.get("seedbox:user"),
    password: environment.get("seedbox:pwd"),
    url: environment.get("seedbox:url"),
    port: environment.get("seedbox:port") as unknown as number,
    ssl: environment.get("seedbox:port") === "443",
  };

  private readonly EXTRACTED_FIELDS: (keyof Torrent)[] = [
    "id",
    "name",
    "status",
    "totalSize",
    "hashString",
    "percentDone",
    "uploadRatio",
    "uploadedEver",
    "downloadedEver",
    "rateDownload",
    "rateUpload",
    "leftUntilDone",
    "doneDate",
    "files",
  ];

  client = new Transmission(this.CONFIG);

  add(torrentFile: string) {
    return this.client.addBase64(Buffer.from(torrentFile).toString("base64"), {
      "download-dir": environment.get("seedbox:dl_path"),
    });
  }

  async list() {
    const { torrents } = await this.client.all();
    return torrents
      .map((torrent) => pick(torrent, this.EXTRACTED_FIELDS))
      .reverse();
  }

  async get(ids: string | string[]) {
    const { torrents } = await this.client.get(ids);
    return torrents
      .map((torrent) => pick(torrent, this.EXTRACTED_FIELDS))
      .reverse();
  }

  async remove(hash: string) {
    return this.client.remove(hash, true);
  }

  async start(hash: string) {
    return this.client.start(hash);
  }
  async stop(hash: string) {
    return this.client.stop(hash);
  }
}

const transmissionSrv = new TransmissionService();
export default transmissionSrv;
