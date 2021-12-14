import { ChatService } from './../service/chat.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PartnerService } from '../../partner/service/partner.service';
import { NotificationService } from '../service/notification.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Notification } from 'src/app/models/notification/notification';
import { NotificationType } from 'src/app/models/notification/notificationType';
import { ActiveUrls } from 'src/app/auth/activeUrls';
import { TaskStatusesWithAssignedPerformer } from 'src/app/models/task/taskStatus';
import { ShortComment } from 'src/app/models/partner/shortComment';
import { MatDialog } from '@angular/material';
import { RequestCommentComponent } from '../tasks/task/request-comment/request-comment.component';
import { Observable, Subscription } from 'rxjs';
import { CommonService } from 'src/app/common/services/common.service';
import { NotActualityNotificationComponent } from './not-actuality-notification/not-actuality-notification.component';
import { SessionStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-notification-display',
  templateUrl: './notification-display.component.html',
  styleUrls: ['./notification-display.component.css']
})
export class NotificationDisplayComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  subscriptionLoggedIn: Subscription;
  pageNotification: number;
  notifications: Notification[];
  countNonReadable: number;
  userId: number = 0;
  resultCheck: number;
  newComment: ShortComment;
  navigateUrl: string;

  @Output() updateCountNonReadable = new EventEmitter<Notification[]>();
  @Output() navigateByUrl = new EventEmitter<string>();

  constructor(public router: Router,
    private partnerService: PartnerService,
    private commonService: CommonService,
    private sessionStorage: SessionStorageService,
    private chatService: ChatService,
    private notificationService: NotificationService,
    private authService: AuthService,
    public dialog: MatDialog) {
      this.pageNotification = 0;
      this.notifications = [];
      this.countNonReadable = 0;
      this.newComment = new ShortComment();
     }

  ngOnInit() {
    this.userId = this.authService.getCurrentId;
    this.newComment = new ShortComment();
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.subscriptionLoggedIn = this.isLoggedIn$.subscribe(isLogged => {
      if(isLogged) {
        this.reloadNotification();
      }
    });
  }

  isUser(): boolean {
    return this.authService.isUser();
  }

  checkNotification(): boolean {
    return this.notifications.length==0;
  }

  markAsRead(notification: Notification, isGoToAction) {
    this.sessionStorage.set('back_chat_url', this.router.url);
    notification.checked = true;
    this.notificationService.deleteNotification(notification.id).subscribe((id: number) => {
      this.notifications = this.notifications.filter(el => el.id != id);
      this.updateCountNonReadable.emit(this.notifications);

      if(id == 0) {
        notification.id = id;
        return this.openDialogNotActualNotific(notification);
      }

      if(isGoToAction) {
        this.goToAction(notification);
      }
    });
  }

  goToAction(notification: Notification) {
    this.router.navigated = false;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    if(this.isUser()) {
      if(notification.type == NotificationType.MESSAGE) {
        this.chatService.checkChat(notification.refObjectId).subscribe(data => {
          if(data != null) {
            if(data == 0) {
              this.openDialogNotActualNotific(notification);
            }
            else {
              this.navigateUrl = `/user/${this.authService.getCurrentId}/chat/${notification.refObjectId}`;
              this.goByUrl();
            }
          }
        })
      }
      else if(notification.type == NotificationType.ARBITRATION
        || notification.type == NotificationType.ARBITRATION_USER_APPROVED
      ) {
        this.navigateUrl = `/user/${this.authService.getCurrentId}/arbitration/${notification.refObjectId}`;
      }
      else if(notification.type == NotificationType.TASK_CHANGED) {
        if(notification.notificationAdditional != null) {
          this.chekActualityTask(notification);
        }
      }
      else if(notification.type == NotificationType.COMMENT) {
        this.chekActualityTask(notification);
      }
      else if(notification.type == NotificationType.TASK_CREATED) {
        this.chekActualityTask(notification);
      }
      else if(notification.type == NotificationType.VACANCY_CREATED) {
        this.checkActualityVacancy(notification);
      }
      else if(notification.type == NotificationType.ACTIVATE) {
        this.navigateUrl = `partner/${notification.refObjectId}`;
      }
    }
    else {
      if(notification.type == NotificationType.MESSAGE) {
        this.navigateUrl = `/admin/chats/${notification.refObjectId}`;
      }
      else if(notification.type == NotificationType.ACTIVATE) {
        this.navigateUrl = `/user/${notification.refObjectId}`;
      }
      else if(notification.type == NotificationType.ARBITRATION ||
        notification.type == NotificationType.ADMIN_REQUEST ||
        notification.type == NotificationType.ARBITRATION_USER_APPROVED
      ) {
        this.navigateUrl = `/admin/arbitration/${notification.refObjectId}`;
      }
    }
    this.goByUrl();
  }

  addComment(notification: Notification) {
    this.authService.getCurrentId == notification.notificationAdditional.creatorTaskId ? this.newComment.isPartner = true : this.newComment.isPartner = false;
    this.newComment.taskId = notification.refObjectId;
    this.newComment.idCommented = notification.notificationAdditional.creatorId;
    this.dialog.open(RequestCommentComponent, {
      width: '600px',
      data: this.newComment
    });
  }

  checkPartnerComment() {
    let commentNotifications: Notification[] = [];
    commentNotifications =  this.notifications.filter(el => el.type == NotificationType.COMMENT);
    if(commentNotifications.length > 0){
      commentNotifications.forEach((notification: Notification) => {
        this.partnerService.checkPartnerComment(notification.refObjectId).subscribe((data: number) => {
          this.resultCheck = data;

          if(this.resultCheck == 0) {
            this.notifications.forEach((el: Notification) => {
              if(el == notification) {
                el.isCheckComment = true;
              }
            });
          }
        });
      });
    }
  }

  chekActualityTask(notification: Notification) {
    this.commonService.checkTask(notification.refObjectId).subscribe(data => {
      if(data == null || data.id == null) {
        return this.openDialogNotActualNotific(notification);
      }

      if(notification.type == NotificationType.TASK_CHANGED || notification.type == NotificationType.TASK_CREATED) {
        if(notification.notificationAdditional.ownerId == this.authService.getUserId) {
          this.navigateUrl = `/user/${this.authService.getCurrentId}/${ActiveUrls.PARTNER_MY_TASKS}/${notification.refObjectId}`;
        }
        else {
          if(TaskStatusesWithAssignedPerformer.includes(notification.notificationAdditional.taskStatus)) {
            this.navigateUrl = `/user/${this.authService.getCurrentId}/${ActiveUrls.EXECUTOR_TASKS}/${notification.refObjectId}`;
          }
          else {
            this.navigateUrl = `${ActiveUrls.FIND_TASK}/${notification.refObjectId}`;
          }
        }
      }
      else if(notification.type == NotificationType.COMMENT) {
        if(notification.notificationAdditional.creatorId == this.authService.getCurrentId){
          this.navigateUrl = `/user/${this.authService.getCurrentId}/${ActiveUrls.PARTNER_MY_TASKS}/${notification.refObjectId}`;
        }
        else {
          this.navigateUrl = `/user/${this.authService.getCurrentId}/${ActiveUrls.EXECUTOR_TASKS}/${notification.refObjectId}`;
        }
      }

      this.goByUrl();
    });
  }

  checkActualityVacancy(notification: Notification) {
    this.commonService.checkActualityVacancy(notification.refObjectId, notification.type).subscribe(data => {
      if(data == -1 || data == null) {
        return this.openDialogNotActualNotific(notification);
      }

      if(notification.type == NotificationType.VACANCY_CREATED) {
        this.navigateUrl = `${ActiveUrls.FIND_VACANCIES}/${notification.refObjectId}`;
      }

      this.goByUrl();
    });
  }

  openDialogNotActualNotific(notification: Notification) {
    this.dialog.open(NotActualityNotificationComponent, {
      width: '600px',
      data: notification
    });
  }

  goByUrl() {
    if(this.navigateUrl != null) {
      this.navigateByUrl.emit(this.navigateUrl);
    }
  }

  displayLink(notification): boolean {
    return notification.type != NotificationType.DELETE_TASK &&
      notification.type != NotificationType.BLOCKING &&
      notification.type != NotificationType.BONUS &&
      notification.type != NotificationType.DELETE_VACANCY &&
      notification.type != NotificationType.DELETE_RESUME;
  }

  isTypeComment(notification: Notification): boolean {
    return notification.type == NotificationType.COMMENT;
  }

  clearAllNotification() {
    this.notificationService.deleteAllNotification().subscribe(_ => {
      this.notifications = [];
      this.updateCountNonReadable.emit(this.notifications);
    });
  }

  reloadNotification() {
    this.notificationService.getNotifications(this.pageNotification++).subscribe((data: Notification[]) => {
      this.notifications = Notification.sortByDate(data);
      this.updateCountNonReadable.emit(this.notifications);
      if(this.isUser()) {
        this.checkPartnerComment();
      }
    });
  }

  isNotEmptyNotifications(): boolean {
    return this.notifications.length != 0;
  }
}
