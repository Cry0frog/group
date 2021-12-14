import { GeoCityProperty } from './../map/geo/city/geoCityProperty';
import { ROLE } from 'src/app/auth/role';
import { TypeBlocking } from 'src/app/common/typeBlocking';
import { ReasonsBlocking } from '../blocked-user/common/reasonsBlocking';


export class ShortLegalEntity {
    constructor() {
        this.roles = [];
        this.city = new GeoCityProperty();
    }

    id: number;
    username: string;
    nameOrganization: string;
    phoneNumber: string;
    email: string;
    dateReg: Date;

    password: string;
    confirmationPassword: string;
    changedPassword: boolean;

    roles: ROLE[];
    enabled: boolean;

    typeBlocking: TypeBlocking;
    blocked: boolean;
    reasonsBlocking: ReasonsBlocking;
    showMember: boolean;
    isSelectUser: boolean;
    currentBonuses: number;

    city: GeoCityProperty;

    static convertToObj(obj: any): ShortLegalEntity {
      if(obj == null) {
        return null;
      }
      const shortLegalEntity: ShortLegalEntity = new ShortLegalEntity();
      Object.assign(shortLegalEntity, obj);

      shortLegalEntity.city = GeoCityProperty.convertToObj(obj.city, null)
      return shortLegalEntity;
    }
}
