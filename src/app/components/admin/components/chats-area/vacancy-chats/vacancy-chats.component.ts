import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatsWithCountedPages } from 'src/app/models/chat/chatsWithCountedPages';
import { FilterChat } from 'src/app/models/chat/filterChat';
import { AdminChatService } from '../../../service/admin-chat.service';
import { CommonChatsComponent } from '../chats/common-chats/common-chats.component';

@Component({
  selector: 'app-vacancy-chats',
  templateUrl: './vacancy-chats.component.html',
  styleUrls: ['./vacancy-chats.component.css']
})
export class VacancyChatsComponent implements OnInit {
  @ViewChild(CommonChatsComponent, {static: false}) chatTemplate: CommonChatsComponent;

  typeChat = FilterChat.VACANCY;

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
    this.adminChatService.getVacancyChats(chatsWithCountedPages).subscribe((data: ChatsWithCountedPages) => {
      this.chatTemplate.reloadChats(data.chats);
      this.chatTemplate.chatsWithCountedPages.pageableParams.countedPages = data.pageableParams.countedPages;
    });
  }
}
