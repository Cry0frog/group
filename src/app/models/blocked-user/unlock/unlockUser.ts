import { ROLE } from 'src/app/auth/role';
import { СonfirmationUnlock } from "../../blocked-user/common/confirmationUnlock";

export class UnlockUser {
  summ: number;
  сonfirmationUnlock: СonfirmationUnlock;
  description: string;
  roles: ROLE[];
}
