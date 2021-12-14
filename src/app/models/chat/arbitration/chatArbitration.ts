import { ChatArbitrationStatus } from './chatArbitrationStatus';
import { Task } from 'src/app/models/task/task';
import { BaseChat } from 'src/app/models/chat/baseChat';
import { User } from '../../user/user';

export class ChatArbitration extends BaseChat {

  approveToFinishInFavorCustomer: number[];
  approveToFinishInFavorPerformer: number[];
  status: ChatArbitrationStatus;
  admin: User;
  //
  approveToFinishInFavorCustomerUser: User[];
  approveToFinishInFavorPerformerUser: User[];

  static convertToObj(obj: any): ChatArbitration {
    if(obj == null) {
      return null;
    }
    const chat: ChatArbitration = new ChatArbitration();
    Object.assign(chat, obj);
    if(chat.approveToFinishInFavorCustomer != null) {
      chat.approveToFinishInFavorCustomerUser = chat.approveToFinishInFavorCustomer.map((userId: number) => {
        return chat.getApproveToFinishedUser(userId);
      });
    }
    else {
      chat.approveToFinishInFavorCustomerUser = [];
      chat.approveToFinishInFavorCustomer = [];
    }

    if(chat.approveToFinishInFavorPerformer != null) {
      chat.approveToFinishInFavorPerformerUser = chat.approveToFinishInFavorPerformer.map((userId: number) => {
        return chat.getApproveToFinishedUser(userId);
      });
    }
    else {
      chat.approveToFinishInFavorPerformerUser = [];
      chat.approveToFinishInFavorPerformer = [];
    }

    if(obj.task != null) {
      chat.task = Task.convertToObj(obj.task);
    }

    return chat;
  }

  getApproveToFinishedUser(userId: number): User {
    if(userId == this.initiator.id) {
      return this.initiator;
    }
    else if(userId == this.participant.id) {
      return this.participant;
    }
  }

  isAdminNotAssigned() {
    return this.admin == null || this.admin.username != null;
  }

  isInProgress() {
    return this.status == ChatArbitrationStatus.IN_PROGRESS;
  }

  isRequestAdmin() {
    return this.status == ChatArbitrationStatus.ADMIN_REQUEST;
  }

  isAdminJoined() {
    return this.status == ChatArbitrationStatus.ADMIN_JOINED;
  }

  isSuccess() {
    return this.status == ChatArbitrationStatus.SUCCESS
      || this.status == ChatArbitrationStatus.SUCCESS_IN_FAVOR_CUSTOMER
      || this.status == ChatArbitrationStatus.SUCCESS_IN_FAVOR_PERFORMER;
  }

}