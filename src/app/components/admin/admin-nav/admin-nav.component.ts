import { NotificationType } from 'src/app/models/notification/notificationType';
import { Router } from '@angular/router';
import { NotificationService } from './../../shared-module/service/notification.service';
import { EventService } from './../../../services/event.service';
import { AuthService } from './../../../auth/auth.service';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Notification } from 'src/app/models/notification/notification';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.css']
})
export class AdminNavComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  username: string;
  pageNotification: number;
  notifications: Notification[];
  countNonReadable: number;
  subscriptionLoggedIn: Subscription;
  userId: number;

  constructor(private authService: AuthService,
      private notificationService: NotificationService,
      private eventService: EventService,
      private router: Router) {
    this.notifications = [];
    this.userId = 0;
    this.countNonReadable = 0;
    this.pageNotification = 0;
  }

  ngOnInit() {

    window.addEventListener('storage', (event) => {
      if(event.key == "auth" && event.newValue == null) {
        location.reload();
      }
    });

    this.userId = this.authService.getCurrentId;
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.isLoggedIn$.subscribe(isLogged => {
      if(isLogged) {
        this.username = this.authService.LoggedUser.name;

        this.eventService.connect();
        this.eventService.newNotification$.subscribe((notification: Notification) => {
          this.notifications.unshift(notification);
          this.countNonReadable = this.getCountNonReadable();
        });
        this.reloadNotification();
      }
    });
  }

  navigateByUrlHandler(url: string) {
    this.router.navigateByUrl(url);
  }

  updateCountNonReadableHandler(notifications: Notification[]) {
    this.notifications = notifications;
    this.countNonReadable = this.getCountNonReadable();
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

  openDefaultPage() {
    this.authService.navigateToProfile();
  }

  getCountNonReadable(): number {
    return this.notifications != null
      ? this.notifications.filter(el => !el.checked).length
      : 0;
  }

  openUsers() {
    this.authService.navigateToAdminUsers();
  }

  openCategories() {
    this.authService.navigateToAdminCategories();
  }

  openPayouts() {
    this.authService.navigateToAdminPayouts();
  }

  openCommissions() {
    this.authService.navigateToAdminCommissions();
  }

  openRates() {
    this.authService.navigateToAdminRates();
  }

  openStatistics() {
    this.authService.navigateToAdminStatistics();
  }

  openAdvertises() {
    this.authService.navigateToAdminAdvertises();
  }

  openArbitrations() {
    this.authService.navigateToAdminChats();
  }

  openDevelopment() {
    this.authService.navigateToDevelopment();
  }

  openTasksMonitoring() {
    this.authService.navigateToTasksMonitoring();
  }

  openJobs() {
    this.authService.navigateToJobs();
  }

  openPromotion() {
    this.authService.navigateToAdminPromotion();
  }

  openNews() {
    this.authService.navigateToAdminNews();
  }
}
