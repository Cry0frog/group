import { User } from './../user/user';
import { ErrorHandler } from '../error/errorHandler';


export class BaseChatMessage extends ErrorHandler{
  constructor() {
    super();
    this.author = new User();
  }

  id: number;
  message: string;
  attachment: string;
  creationDate: Date;
  author: User;
  edited: boolean;
  
  saw: number[];

  offset: string;
}