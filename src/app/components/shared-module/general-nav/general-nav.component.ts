import { RegistrationNotComponent } from './../registration-not/registration-not.component';
import { ActiveUrls } from 'src/app/auth/activeUrls';
import { SessionStorageService } from 'angular-web-storage';
import { AuthService } from '../../../auth/auth.service';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ChatService } from '../service/chat.service';
import { Chat } from 'src/app/models/chat/common/chat';
import { ChatSupportComponent } from '../chat-support/chat-support.component';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-general-nav',
  templateUrl: './general-nav.component.html',
  styleUrls: ['./general-nav.component.css']
})
export class GeneralNavComponent implements OnInit/*, OnDestroy*/ {
  @ViewChild(ChatSupportComponent, {static: false}) chatSupportComponent: ChatSupportComponent;
  chatWithAdmin: Chat;
  @Output() eventIsJobNavigation = new EventEmitter<boolean>();
  isJobNavigation: boolean;

  constructor(private authService: AuthService,
      private chatService: ChatService,
      private sessionService: SessionStorageService,
      private dialog: MatDialog,
      private router: Router) {
    this.chatWithAdmin = new Chat();
  }

  ngOnInit() {
    this.isJobNavigation = this.router.url.match('job') != null ? true : this.sessionService.get(AuthService.GENERAL_NAV);
  }

  get isOpenChatWithAdmin(): boolean {
    return this.chatSupportComponent != null && this.chatSupportComponent.isOpenChatWithAdmin;
  }

  changeNavHandler(event) {
    this.changeNav();
  }

  isModile(): boolean {
    return this.authService.isMobileMode();
  }

  changeNav() {
    this.isJobNavigation = !this.isJobNavigation;
    this.eventIsJobNavigation.emit(this.isJobNavigation);
    this.sessionService.set(AuthService.GENERAL_NAV, this.isJobNavigation);

    if(this.router.url == "/home" && this.isJobNavigation) {
      window.open(`/job`, '_self');
    }

    if(this.router.url == "/job" && !this.isJobNavigation) {
      window.open(`/home`, '_self');
    }
  }

  getLinkToUpload():string {
    return navigator.userAgent.toLowerCase().indexOf("iphone") != -1
      ? "https://apps.apple.com/ru/app/gooddeal/id1507809289"
      : "https://play.google.com/store/apps/details?id=com.keeneye.gd"
  }

  openCreateTask() {
    this.authService.navigateToCreateNewTask();
  }

  openFindTask() {
    this.authService.navigateToFindTask();
  }

  openOurPartners() {
    this.authService.navigateToOpenOurPartners();
  }

  openPerformers() {
    this.authService.navigatePerformers();
  }

  openOurNews() {
    this.authService.navigateToOpenOurNews();
  }

  openAboutUs() {
    this.authService.navigateToAboutUs();
  }

  openPromotion() {
    this.authService.navigateToPromotions();
  }

  openCreateVacancy() {
    this.authService.navigateToCreateVacancy();
  }

  openFindVacancy() {
    this.authService.navigateToFindVacancy();
  }

  openFindResume() {
    this.authService.navigateToFindResume();
  }

  openCreateResume() {
    if(this.authService.LoggedUser.authenticated) {
      this.sessionService.set(AuthService.CREATE_RESUME, true);
      this.router.navigateByUrl(`/user/${this.authService.getCurrentId}`);
    }
    else {
      const dialogRef = this.dialog.open(RegistrationNotComponent, {
        width: '850px',
        data: "Чтобы создать резюме просим Вас зарегистрироваться или пройти авторизацию (если у вас уже существует аккаунт)"
      });
      dialogRef.afterClosed().subscribe((data: any) => {
        if(data != null) {
          this.router.navigateByUrl(ActiveUrls.LOGIN);
        }
      });
    }
  }

  getLinkToMainPage(): string {
    return this.isJobNavigation ? "/job" : "/home";
  }

  loadChatWithAdmin(event) {
    this.chatService.getChatWithAdmin().subscribe((data: Chat) => {
      this.chatWithAdmin = data;
    });
  }

  updateCountNewMessageFromAdminHandler(event) {
    ++this.chatWithAdmin.countNewMessages;
  }

  isHideYandexAdvertising(): boolean {
    return this.router.url.indexOf("remont_stroitelstvo") != -1 ||  this.router.url.indexOf("remont_tehniki") != -1
  }
}
