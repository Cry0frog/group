import { ArbitrationResolutionType } from './../arbitration/arbitrationResolutionType';
import { ChatMessage } from './../common/chatMessage';
import { ChatType } from '../chatType';
import { ChatNotificationType } from './chatNotificationType';
import { TaskStatus } from '../../task/taskStatus';

export class ChatNotification {
  message: ChatMessage;
  chatType: ChatType;
  userId: number;
  chatNotificationType: ChatNotificationType;

  taskStatus: TaskStatus;
  arbitrationResolutionType: ArbitrationResolutionType;

  static convertToObj(obj: any): ChatNotification {
    if(obj == null) {
      return null;
    }
    const chatNotification: ChatNotification = new ChatNotification();
    Object.assign(chatNotification, obj);
    if(obj.message != null) {
      chatNotification.message = ChatMessage.convertToObj(obj.message);
    }

    return chatNotification;
  }

  public static convertToObjFromJSON(body): ChatNotification {
    const obj = JSON.parse(body);
    return ChatNotification.convertToObj(obj);
  }

}