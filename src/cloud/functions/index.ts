/**
 * Firebase Cloud Functions
 */

import {
  beforeUserCreated,
  beforeUserSignedIn,
} from "firebase-functions/v2/identity";

export const beforecreated = beforeUserCreated((event) => {
  // TODO
  event.data.displayName = "Bataard";
  return;
});

export const beforesignedin = beforeUserSignedIn((event) => {
  // TODO
  event.data.displayName = "Bataard1";
});
