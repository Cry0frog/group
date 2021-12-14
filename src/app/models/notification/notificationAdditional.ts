import { ROLE } from './../../auth/role';
import { TaskStatus } from '../task/taskStatus';

export class NotificationAdditional {
  
  constructor() {
    this.roles = [];
  }

  taskStatus: TaskStatus;
  ownerId: number;
  creatorId: number;
  creatorTaskId: number;
  performerId: number;
  roles: ROLE[];
}
