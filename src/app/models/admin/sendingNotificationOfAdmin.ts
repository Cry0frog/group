import { ChatMessage } from './../chat/common/chatMessage';

export class SendingNotificationOfAdmin {
  constructor() {
    this.message = new ChatMessage();
  }

  selectedUsername: string;
  message: ChatMessage;
}
