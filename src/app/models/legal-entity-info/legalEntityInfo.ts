import { GeoCityProperty } from '../map/geo/city/geoCityProperty';
import { StatusUser } from '../auth/statusUser';

export class LegalEntityInfo {
  constructor() {
      this.city = new GeoCityProperty();
  }

  id: number;
  email: string;
  phoneNumber: string;
  nameOrganization: string;
  ogrn: string;
  inn: string;
  city: GeoCityProperty;
  address: string;
  statusUser: StatusUser;
  aboutCompany: string;
  getNotificationsAboutNewTaskMyCity: boolean;

  //only ui
  isEditPhoneNumber: boolean;
  verificationToken: string;

  static convertToObj(obj: any): LegalEntityInfo {
    if(obj == null) {
      return null;
    }
    const legalEntityInfo: LegalEntityInfo = new LegalEntityInfo();
    Object.assign(legalEntityInfo, obj);
    legalEntityInfo.city = GeoCityProperty.convertToObj(obj.city, null);
    return legalEntityInfo;
  }
}
