import Nas from 'syno';
import config from './config.mjs';

const nas = new Nas({
  protocol: config.get('nas:protocol'),
  host: config.get('nas:host'),
  port: config.get('nas:port'),
  account: config.get('nas:user'),
  passwd: config.get('nas:pwd'),
});

export default function listFiles(params) {
  return new Promise((resolve, reject) => {
    nas.fs.list(params, (error, success) => {
      if (error) {
        reject(error);
      } else {
        resolve(success);
      }
    });
  });
}

export function listShares() {
  return new Promise((resolve, reject) => {
    nas.fs.shareList((error, success) => {
      if (error) {
        reject(error);
      } else {
        resolve(success);
      }
    });
  });
}


export function createTaskSync(params) {
  return new Promise((resolve, reject) => {
    nas.dl.createTask(params, (error, success) => {
      if (error) {
        reject(error);
      } else {
        resolve(success);
      }
    });
  });
}
export function listTasksSync(params) {
  return new Promise((resolve, reject) => {
    nas.dl.listTasks(params, (error, success) => {
      if (error) {
        reject(error);
      } else {
        resolve(success);
      }
    });
  });
}

export function createFolderSync(params) {
  return new Promise((resolve, reject) => {
    nas.fs.createFolder(params, (error, success) => {
      if (error) {
        reject(error);
      } else {
        resolve(success);
      }
    });
  });
}

// export function createFolderSync(params) {
//   return new Promise((resolve, reject) => {
//     nas.fs.checkExist(params, (error, success) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(success);
//       }
//     });
//   });
// }
