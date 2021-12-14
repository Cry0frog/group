import { TaskStatus } from './taskStatus';
import { TaskRequestStatus } from './taskRequestStatus';

export class ShortTaskRequest {

  id: number;
  comment: string;
  taskId: number;
  creatorId: number;
  fioTaskOwner: string;
  taskStatus: TaskStatus;
  nameTask: string;
  moneyTopBorder: number;
  taskRequestStatus: TaskRequestStatus;
  createdAt: Date;

  isCommonCustomerConfitmed(): boolean {
    return this.taskRequestStatus == TaskRequestStatus.APPROVED_BY_CUSTOMER;
  }

  isCommonUnderCunsideration(): boolean {
    return this.taskRequestStatus == TaskRequestStatus.SUBMITTED;
  }

  isCommonCanceled(): boolean {
    return this.taskRequestStatus == TaskRequestStatus.REJECTED_BY_CUSTOMER
      || this.taskRequestStatus == TaskRequestStatus.REJECTED_BY_PERFORMER;
  }

  static sortById(tasks: ShortTaskRequest[]): ShortTaskRequest[]  {
    return tasks.sort((a: ShortTaskRequest, b: ShortTaskRequest) => 
      (a.id < b.id) ? 1
      : (a.id === b.id) ? 0
      : -1
    );
  }
  
  static convertToObj(obj: any): ShortTaskRequest {
    if(obj == null) {
      return null;
    }
    const shortTaskRequest: ShortTaskRequest = new ShortTaskRequest();
    Object.assign(shortTaskRequest, obj);
    
    if(obj.createdAt != null) {
       shortTaskRequest.createdAt = new Date(Date.parse(obj.createdAt));
    }

    return shortTaskRequest;
  }
}