import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import { OnlineConsultantChatWrapperComponent } from 'src/app/components/shared-module/chat/online-consultant-chat-wrapper/online-consultant-chat-wrapper.component';
import { ChatService } from 'src/app/components/shared-module/service/chat.service';
import { Chat } from 'src/app/models/chat/common/chat';
import { ChatMessage } from 'src/app/models/chat/common/chatMessage';

@Component({
  selector: 'app-common-online-consultant-chat',
  templateUrl: './common-online-consultant-chat.component.html',
  styleUrls: ['./common-online-consultant-chat.component.css']
})

export class CommonOnlineConsultantChatComponent implements OnInit {

  @ViewChild(OnlineConsultantChatWrapperComponent, {static: false}) onlineConsultantChatWrapperComponent: OnlineConsultantChatWrapperComponent;

  @Input() chatWithAdmin: Chat;

  constructor(private router: Router,
    private sessionStorage: SessionStorageService)
  {}

  ngOnInit() {
    setTimeout(() => this.reloadChatWithAdmin(), 200);
  }

  sendOnlineConsultantMessage(curMessage: ChatMessage){
    this.onlineConsultantChatWrapperComponent.sendOnlineConsultantMessage(curMessage);
  }

  reloadChatWithAdmin() {
    this.sessionStorage.set('back_chat_url', this.router.url);
    this.onlineConsultantChatWrapperComponent.reloadCurrentChat(this.chatWithAdmin);
  }
}
