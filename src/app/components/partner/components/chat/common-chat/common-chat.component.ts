import { element } from 'protractor';
import { ChatWrapperComponent } from './../../../../shared-module/chat/chat-wrapper/chat-wrapper.component';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from './../../../../shared-module/service/chat.service';
import { Chat } from './../../../../../models/chat/common/chat';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseChat } from 'src/app/models/chat/baseChat';
import { ChatType } from 'src/app/models/chat/chatType';

@Component({
  selector: 'app-common-chat',
  templateUrl: './common-chat.component.html',
  styleUrls: ['./common-chat.component.css']
})
export class CommonChatComponent implements OnInit {
  @ViewChild(ChatWrapperComponent, {static: false}) chatWrapper: ChatWrapperComponent;
  chats: BaseChat[];
  deletedChats: BaseChat[];

  constructor(private chatService: ChatService,
      private activeRoute: ActivatedRoute) {
    this.chats = [];
    this.deletedChats = [];
  }

  ngOnInit() {
    this.applyChangingChatIdParam();
    this.reloadChats();
  }

  applyChangingChatIdParam() {
    this.activeRoute.params.subscribe(params => {
      if(params['chatId']) {
        const chatId = parseInt(params['chatId']);
        this.reloadCurrenChat(chatId);
      }
    });
  }

  reloadCurrenChat(chatId: number) {
    this.chatService.getChatById(chatId).subscribe(data => {
      this.chatWrapper.reloadCurrentChat(data);
    });
  }

  reloadChats() {
    this.chatService.getMyChats().subscribe((data: Chat[]) => {
      this.chats = data.filter(chat => chat.type == ChatType.COMMON);
      this.deletedChats = data.filter(chat => chat.type == ChatType.DELETED);
    });
  }

}
