import { STATUS_PLANNED_TASK_DISPLAY } from './../../components/admin/common/admin.descriptions';
import { DatePipe } from '@angular/common';
import { PlannedPartnerAction } from './plannedPartnerAction';
import { StatusPlannedTask } from './statusPlannedTask';
import { Task } from './../task/task';

export class PlannedTask {
  constructor() {
    this.plannedRequesters = [];
    this.plannedCreator = new PlannedPartnerAction();
  }

  id: number;
  refTask: Task;
  status: StatusPlannedTask;

  plannedCreator: PlannedPartnerAction;
  plannedRequesters: PlannedPartnerAction[];

  createdAt: Date;

  timeToSelectingPerformer: Date;
  timeTaskToInProgress: Date;
  timeToFinishingTask: Date;
  nextActionTime: Date;

  errorInfo: string;

  getName(): string {
    return this.refTask.name;
  }

  getStatus(): string {
    return STATUS_PLANNED_TASK_DISPLAY[this.status];
  }

  getNextActionTime(): string {
    if(this.nextActionTime != null) {
      return new DatePipe('en-US').transform(this.nextActionTime, 'dd.MM.yyyy HH:mm');
    }
    else {
      return '';
    }
  }

  static convertToObj(obj: any): PlannedTask {
    if(obj == null) {
      return null;
    }

    let resp = new PlannedTask()
    Object.assign(resp, obj);
    if(obj.refTask != null) {
      resp.refTask = Task.convertToObj(obj.refTask);
    }

    return resp;
  }
}
