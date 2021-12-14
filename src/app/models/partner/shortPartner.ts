import { GeoCityProperty } from './../map/geo/city/geoCityProperty';
import { ROLE } from 'src/app/auth/role';
import { ROLE_TITILE_DISPLAY } from '../../components/admin/common/admin.descriptions';
import { TypeBlocking } from 'src/app/common/typeBlocking';
import { ReasonsBlocking } from '../blocked-user/common/reasonsBlocking';


export class ShortPartner {

  constructor() {
    this.roles = [];
    this.currentBonuses = 0;
  }

  id: number;
  username: string;
  fio: string;
  phoneNumber: string;
  description: string;
  password: string;
  confirmationPassword: string;

  email: string;

  enabled: boolean;
  changedPassword: boolean;
  dateReg: Date;

  roles: ROLE[];

  typeBlocking: TypeBlocking;
  blocked: boolean;
  reasonsBlocking: ReasonsBlocking;

  currentBonuses: number;
  brandedCar: boolean;

  showMember: boolean;
  mainAdmin: boolean;

  //Only for filter by table
  translateRoles: string[];
  cityProperty: GeoCityProperty;
  isSelectUser: boolean;

  static convertToObj(obj: ShortPartner): ShortPartner {
    if(obj == null) {
      return null;
    }

    let resp = new ShortPartner()
    resp.id = obj.id;
    resp.username = obj.username;
    resp.fio = obj.fio;
    resp.phoneNumber = obj.phoneNumber;
    resp.description = obj.description;
    resp.roles = obj.roles;
    resp.enabled = obj.enabled;
    resp. password = '';
    resp.confirmationPassword = '';
    resp.email = obj.email;
    resp.currentBonuses = obj.currentBonuses;
    resp.changedPassword = obj.changedPassword;
    resp.translateRoles = obj.roles.map(el => ROLE_TITILE_DISPLAY[el]);
    resp.cityProperty = GeoCityProperty.convertToObj(obj.cityProperty, null);
    resp.dateReg = obj.dateReg;
    resp.mainAdmin = obj.mainAdmin;
    return resp;
  }

  static convertToObjForSelectedAllUsers(obj: ShortPartner): ShortPartner {
    if(obj == null) {
      return null;
    }

    let resp = new ShortPartner()
    resp = ShortPartner.convertToObj(obj);
    resp.isSelectUser = true;
    return resp;
  }

  getCity(): string {
    return this.cityProperty != null ? this.cityProperty.name : "";
  }
}
