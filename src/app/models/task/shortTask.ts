import { TaskStatus } from './taskStatus';
import { TASK_STATUS_TRANSLATE } from '../../common/task.description'
import { GeoCityProperty } from '../map/geo/city/geoCityProperty';

export class ShortTask {
  constructor() {
    this.city = new GeoCityProperty();
  }

  id: number;
  name: string;
  fioTaskOwner: string;
  creatorId: number;

  fioTaskPerformer: string;
  performerId: number;
  paymentApprove: boolean;

  status: TaskStatus;
  countCandidate: number;
  imgRef: string;
  createdAt: Date;
  estimationDate: Date;
  finishedAt: Date;
  moneyTopBorder: number;

  city: GeoCityProperty;

  dateTransitionProcessing: Date;

  //only ui
  translateTaskStatus: string;
  message: string;

  isCommonHide(): boolean {
    return this.status == TaskStatus.HIDE
      || this.status == TaskStatus.ON_HOLD
  }

  isCommonInProgress(): boolean {
    return this.status == TaskStatus.PUBLISHED
      || this.status == TaskStatus.PERFORMER_SELECTED
      || this.status == TaskStatus.PROCESSING
      || this.status == TaskStatus.REQUEST_TO_FINISH;
  }

  isPendingPayment(): boolean {
    return this.status == TaskStatus.NOT_PAYED
  }

  isSuccess(): boolean {
    return this.status == TaskStatus.FINISHED
      || this.status == TaskStatus.FINISHED_IN_FAVOR_PERFORMER
      || this.status == TaskStatus.FINISHED_IN_FAVOR_CUSTOMER;
  }

  isTrouble(): boolean {
    return this.status == TaskStatus.CANCELED_BY_PARTNER
      || this.status == TaskStatus.CANCELED_BY_PERFORMER
  }


  isHide(): boolean {
    return this.status == TaskStatus.HIDE;
  }

  isOnHold(): boolean {
    return this.status == TaskStatus.ON_HOLD;
  }

  isPublished(): boolean {
    return this.status == TaskStatus.PUBLISHED;
  }

  isPerformerSelected(): boolean {
    return this.status == TaskStatus.PERFORMER_SELECTED;
  }

  isProcessing(): boolean {
    return this.status == TaskStatus.PROCESSING;
  }

  isRequestToFinish(): boolean {
    return this.status == TaskStatus.REQUEST_TO_FINISH;
  }

  static convertToObj(obj: any): ShortTask {
    if(obj == null) {
      return null;
    }
    const shortTask: ShortTask = new ShortTask();
    Object.assign(shortTask, obj);

    shortTask.translateTaskStatus = TASK_STATUS_TRANSLATE[obj.status];

    if(obj.createdAt != null) {
      shortTask.createdAt = new Date(Date.parse(obj.createdAt));
    }
    if(obj.estimationDate != null) {
      shortTask.estimationDate = new Date(Date.parse(obj.estimationDate));
    }
    if(obj.finishedAt != null) {
      shortTask.finishedAt = new Date(Date.parse(obj.finishedAt));
    }

    shortTask.city = GeoCityProperty.convertToObj(obj.city, null);
    return shortTask;
  }

  static sortByDateDesc(tasks: ShortTask[]): ShortTask[]  {
    return tasks.sort((a: ShortTask, b: ShortTask) =>
      (a.createdAt < b.createdAt) ? 1
      : (a.createdAt === b.createdAt) ? 0
      : -1
    );
  }

  static sortByDateAsc(tasks: ShortTask[]): ShortTask[]  {
    return tasks.sort((a: ShortTask, b: ShortTask) =>
      (a.createdAt > b.createdAt) ? 1
      : (a.createdAt === b.createdAt) ? 0
      : -1
    );
  }

  static sortByMoneyTopBorderdDesc(tasks: ShortTask[]): ShortTask[]  {
    return tasks.sort((a: ShortTask, b: ShortTask) =>
      (a.moneyTopBorder < b.moneyTopBorder) ? 1
      : (a.moneyTopBorder === b.moneyTopBorder) ? 0
      : -1
    );
  }

  static sortByMoneyTopBorderdAsc(tasks: ShortTask[]): ShortTask[]  {
    return tasks.sort((a: ShortTask, b: ShortTask) =>
      (a.moneyTopBorder > b.moneyTopBorder) ? 1
      : (a.moneyTopBorder === b.moneyTopBorder) ? 0
      : -1
    );
  }
}
