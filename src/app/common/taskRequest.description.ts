import { TaskRequestStatus } from '../models/task/taskRequestStatus';

export const TASK_REQUEST_TRANSLATE = {
    [TaskRequestStatus.SUBMITTED]: 'На рассмотрении',
    [TaskRequestStatus.ACCEPTED_BY_PERFORMER]: 'Выполняются',
    [TaskRequestStatus.APPROVED_BY_CUSTOMER]: 'Подтверждено заказчиком',
    [TaskRequestStatus.REJECTED_BY_CUSTOMER]: 'Отмена заказчиком',
    [TaskRequestStatus.REJECTED_BY_PERFORMER]: 'Отмена исполнителем'
}