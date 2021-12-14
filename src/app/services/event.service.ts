import { ApiUrls } from './../auth/activeUrls';
import { BaseEventService } from './base-event.service';
import { NotificationService } from './../components/shared-module/service/notification.service';
import { ChatEventService } from './../components/shared-module/service/chat-event.service';
import { Notification } from './../models/notification/notification';
import { AuthService } from 'src/app/auth/auth.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService extends BaseEventService {

  private newNotification;
  public newNotification$;

  constructor(private authService: AuthService,
      private chatEvenService: ChatEventService,
      private notificationService: NotificationService) {
    super(ApiUrls.NOTIFICATION_INTERACTIVE);
    this.newNotification =  new Subject<Notification>();
    this.newNotification$ = this.newNotification.asObservable();
  }

  public connect() {
    super.connectWrapper();
  }

  protected subscribeHandler() {
    const url = `${this.endpoint}/${this.authService.getUserId}`;
    console.log('EventService: ' + url);
    this.stompClient.subscribe(url, (msg: any) => {
      const notification: Notification = Notification.convertToObjFromJSON(msg.body);
      if(this.chatEvenService.currentChatId == notification.refObjectId) {
        this.notificationService.deleteNotification(notification.refObjectId);
        return;
      }
      this.newNotification.next(notification);
    });
  }

}
