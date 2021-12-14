import { VacancyStatus } from 'src/app/models/vacancy/vacancyStatus';
import { TaskStatus } from './taskStatus';

export class CustomerInfo {
  constructor() {
    this.countNewMessage = 0;
  }

  partnerId: number;
  username: string;
  email: string;
  phone: string;
  age: string;
  city: string;
  imgRef: string;
  taskStatus: TaskStatus;
  vacancyStatus: VacancyStatus;
  countNewMessage: number;
}
