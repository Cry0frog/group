import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Chat } from 'src/app/models/chat/common/chat';
import { ChatMessage } from 'src/app/models/chat/common/chatMessage';
import { CommonOnlineConsultantChatComponent } from '../chat/common-online-consultant-chat/common-online-consultant-chat.component';

@Component({
  selector: 'app-chat-support',
  templateUrl: './chat-support.component.html',
  styleUrls: ['./chat-support.component.css']
})
export class ChatSupportComponent implements OnInit {

  @ViewChild(CommonOnlineConsultantChatComponent, {static: false}) commonOnlineConsultantChatComponent: CommonOnlineConsultantChatComponent;

  @Input() chatWithAdmin: Chat;

  url: string;
  curMessage: ChatMessage;
  isOpenChatWithAdmin: boolean;

  constructor(private authService: AuthService,
    private router: Router) {
    this.curMessage = new ChatMessage();
    this.isOpenChatWithAdmin = false;
  }

  ngOnInit() {
    this.url = window.location.pathname;
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        this.url = event.url;
      }
    });
  }

  isAdmin(): boolean {
    return this.isAuthnticated() ? this.authService.isAdmin() : false;
  }

  isAuthnticated(): boolean {
    return this.authService.LoggedUser.authenticated;
  }

  sendOnlineConsultantMessage() {
    this.commonOnlineConsultantChatComponent.sendOnlineConsultantMessage(this.curMessage);
  }

  isChatInUrl(): boolean {
    return this.url.includes('chat')
  }

  openOnlineConsultantChat() {
    this.isOpenChatWithAdmin = !this.isOpenChatWithAdmin
    this.chatWithAdmin.countNewMessages = 0;
  }
}
