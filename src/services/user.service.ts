import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { UserAuthorizedInterface } from "../interfaces/user-authorized.interface";
import { UserInterface } from "../interfaces/user.interface.ts";
import firebaseSrv from "./firebase.service.ts";

export interface Token {
  valid: boolean;
  data?: DecodedIdToken;
}

class UserService {
  /**
   * Determine if a user is authorized to access this resource.
   *
   * @param tokenString User client token
   */
  async checkToken(tokenString: string): Promise<Token> {
    const decodedToken = await firebaseSrv.verifyToken(tokenString);
    const token: Token = { valid: false };

    if (decodedToken && decodedToken.email) {
      const email = decodedToken.email;
      const isEmailAuthorized = (
        await firebaseSrv.getDocuments<UserAuthorizedInterface>(
          firebaseSrv.collections.usersAuthorized,
        )
      )[0].emails.includes(email);

      if (isEmailAuthorized) {
        token.valid = true;
        token.data = decodedToken;
      }
    }

    return token;
  }

  /**
   * Get user data.
   *
   * @param id User id
   */
  async getUser(id: string): Promise<UserInterface | undefined> {
    return await firebaseSrv.getDocument<UserInterface>(
      firebaseSrv.collections.users,
      id,
    );
  }
}

const userSrv = new UserService();
export default userSrv;
