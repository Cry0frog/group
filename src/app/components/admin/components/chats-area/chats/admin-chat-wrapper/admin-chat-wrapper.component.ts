import { ChatsWithCountedPages } from './../../../../../../models/chat/chatsWithCountedPages';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminChatService } from '../../../../service/admin-chat.service';
import { Chat } from './../../../../../../models/chat/common/chat';
import { ChatWrapperComponent } from './../../../../../shared-module/chat/chat-wrapper/chat-wrapper.component';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-admin-chat-wrapper',
  templateUrl: './admin-chat-wrapper.component.html',
  styleUrls: ['./admin-chat-wrapper.component.css']
})
export class AdminChatWrapperComponent implements OnInit {
  @ViewChild(ChatWrapperComponent, {static: false}) chatWrapper: ChatWrapperComponent;
  chats: Chat[];
  isLoadAll: boolean;

  constructor(private chatService: AdminChatService,
      private activeRoute: ActivatedRoute) {
    this.chats = [];
    this.chatsWithCountedPages = new ChatsWithCountedPages();
  }

  chatsWithCountedPages: ChatsWithCountedPages;

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

  nextPageChatsHandler(event) {
    ++this.chatsWithCountedPages.pageableParams.page;
    this.reloadChats();
  }

  reloadChats() {
    this.chatService.getAllMyChats(this.chatsWithCountedPages).subscribe((data: ChatsWithCountedPages) => {
      this.chats = this.chats.concat(data.chats);
      if(data.chats.length < this.chatsWithCountedPages.pageableParams.size) {
        this.isLoadAll = true;
      }
    });
  }

}
