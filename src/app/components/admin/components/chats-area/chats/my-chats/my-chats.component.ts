import { ChatsWithCountedPages } from './../../../../../../models/chat/chatsWithCountedPages';
import { CommonChatsComponent } from './../common-chats/common-chats.component';
import { AdminChatService } from '../../../../service/admin-chat.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FilterChat } from 'src/app/models/chat/filterChat';

@Component({
  selector: 'app-my-chats',
  templateUrl: './my-chats.component.html',
  styleUrls: ['./my-chats.component.css']
})
export class MyChatsComponent implements OnInit {
  @ViewChild(CommonChatsComponent, {static: false}) chatTemplate: CommonChatsComponent;
  typeChat = FilterChat.MY;

  chatsWithCountedPages: ChatsWithCountedPages;

  constructor(private adminChatService: AdminChatService) {
    this.chatsWithCountedPages = new ChatsWithCountedPages();
  }

  ngOnInit() {
    this.getChats(this.chatsWithCountedPages);
  }

  loadChatsHandler(event: ChatsWithCountedPages) {
    this.getChats(event);
  }

  getChats(chatsWithCountedPages) {
    this.adminChatService.getAllMyChats(chatsWithCountedPages).subscribe((data: ChatsWithCountedPages) => {
      this.chatTemplate.reloadChats(data.chats);
      this.chatTemplate.chatsWithCountedPages.pageableParams.countedPages = data.pageableParams.countedPages;
    });
  }
}
