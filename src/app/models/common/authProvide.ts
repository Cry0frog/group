import { AuthProviderForUIType } from './authProviderForUIType';

export class AuthProvide {
  token: string;
  authProviderForUITypes: AuthProviderForUIType[]

  static convertToObj(obj: any): AuthProvide {
    if(obj == null) {
      return null;
    }
    const authProvide: AuthProvide = new AuthProvide();
    Object.assign(authProvide, obj);
  
    return authProvide;
  }
}