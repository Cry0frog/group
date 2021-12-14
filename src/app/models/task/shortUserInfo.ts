import { ShortPartner } from '../partner/shortPartner';

export class ShortUserInfo {

  constructor() {}

  name: string;
  phoneNumber: string;
  verificationToken: string;

  static convertToObj(obj: ShortPartner): ShortUserInfo {
    if(obj == null) {
      return null;
    }
    const userInfo: ShortUserInfo = new ShortUserInfo();
    userInfo.name = obj.fio;
    userInfo.phoneNumber = obj.phoneNumber;

    return userInfo;
  }

  static shortUserInfoConvertToObj(obj: ShortUserInfo): ShortUserInfo {
    if(obj == null) {
      return null;
    }
    const userInfo: ShortUserInfo = new ShortUserInfo();
    Object.assign(userInfo, obj)
    return userInfo;
  }
}
