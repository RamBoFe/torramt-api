import firebase from "firebase-admin";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import serviceAccount from "../../firebase.service-account.json" assert { type: "json" };
import { DbCollectionsEnum } from "../enums/db-collections.enum.ts";
import { UserInterface } from "../interfaces/user.interface";

export class FirebaseService {
  /**
   * App firebase instance.
   */
  app: firebase.app.App;

  constructor() {
    this.app = firebase.initializeApp({
      credential: firebase.credential.cert(serviceAccount),
    });
  }

  /**
   * Verifies the token and throw an error if token expired, user is disabled and user is not found.
   *
   * @param token Token to check
   */
  async verifyToken(token: string): Promise<DecodedIdToken> {
    return await this.app.auth().verifyIdToken(token, true);
  }

  /**
   * List documents in a collection.
   *
   * @param collectionName The name of the collection
   */
  async listDocumentsInCollection(
    collectionName: typeof DbCollectionsEnum,
  ): Promise<UserInterface[]> {
    const docsRef = await this.app
      .firestore()
      .collection(collectionName)
      .listDocuments();

    const docs = [];
    for (const docRef of docsRef) {
      const doc = (await docRef.get()).data() as UserInterface;
      docs.push(doc);
    }

    return docs;
  }
}

const firebaseSrv = new FirebaseService();
export default firebaseSrv;
