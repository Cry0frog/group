import { CommonChatsComponent } from '../common-chats/common-chats.component';
import { AdminChatService } from '../../../../service/admin-chat.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatsWithCountedPages } from 'src/app/models/chat/chatsWithCountedPages';
import { FilterChat } from 'src/app/models/chat/filterChat';

@Component({
  selector: 'app-task-chats',
  templateUrl: './task-chats.component.html',
  styleUrls: ['./task-chats.component.css']
})
export class TaskChatsComponent implements OnInit {
  @ViewChild(CommonChatsComponent, {static: false}) chatTemplate: CommonChatsComponent;
  typeChat = FilterChat.TASK;

  constructor(private adminChatService: AdminChatService) {
    this.chatsWithCountedPages = new ChatsWithCountedPages();
  }

  chatsWithCountedPages: ChatsWithCountedPages;


  loadChatsHandler(event: ChatsWithCountedPages) {
    this.getChats(event);
  }

  ngOnInit() {
    this.getChats(this.chatsWithCountedPages);
  }

  getChats(chatsWithCountedPages) {
    this.adminChatService.getTaskChats(chatsWithCountedPages).subscribe((data: ChatsWithCountedPages) => {
      this.chatTemplate.reloadChats(data.chats);
      this.chatTemplate.chatsWithCountedPages.pageableParams.countedPages = data.pageableParams.countedPages;
    });
  }
}
