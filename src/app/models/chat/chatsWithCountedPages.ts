import { Chat } from './common/chat';
import { LazyLoadingModel } from './../lazyLoading/lazyLoadingModel';

export class ChatsWithCountedPages extends LazyLoadingModel {
  constructor() {
    super();
    this.chats = [];
  }

  chats: Chat[];

  static convertToObj(obj): ChatsWithCountedPages {
    if(obj == null) {
      return null;
    }

    const chatsWithPages = new ChatsWithCountedPages();
    Object.assign(chatsWithPages, obj);
    chatsWithPages.chats = obj.chats.map(obj => Chat.convertToObj(obj));

    return chatsWithPages;
  }
}
