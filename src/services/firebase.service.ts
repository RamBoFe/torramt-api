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

    firebase.default
      .auth()
      .verifyIdToken(
        "eyJhbGciOiJSUzI1NiIsImtpZCI6ImFlYzU4NjcwNGNhOTZiZDcwMzZiMmYwZDI4MGY5NDlmM2E5NzZkMzgiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiR2xvcmlvbiBHcsOpZ29yeSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLOV9tZF9jSW9fNVE5RUk5ZzNJcXpzbEhvcFR3ckdlaFZ1YjdHcmx6QlE9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdG9ycmFtdC04MzFlZSIsImF1ZCI6InRvcnJhbXQtODMxZWUiLCJhdXRoX3RpbWUiOjE3MDc2OTA3OTQsInVzZXJfaWQiOiJmUnAyZ2RoeXl5Y1BoSVY1RWxJbFVORE1ReUYzIiwic3ViIjoiZlJwMmdkaHl5eWNQaElWNUVsSWxVTkRNUXlGMyIsImlhdCI6MTcwNzY5MDc5NCwiZXhwIjoxNzA3Njk0Mzk0LCJlbWFpbCI6InJhbWJvZkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjExMTQ1OTkzNzI4MzM2OTU4MDIyMSJdLCJlbWFpbCI6WyJyYW1ib2ZAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.mmWTDohIhYpWJqY7Xs_qkVk1jaPo30LbJohhJvgxFK-0ueFY6wWj7y7TvOrfjZhAwGtfXnGsQYg4ssO6GNYZAlEHynxbKPFJjb1ohbgvYaQ1JY_qDQvDUieIsz2d-9kyLeKRbeEVbgx3ANzszObLDMOhcSh_IWKyb9iITXUvHDHMivJB4eQ4gvyMa9KrPz2zPVsRNObyyv8FqtBw4GdY255inpjNONRHWt7-x8N-KCUWEZeoICR1SSnJN25vl-csG6mg56o811JbILeyPCB92FAcCaNF3j06M1fMtj4Rpy25dy6xmNFq-nVC1kJT5OXapMNL7Wr_m-cZrLc39qNgRg",
      )
      .then((r) => console.log(r))
      .catch((e) => console.log(e));
  }
}

const firebaseSrv = new FirebaseService();
export default firebaseSrv;
