import * as firebase from "firebase-admin";
import { app } from "firebase-admin";
import { FirebaseNamespace } from "firebase-admin/lib/app/firebase-namespace";
import serviceAccount from "../../torramt-831ee-firebase-adminsdk-gjxsj-bbb48d1d66.json" assert { type: "json" };

export class FirebaseService {
  firebase: FirebaseNamespace = firebase.default;

  constructor() {
    const ok: app.App = firebase.default.initializeApp({
      credential: firebase.default.credential.cert(serviceAccount),
    });
  }
}

const firebaseSrv = new FirebaseService();
export default firebaseSrv;
