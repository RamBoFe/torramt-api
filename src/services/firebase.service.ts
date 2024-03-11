import firebase from "firebase-admin";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import {
  CollectionReference,
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from "firebase-admin/lib/firestore";
import serviceAccount from "../../firebase.service-account.json" assert { type: "json" };
import { UserAuthorizedInterface } from "../interfaces/user-authorized.interface.ts";
import { UserInterface } from "../interfaces/user.interface.ts";

interface CollectionReferenceMap {
  users: CollectionReference<UserInterface>;
  usersAuthorized: CollectionReference<UserAuthorizedInterface>;
}

const converter = <T>(): FirestoreDataConverter<T> => ({
  toFirestore: (data: T): DocumentData => data as DocumentData,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});

class FirebaseService {
  /**
   * App firebase instance.
   */
  private app: firebase.app.App;

  private readonly getCollection: <C>(path: string) => CollectionReference<C>;

  collections: CollectionReferenceMap;

  constructor() {
    this.app = firebase.initializeApp({
      credential: firebase.credential.cert(serviceAccount),
    });

    this.getCollection = <C>(path: string) =>
      this.app.firestore().collection(path).withConverter(converter<C>());

    this.collections = {
      users: this.getCollection<UserInterface>("users"),
      usersAuthorized:
        this.getCollection<UserAuthorizedInterface>(`usersAuthorized`),
    };
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
   * @param collectionRef
   */
  async getDocumentsInCollection<C>(
    collectionRef: CollectionReference<C>,
  ): Promise<C[]> {
    const docs: C[] = [];
    const docsRef = await collectionRef.listDocuments();

    for (const docRef of docsRef) {
      const doc = (await docRef.get()).data();
      if (doc) {
        docs.push(doc);
      }
    }

    return docs;
  }
}

const firebaseSrv = new FirebaseService();
export default firebaseSrv;
