import firebase from "firebase-admin";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import serviceAccount from "../../torramt-831ee-firebase-adminsdk-gjxsj-bbb48d1d66.json" assert { type: "json" };
import { DbCollectionsEnum } from "../enums/db-collections.enum.ts";
import { UserInterface } from "../interfaces/user.interface.ts";

export class FirebaseService {
  app: firebase.app.App;

  constructor() {
    this.app = firebase.initializeApp({
      credential: firebase.credential.cert(serviceAccount),
    });
  }

  async verifyToken(token: string): Promise<DecodedIdToken> {
    return await this.app.auth().verifyIdToken(token);
  }

  async isEmailAuthorized(email: string): Promise<boolean> {
    const docsRef = await this.app
      .firestore()
      .collection(DbCollectionsEnum.USERS)
      .listDocuments();

    return docsRef.some(
      async (docRef) =>
        ((await docRef.get()).data() as UserInterface).email === email,
    );
  }
}

const firebaseSrv = new FirebaseService();
export default firebaseSrv;
