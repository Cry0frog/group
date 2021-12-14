import { CategoryPropertyPayoutTypes } from './../category/constructor/categoryPropertyPayoutTypes';
import { User } from '../user/user';
import { TaskRequestStatus } from './taskRequestStatus';
import { ErrorHandler } from '../error/errorHandler';


export class TaskRequest extends ErrorHandler {

  constructor() {
    super();
  }

  id: number;
  comment: string;
  taskId: number;
  offset: string;
  status: TaskRequestStatus;
  createdAt: string;
  modified: boolean;

  user: User;

  blockedPartner: boolean;
  blockedPerformer: boolean;

  readyToPayPartner: number;
  readyToPayPerformer: number;
  totalPay: number;

  moneyForCommission: number;
  beneficiaryPaymentToolId: number;

  invalidStatus: boolean;

  //onlyUi
  ownerTask: boolean;

  payoutType: CategoryPropertyPayoutTypes

  isSubmittedTaskRequest(): boolean {
    return this.status == TaskRequestStatus.SUBMITTED;
  }

  isApprovedByCustomer(): boolean {
    return this.status == TaskRequestStatus.APPROVED_BY_CUSTOMER;
  }

  isRejectedByCustomer(): boolean {
    return this.status == TaskRequestStatus.REJECTED_BY_CUSTOMER;
  }

  isRejectedByPerformer(): boolean {
    return this.status == TaskRequestStatus.REJECTED_BY_PERFORMER;
  }

  isAcceptedByPerformer(): boolean {
    return this.status == TaskRequestStatus.ACCEPTED_BY_PERFORMER;
  }

  isAvailableToRemoveRequest(): boolean {
    return this.status == TaskRequestStatus.SUBMITTED
      || this.status == TaskRequestStatus.REJECTED_BY_CUSTOMER;
  }

  static convertToObj(obj: any): TaskRequest {
    if(obj == null) {
      return null;
    }
    const request: TaskRequest = new TaskRequest();
    Object.assign(request, obj);
    return request;
  }
}