import * as SecureStore from 'expo-secure-store';

export class TokenManager {
  static async getToken() {
    let result = await SecureStore.getItemAsync('UserToken');
    if (result) {
      return result;
    } else {
      return '';
    }
  }
}