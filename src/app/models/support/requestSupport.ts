import { ErrorHandler } from '../error/errorHandler';

export class RequestSupport extends ErrorHandler {
  constructor() {
    super();
  }

  fio: string;
  email: string;
  phoneNumber: string;
  message: string;
}
