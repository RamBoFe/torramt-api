import firebaseSrv from "./firebase.service.ts";

class UserService {
  /**
   * Determine if a user is authorized to access this resource.
   *
   * @param token User client token
   */
  async isAuthorized(token: string): Promise<boolean> {
    const decodedToken = await firebaseSrv.verifyToken(token);
    if (decodedToken) {
      const usersAuthorized =
        await firebaseSrv.listDocumentsInCollection("users");
      const isUserAuthorized = usersAuthorized.some(
        (user) => user.email === decodedToken.email,
      );

      if (!isUserAuthorized) {
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
