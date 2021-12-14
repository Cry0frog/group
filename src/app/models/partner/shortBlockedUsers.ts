import { TypeBlocking } from '../../common/typeBlocking';
import { ROLE } from 'src/app/auth/role';

export class ShortBlockedUsers {

    constructor() {
        this.roles = [];
    }

    id: number;
    roles: ROLE[];
    username: string;
    dateBlocking: Date;
    countDaysBeforeUnlocking: number;
    typeBlocking: TypeBlocking;

    description: string;

    static convertToObj(obj: ShortBlockedUsers): ShortBlockedUsers {
        if(obj == null) {
          return null;
        }
    
        let resp = new ShortBlockedUsers()
        Object.assign(resp, obj);
        return resp;
      }
}