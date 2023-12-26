declare module "syno" {
  // import { Request, RequestAPI, CoreOptions } from "request";

  export interface SynoConfig {
    account: string;
    passwd: string;
    protocol?: "http" | "https";
    host?: string;
    port?: string;
    apiVersion?: ApiVersion;
    debug?: boolean;
    ignoreCertificateErrors?: boolean;
  }

  export type ApiVersion =
    | "5.0"
    | "5.1"
    | "5.2"
    | "6.0"
    | "6.0.1"
    | "6.0.2"
    | "6.0.3"
    | "6.1"
    | "6.1.1"
    | "6.1.2"
    | "6.1.3"
    | "6.1.4"
    | "6.1.5"
    | "6.1.6"
    | "6.1.7"
    | "6.2"
    | "6.2.1"
    | "6.2.2";

  type SynoApiName = "diskStationManager" | "dsm" | "fileStation" | "fs";
  type SynoApiGenericRequestParams = { [key: string]: any };
  type SynoApiGenericRequestCallback = (
    error: Error,
    success: SynoApiGenericRequestParams,
  ) => void;

  type File = { isDir: boolean; name: string; path: string };

  type SynoReturnList = {
    files: File[];
    offset: number;
    total: number;
  };

  type SynoReturnListeShare = {
    shares: (File & {
      hybridshare_cache_status: boolean;
      hybridshare_pin_status: boolean;
    })[];
    offset: number;
    total: number;
  };

  type SynoReturnCreateFolder = { folders: File[] };

  export interface SynoDefinition {
    [key: string]: {
      minVersion: number;
      maxVersion: number;
      methods: { [key: number]: string[] };
      path?: string;
      allowUser?: string[];
      appPriv?: string;
      authLevel?: number;
      lib?: string;
      priority?: number;
    };
  }

  export class SynoApi {
    syno: Syno;
    sessionName: SynoApiName;
  }

  class FileStation extends SynoApi {
    sessionName: "fileStation";

    list(
      params: {
        folder_path: string;
      },
      callback: (error: Error, success: SynoReturnList) => void,
    ): SynoReturnList;
    shareList(
      callback: (error: Error, success: SynoReturnListeShare) => void,
    ): SynoReturnListeShare;
    createFolder(
      params: {
        folder_path: string;
        name: string;
      },
      callback: (error: Error, success: SynoReturnCreateFolder) => void,
    ): SynoReturnCreateFolder;

    /*getInfoList();
    listSnapshots();
    historySnapshot();
    descSnapshot();
    checkExist();
    startDirSize();
    statusDirSize();
    stopDirSize();
    getInfo();
    setProperty();
    statusProperty();
    stopProperty();
    getPropertyAclOwner();
    getPropertyCompressSize();
    getPropertyMtime();
    writeCheckPermission();
    listExtracts();
    startExtract();
    statusExtract();
    stopExtract();
    openExternalGoogleDrive();
    download();
    listUserUserGrps();
    listGroupUserGrps();
    listAllUserGrps();
    startFormUpload();
    statusFormUpload();
    cancelFormUpload();
    upload();
    avoidTimeout();
    getJsUiString();
    listFavorites();
    editFavorite();
    deleteFavorite();
    addFavorite();
    clearBrokenFavorite();
    replaceAllFavorite();
    createSharing();
    listSharings();
    listShareMeSharings();
    editSharing();
    deleteSharing();
    clearInvalidSharing();
    getInfoSharing();
    downloadSharing();
    startDelete();
    stopDelete();
    statusDelete();
    delete();
    isoMount();
    remoteMount();
    unMount();
    getMountList();
    unmountMountList();
    reconnectMountList();
    remountMountList();
    allNotify();
    oneNotify();
    listSearches();
    startSearch();
    stopSearch();
    cleanSearch();
    getSearchHistory();
    setSearchHistory();
    deleteSearchHistory();
    createVfsConnection();
    setVfsConnection();
    deleteVfsConnection();
    listVfsConnections();
    getVfsConnection();
    downloadVfsgDrive();
    createVfsProfile();
    setVfsProfile();
    deleteVfsProfile();
    getVfsProfile();
    listVfsProfiles();
    listVfsProtocols();
    getVfsUser();
    setVfsUser();
    rename();
    startCompress();
    statusCompress();
    stopCompress();
    getSettings();
    settings();
    listVirtualFolders();
    getThumb();
    listBackgroundTasks();
    clearFinishedBackgroundTask();
    startCopyMove();
    statusCopyMove();
    stopCopyMove();
    startMd5();
    statusMd5();
    stopMd5();*/
  }

  class DownloadStation extends SynoApi {
    sessionName: "downloadStation";

    createTask(
      params: { uri: string; destination: string },
      callback: SynoApiGenericRequestCallback,
    ): any;
  }

  class Syno implements SynoConfig {
    constructor(params: SynoConfig);

    account: string;
    passwd: string;
    protocol?: "http" | "https";
    host?: string;
    port?: string;
    apiVersion?: ApiVersion;
    debug?: boolean;
    ignoreCertificateErrors?: boolean;

    // request: RequestAPI<Request, CoreOptions, any>;
    // loadDefinitions(): SynoDefinition;
    // createFunctionsFor(): ((params: any, done: any) => Request)[];
    // session: any;
    fs: FileStation;
    dl: DownloadStation;
  }

  export default Syno;
}
