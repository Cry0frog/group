import { catchError, map } from 'rxjs/operators';
import { Notification } from './../../../models/notification/notification';
import { ApiUrls } from './../../../auth/activeUrls';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { BaseHandlerService } from './../../../common/services/service.base.handler';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseHandlerService {

  constructor(private http: HttpClient,
      protected auth: AuthService) { 
    super(auth);
  }

  getNotifications(page: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${ApiUrls.COMMON_NOTIFICATION}${page}`, BaseHandlerService.httpOptions).pipe(
      map((notifications: Notification[]) => notifications.map(notification => Notification.convertToObj(notification))),
      catchError(this.handleError('getNotifications', []))
    );
  }

  markAsRead(notificationId: number): Observable<number> {
    return this.http.put<number>(`${ApiUrls.NOTIFICATION_MARK_READ}/${notificationId}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleNotificationError('markAsRead', null))
    );
  }

  deleteNotification(notificationId: number): Observable<number> {
    return this.http.delete<number>(`${ApiUrls.NOTIFICATION}${notificationId}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleNotificationError('deleteNotification', null))
    );
  }

  deleteAllNotification(): Observable<number> {
    return this.http.delete<number>(`${ApiUrls.NOTIFICATION}0`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleNotificationError('deleteAllNotification', null))
    );
  }

  protected handleNotificationError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log('handle error: ' + operation);
      if(error.status != 400 && error.status != 401 && error.status != 200 && error.status != 500) {
        alert('status: ' + error.status + ', handle error: ' + operation);
      }
      
      this.auth.logout();
      return of(result as T);
    };
  }

}
