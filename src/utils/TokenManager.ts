import { loadItemLocally } from './SecureStore';

export class TokenManager {
  static async getToken() {
    let result = await loadItemLocally('UserToken')
    if (result) {
      return result;
    } else {
      return undefined;
    }
  }
}
