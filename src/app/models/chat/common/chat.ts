import { BaseChat } from '../baseChat';

export class Chat extends BaseChat {

  constructor() {
    super();
    this.countNewMessages = 0;
  }

  countNewMessages: number;

  static convertToObj(obj: any): Chat {
    if(obj == null) {
      return null;
    }
    const chat: Chat = new Chat();
    Object.assign(chat, obj);
    return chat;
  }

}
