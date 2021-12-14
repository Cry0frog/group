import { BaseEventService } from './../../../services/base-event.service';
import { ApiUrls } from './../../../auth/activeUrls';
import { ChatNotification } from './../../../models/chat/notification/chatNotification';
import { AuthService } from 'src/app/auth/auth.service';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatEventService extends BaseEventService {

  private newMessageNotification;
  public newMessageNotification$;

  currentChatId: number;

  constructor(private authService: AuthService) {
    super(ApiUrls.CHAT_NOTIFICATION_INTERACTIVE);
    this.newMessageNotification =  new Subject<Notification>();
    this.newMessageNotification$ = this.newMessageNotification.asObservable();
  }

  dispose() {
    super.dispose();
    this.currentChatId = 0;
  }

  public connect(chatId: number) {
    if(this.stompClient != null) {
      if(!this.stompClient.connected) {
        this.stompClient = null;
      }
      else if(this.currentChatId == chatId) {
        return;
      }
      else {
        this.dispose();
      }

      return;
    }
    
    this.currentChatId = chatId;
    this.connectWrapper();
  }

  protected subscribeHandler() {
    const url = `${this.endpoint}/${this.currentChatId}`;
    console.log('ChatEventService: ' + url);
    this.stompClient.subscribe(url, (msg: any) => {
      const notification: ChatNotification = ChatNotification.convertToObjFromJSON(msg.body);
      this.newMessageNotification.next(notification);
    });
  }

}
