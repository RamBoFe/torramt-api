import firebase from "firebase-admin";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
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

const PATH_SEPARATOR = "/";

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
  async getDocuments<T>(collectionRef: CollectionReference<T>): Promise<T[]> {
    const docs: T[] = [];
    const docsRef = await collectionRef.listDocuments();

    for (const docRef of docsRef) {
      const doc = (await docRef.get()).data();
      if (doc) {
        docs.push(doc);
      }
    }

    return docs;
  }

  /**
   * Get a document data in a collection.
   * Returns 'undefined' if the document doesn't exist.
   *
   * @param collectionRef
   * @param docId
   */
  async getDocument<T>(
    collectionRef: CollectionReference<T>,
    docId: string,
  ): Promise<T | undefined> {
    return (await this.getDocRef<T>(collectionRef, docId).get()).data();
  }

  /**
   * Get a document reference in a collection.
   *
   * @param collectionRef
   * @param docId
   *
   * @private
   */
  private getDocRef<T>(
    collectionRef: CollectionReference<T>,
    docId: string,
  ): DocumentReference<T> {
    return this.app
      .firestore()
      .doc(`${collectionRef.path}${PATH_SEPARATOR}${docId}`)
      .withConverter(converter<T>());
  }
}

const firebaseSrv = new FirebaseService();
export default firebaseSrv;
