import { NotificationAdditional } from './notificationAdditional';
import { NotificationType } from './notificationType';

export class Notification {
  id: number;
  type: NotificationType;
  message: number;
  date: Date;
  checked: boolean;
  refObjectId: number;

  notificationAdditional: NotificationAdditional;

  //Only UI
  isCheckComment: boolean = false;

  public static convertToObjFromJSON(body): Notification {
    const notification: Notification = new Notification();
    Object.assign(notification, JSON.parse(body));
    return notification;
  }

  public static convertToObj(obj: any): Notification {
    if(obj == null) {
      return null;
    }

    const notification: Notification = new Notification();
    Object.assign(notification, obj);
    if(obj.date != null) {
      notification.date = new Date(Date.parse(obj.date));
    }

    return notification;
  }

  public static sortByDate(notifications: Notification[]): Notification[] {
    return notifications.sort((a: Notification, b: Notification) =>
      (a.date.getTime() < b.date.getTime()) ? 1
      : (a.date.getTime() === b.date.getTime()) ? 0 : -1
    );
  }
}