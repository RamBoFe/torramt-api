import Ssh2SftpClient, { ConnectOptions, FileInfo } from "ssh2-sftp-client";
import config from "./environment.service.ts";
import sftp from "ssh2-sftp-client";

class FtpService {
  private client: sftp;

  constructor(client: sftp) {
    this.client = client;
  }
  static async build(): Promise<FtpService> {
    try {
      const client = new Ssh2SftpClient();
      await client.connect({
        host: config.get("ftp:host"),
        port: config.get("ftp:port"),
        username: config.get("ftp:user"),
        password: config.get("ftp:pwd"),
      } as unknown as ConnectOptions);

      return new FtpService(client);
    } catch (error) {
      throw new Error(
        `Un problème est survenu lors de la connexion au FTP : ${error}`,
      );
    }
  }

  async list(
    path = "/",
  ): Promise<Pick<FileInfo, "type" | "name" | "size" | "modifyTime">[]> {
    const files = (
      await this.client.list(`${config.get("ftp:default_path")}${path}`)
    ).map((file) => ({
      type: file.type,
      name: file.name,
      size: file.size,
      modifyTime: file.modifyTime,
    }));

    return files
      .filter((file) => file.type === "d")
      .sort((file1, file2) => (file1.name > file2.name ? 1 : -1))
      .concat(
        files
          .filter((file) => file.type !== "d")
          .sort((file1, file2) => (file1.name > file2.name ? 1 : -1)),
      );
  }

  async delete(path: string, type: FileInfo["type"] = "d"): Promise<void> {
    const remoteRessource = `${config.get("ftp:default_path")}/${path}`;

    if (type === "d") {
      await this.client.rmdir(remoteRessource, true);
    } else {
      await this.client.delete(remoteRessource);
    }

    await this.client.end();
  }

  async calculateSize(path: string): Promise<number> {
    const files = await this.list(path);

    const sizeFiles = files
      .filter((file) => file.type !== "d")
      .reduce((acc, file) => acc + file.size, 0);

    const sizeFolders = files
      .filter((file) => file.type === "d")
      .map(async (e) => {
        const listFolder = await this.list(`${path}/${e.name}`);
        return listFolder.reduce((acc, file) => acc + file.size, 0);
      });

    return Promise.all(sizeFolders).then(
      (item) => sizeFiles + item.reduce((acc, size) => acc + size, 0),
    );
  }
}

const ftpSrv = await FtpService.build();
export default ftpSrv;
