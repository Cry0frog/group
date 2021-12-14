import { Offset } from './../../../common/offset';
import { BaseChatMessage } from './../baseChatMessage';

export class ChatMessage extends BaseChatMessage {
  constructor() {
    super();
  }

  refChatId: number;
  notValid: boolean

  isAttachment(): boolean {
    return this.attachment != null;
  }

  prepareBeforeSave() {
    this.offset = Offset.getCurTimeZone();
  }

  static convertToObj(obj: any): ChatMessage {
    if(obj == null) {
      return null;
    }
    const msg: ChatMessage = new ChatMessage();
    Object.assign(msg, obj);
    if(obj.creationDate != null) {
      msg.creationDate = new Date(Date.parse(obj.creationDate));
    }
    return msg;
  }
}