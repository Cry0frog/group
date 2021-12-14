import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ActiveUrls } from 'src/app/auth/activeUrls';
import { EventService } from 'src/app/services/event.service';
import { NotificationService } from '../service/notification.service';
import { Observable, Subscription } from 'rxjs';
import { Notification } from 'src/app/models/notification/notification';
import { Chat } from 'src/app/models/chat/common/chat';
import { SessionStorageService } from 'angular-web-storage';
import { RegistrationNotComponent } from '../registration-not/registration-not.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css']
})
export class SidePanelComponent implements OnInit {

  @Input() chatWithAdmin: Chat;
  @Input() isJobNav: boolean;
  @Output() eventChangeNav = new EventEmitter();

  isLoggedIn$: Observable<boolean>;
  username: string;
  pageNotification: number;
  notifications: Notification[];
  countNonReadable: number;
  subscriptionLoggedIn: Subscription;
  userId: number = 0;
  resultCheck: number;
  isNewNotification: boolean;
  isAuthnticated: boolean;

  constructor(public router: Router,
    private eventService: EventService,
    private notificationService: NotificationService,
    private sessionStorage: SessionStorageService,
    private authService: AuthService,
    private dialog: MatDialog) {
      this.pageNotification = 0;
      this.notifications = [];
      this.countNonReadable = 0;
     }

  ngOnInit() {
    this.userId = this.authService.getCurrentId;
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.subscriptionLoggedIn = this.isLoggedIn$.subscribe(isLogged => {
      this.isAuthnticated = isLogged;
      if(isLogged) {
        this.username = this.authService.LoggedUser.name;

        this.eventService.connect();
        this.eventService.newNotification$.subscribe((notification: Notification) => {
          this.isNewNotification = true;
          this.notifications.unshift(notification);
          this.countNonReadable = this.getCountNonReadable();
        });

        this.reloadNotification();
      }
    });
  }

  changeNav() {
    this.eventChangeNav.emit();

    // if(this.router.url == "/home" || this.router.url == "/job") {
    //   this.closeModalWindow();
    // }

  }

  navigateByUrlHandler(url: string) {
    this.closeNotificateModalWindow();
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

  closeModalWindow() {
    //@ts-ignore
    document.querySelector(".close#closeModal").click();
  }

  closeNotificateModalWindow() {
    //@ts-ignore
    document.querySelector("#closeNotific").click();
  }

  logout() {
    this.closeModalWindow()
    this.authService.logout();
  }

  openCreateResume() {
    this.closeModalWindow();
    if(this.authService.LoggedUser.authenticated) {
      this.sessionStorage.set(AuthService.CREATE_RESUME, true);
      this.closeModalWindow();
      this.router.navigateByUrl(`/user/${this.authService.getCurrentId}`);
    }
    else {
      const dialogRef = this.dialog.open(RegistrationNotComponent, {
        width: '850px',
        data: "Чтобы создать резюме просим Вас зарегистрироваться или пройти авторизацию (если у вас уже существует аккаунт)"
      });
      dialogRef.afterClosed().subscribe((data: any) => {
        if(data != null) {
          this.closeModalWindow();
          this.router.navigateByUrl(ActiveUrls.LOGIN);
        }
      });
    }
  }

  openCreateVacancy() {
    this.closeModalWindow();
    this.router.navigateByUrl('job/create_vacancy');
  }

  openFindVacancies() {
    this.closeModalWindow();
    this.router.navigateByUrl('job/find_vacancy')
  }

  openFindResume() {
    this.closeModalWindow();
    this.router.navigateByUrl('job/find_resume')
  }

  openProfile() {
    this.closeModalWindow()
    this.authService.navigateToProfile();
  }

  openCreateTask() {
    this.closeModalWindow()
    this.authService.navigateToCreateNewTask();
  }

  openFindTask() {
    this.closeModalWindow()
    this.authService.navigateToFindTask();
  }

  openOurPartners() {
    this.closeModalWindow()
    this.authService.navigateToOpenOurPartners();
  }

  openPerformers() {
    this.closeModalWindow()
    this.authService.navigatePerformers();
  }

  openOurNews() {
    this.closeModalWindow()
    this.authService.navigateToOpenOurNews();
  }

  openAboutUs() {
    this.closeModalWindow()
    this.authService.navigateToAboutUs();
  }

  openPromotions() {
    this.closeModalWindow()
    this.authService.navigateToPromotions();
  }

  openLogin() {
    this.closeModalWindow();
    this.router.navigateByUrl(ActiveUrls.LOGIN);
  }

  openRegistration() {
    this.closeModalWindow();
    this.router.navigateByUrl(ActiveUrls.REGISTRATION);
  }

  openUsers() {
    this.closeModalWindow()
    this.authService.navigateToAdminUsers();
  }

  openCategories() {
    this.closeModalWindow()
    this.authService.navigateToAdminCategories();
  }

  openPayouts() {
    this.closeModalWindow()
    this.authService.navigateToAdminPayouts();
  }

  openCommissions() {
    this.closeModalWindow()
    this.authService.navigateToAdminCommissions();
  }

  openRates() {
    this.closeModalWindow()
    this.authService.navigateToAdminRates();
  }

  openStatistics() {
    this.closeModalWindow()
    this.authService.navigateToAdminStatistics();
  }

  openAdvertises() {
    this.closeModalWindow()
    this.authService.navigateToAdminAdvertises();
  }

  openArbitrations() {
    this.closeModalWindow()
    this.authService.navigateToAdminChats();
  }

  openFAQ() {
    this.closeModalWindow();
    this.router.navigateByUrl("/support/faq");
  }

  openReasonsBlocking() {
    this.closeModalWindow();
    this.router.navigateByUrl("/support/reasons_blocking");
  }

  openMotivationProgramm() {
    this.closeModalWindow();
    this.router.navigateByUrl("/support/motivation_programm");
  }

  openCommission() {
    this.closeModalWindow();
    this.router.navigateByUrl("/support/commission");
  }

  openPricing() {
    this.closeModalWindow();
    this.router.navigateByUrl("/support/pricing");
  }

  openSupport() {
    this.closeModalWindow();
    if(this.isAuthnticated) {
      this.sessionStorage.set('back_chat_url', this.router.url);
      return this.router.navigateByUrl(`/user/${this.authService.getCurrentId}/chat/${this.chatWithAdmin.id}`);
    }

    return this.router.navigateByUrl("/support");
  }
}
