import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ROLE } from 'src/app/auth/role';
import { Notification } from 'src/app/models/notification/notification';
import { NotificationType } from 'src/app/models/notification/notificationType';
import { EventService } from 'src/app/services/event.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit {

  @Input() isOpenChatWithAdmin: boolean;
  @Output() loadChatWithAdminEvent = new EventEmitter();
  @Output() updateCountNewMessageFromAdminEvent = new EventEmitter();

  isLoggedIn$: Observable<boolean>;
  username: string;
  pageNotification: number;
  notifications: Notification[];

  countNonReadable: number;

  subscriptionLoggedIn: Subscription;
  userId: number = 0;
  resultCheck: number;
  isNewNotification: boolean;

  constructor(private authService: AuthService,
    private eventService: EventService,
    private notificationService: NotificationService,
    private router: Router,
    public dialog: MatDialog) {
  this.pageNotification = 0;
  this.notifications = [];
  this.countNonReadable = 0;
  }

  ngOnInit() {
    this.userId = this.authService.getCurrentId;
    this.isLoggedIn$ = this.authService.isLoggedIn;

    window.addEventListener('storage', (event) => {
      if(event.key == "auth" && event.newValue == null) {
        location.reload();
      }
    });

    this.subscriptionLoggedIn = this.isLoggedIn$.subscribe(isLogged => {
      if(isLogged) {
        if(!this.isAdmin()){
          this.loadChatWithAdminEvent.emit();
        }

        this.username = !isNaN(+this.authService.LoggedUser.name) ? this.authService.LoggedUser.fio : this.authService.LoggedUser.name;
        this.eventService.connect();
        this.eventService.newNotification$.subscribe((notification: Notification) => {

          if(notification.notificationAdditional != null && notification.notificationAdditional.roles != null &&
              notification.notificationAdditional.roles.includes(ROLE.SUPER_USER) && !this.isOpenChatWithAdmin) {
            this.updateCountNewMessageFromAdminEvent.emit();
          }

          if(notification.type == NotificationType.BLOCKING && notification.notificationAdditional != null) {
            this.authService.updateRolesForBlocking(notification.notificationAdditional.roles);
          }

          if(notification.type == NotificationType.ACTIVATE && notification.notificationAdditional != null) {
            this.authService.updateRoles(notification.notificationAdditional.roles);
          }

          this.notifications.unshift(notification);
          this.countNonReadable = this.getCountNonReadable();
          this.isNewNotification = true;
        });
        this.reloadNotification();
      }
    });
  }

  isAdmin(): boolean {
    return this.isAuthnticated() ? this.authService.isAdmin() : false;
  }

  isAuthnticated(): boolean {
    return this.authService.LoggedUser.authenticated;
  }

  navigateByUrlHandler(url: string) {
    this.router.navigateByUrl(url);
  }

  updateCountNonReadableHandler(notifications: Notification[]) {
    this.notifications = notifications;
    this.countNonReadable = this.getCountNonReadable();
  }

  getCountNonReadable(): number {
    return this.notifications != null
      ? this.notifications.filter(el => !el.checked).length
      : 0;
  }

  reloadNotification() {
    this.notificationService.getNotifications(this.pageNotification++).subscribe((data: Notification[]) => {
      this.notifications = Notification.sortByDate(data);
      this.countNonReadable = this.getCountNonReadable();
    });
  }

  logout() {
    this.authService.logout();
  }

  openProfile() {
    this.authService.navigateToProfile();
  }
}
