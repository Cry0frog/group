import { StatusPlannedTask } from './../../../../../models/development/statusPlannedTask';

export enum FilterTaskStatus {
  ALL = 'ALL',
  NOT_READY = 'NOT_READY',
  IN_PROGRESS = 'IN_PROGRESS',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export const FILTER_TASK_STATUS_ALL = {
  [FilterTaskStatus.NOT_READY]: [StatusPlannedTask.NOT_STARTED],
  [FilterTaskStatus.IN_PROGRESS]: [StatusPlannedTask.NOT_STARTED,
    StatusPlannedTask.PUBLISHED, StatusPlannedTask.REQUESTS_FINISHED,
    StatusPlannedTask.PERFORMER_SELECTED, StatusPlannedTask.IN_PROGRESS
  ],
  [FilterTaskStatus.SUCCESS]: [StatusPlannedTask.FINISHED],
  [FilterTaskStatus.ERROR]: [StatusPlannedTask.ERROR]
}