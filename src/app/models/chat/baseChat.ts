import { Vacancy } from './../vacancy/vacancy';
import { ChatType } from './chatType';
import { User } from './../user/user';
import { Task } from '../task/task';

export abstract class BaseChat {
  id: number;
  initiator: User;
  participant: User;
  creationDate: Date;
  type: ChatType;
  dateLastActivityInitiator: Date;
  dateLastActivityParticipant: Date;
  task: Task;
  vacancy: Vacancy;

  getUser(currentId: number): User {
    if(this.initiator != null && currentId != this.initiator.id) {
      return this.initiator;
    }
    else if(this.participant != null && currentId != this.participant.id) {
      return this.participant;
    }
    const user = new User()
    user.id = -1
    return user;
  }

  getInitiator(): User {
    if(this.initiator != null) {
      return this.initiator;
    }
    const user = new User()
    user.id = -1
    return user;
  }

  getParticipant(): User {
    if(this.participant != null) {
      return this.participant;
    }
    const user = new User()
    user.id = -1
    return user;
  }

  isCommon(): boolean {
    return this.type == ChatType.COMMON;
  }

  isDeleted(): boolean {
    return this.type == ChatType.DELETED;
  }

  isArbitration(): boolean {
    return this.type == ChatType.ARBITRATION;
  }

}
