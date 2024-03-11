import { UserAuthorizedInterface } from "../interfaces/user-authorized.interface";
import { UserInterface } from "../interfaces/user.interface.ts";
import firebaseSrv from "./firebase.service.ts";

class UserService {
  /**
   * Determine if a user is authorized to access this resource.
   *
   * @param token User client token
   */
  async isAuthorized(token: string): Promise<boolean> {
    const decodedToken = await firebaseSrv.verifyToken(token);
    if (decodedToken && decodedToken.email) {
      const email = decodedToken.email;
      const isEmailAuthorized = (
        await firebaseSrv.getDocumentsInCollection<UserAuthorizedInterface>(
          firebaseSrv.collections.usersAuthorized,
        )
      )[0].emails.includes(email);

      const userWithThisEmail = (
        await firebaseSrv.getDocumentsInCollection<UserInterface>(
          firebaseSrv.collections.users,
        )
      ).find((user) => user.email === email);

      if (isEmailAuthorized) {
        if (!userWithThisEmail) {
          await firebaseSrv.collections.users.add({ email });
        }
      } else {
        return false;
      }
    } else {
      return false;
    }

    return true;
  }
}

const userSrv = new UserService();
export default userSrv;
