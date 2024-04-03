import syno, { SynoConfig } from "syno";

export class NasService {
  private nas: syno;

  constructor(config: SynoConfig) {
    try {
      this.nas = new syno({
        protocol: config.protocol,
        host: config.host,
        port: config.port,
        account: config.account,
        passwd: config.passwd,
      });
    } catch (error) {
      throw new Error(
        `Un problème est survenu lors de la connexion au NAS : ${error}`,
      );
    }
  }

  async listFiles(
    params: Parameters<typeof this.nas.fs.list>[0],
  ): Promise<ReturnType<typeof this.nas.fs.list>> {
    return new Promise((resolve, reject) => {
      this.nas.fs.list(params, (error, success) => {
        if (error) {
          reject(error);
        } else {
          resolve(success);
        }
      });
    });
  }

  async listShares(): Promise<ReturnType<typeof this.nas.fs.shareList>> {
    return new Promise((resolve, reject) => {
      this.nas.fs.shareList((error, success) => {
        if (error) {
          reject(error);
        } else {
          resolve(success);
        }
      });
    });
  }

  async createTask(
    params: Parameters<typeof this.nas.dl.createTask>[0],
  ): Promise<ReturnType<typeof this.nas.dl.createTask>> {
    return new Promise((resolve, reject) => {
      this.nas.dl.createTask(params, (error, success) => {
        if (error) {
          reject(error);
        } else {
          resolve(success);
        }
      });
    });
  }

  async createFolder(
    params: Parameters<typeof this.nas.fs.createFolder>[0],
  ): Promise<ReturnType<typeof this.nas.fs.createFolder>> {
    return new Promise((resolve, reject) => {
      this.nas.fs.createFolder(params, (error, success) => {
        if (error) {
          reject(error);
        } else {
          resolve(success);
        }
      });
    });
  }

  // listTasksSync(params) {
  //   return new Promise((resolve, reject) => {
  //     nas.dl.listTasks(params, (error, success) => {
  //       if (error) {
  //         reject(error);
  //       } else {
  //         resolve(success);
  //       }
  //     });
  //   });
  // }
  //

  // // export function createFolderSync(params) {
  // //   return new Promise((resolve, reject) => {
  // //     nas.fs.checkExist(params, (error, success) => {
  // //       if (error) {
  // //         reject(error);
  // //       } else {
  // //         resolve(success);
  // //       }
  // //     });
  // //   });
  // // }
}

// const nasSrv = new NasService();
// export default nasSrv;
