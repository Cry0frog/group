import { Authority } from './authority';import { StatusUser } from './statusUser';
;

export class CredentialResponse {
  authenticated: boolean;
  name: string;
  authorities: Authority[];
  creatorId: number;
  userId: number;
  statusUser: StatusUser;
  fio: string;
  notShowOfferLoadApp: boolean;

  static convertToObj(obj: any): CredentialResponse {
    if(obj == null) {
      return null;
    }

    if(obj.errorStatus != undefined) {
      let resp = new CredentialResponse();
      resp.authenticated = false;

      return resp;
    }
    else {
      let resp = new CredentialResponse();
      resp.name = obj.name;
      resp.authenticated = obj.authenticated;
      resp.authorities = obj.authorities;
      resp.creatorId = obj.credentials.creatorId;
      resp.userId = obj.credentials.userId;
      resp.statusUser = obj.credentials.statusUser;
      resp.fio = obj.credentials.fio;
      resp.notShowOfferLoadApp = obj.credentials.isNotShowOfferLoadApp;

      return resp;
    }
  }
}
