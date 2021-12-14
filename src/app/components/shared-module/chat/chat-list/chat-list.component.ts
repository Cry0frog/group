import { Vacancy } from './../../../../models/vacancy/vacancy';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseChat } from 'src/app/models/chat/baseChat';
import { UrlResolver } from 'src/app/components/partner/common/urlResolver';
import { ChatType } from 'src/app/models/chat/chatType';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/user/user';
import { ChatArbitration } from 'src/app/models/chat/arbitration/chatArbitration';
import { Chat } from 'src/app/models/chat/common/chat';
import { Task } from 'src/app/models/task/task';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {

  @Input() chats: BaseChat[];

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {}

  isUser(): boolean {
    return this.authService.isUser();
  }

  openChat(chat: BaseChat) {
    if(!this.isUser()) {
      this.router.navigate([UrlResolver.prepareChatUrl(this.router.url, `/${chat.id}`)]);
      return;
    }

    if(chat.type == ChatType.COMMON || chat.type == ChatType.DELETED) {
      this.router.navigate([UrlResolver.prepareChatUrl(this.router.url, `/chat/${chat.id}`)]);
    }
    else {
      this.router.navigate([UrlResolver.prepareChatUrl(this.router.url, `/arbitration/${chat.id}`)]);
    }
  }

  getUser(chat: BaseChat): User {
    return chat.getUser(this.authService.getUserId);
  }

  getTask(chat: ChatArbitration): string {
    return chat.task.name;
  }

  getTaskForCommonChat(chat: Chat): Task {
    return chat.task;
  }

  getVacancyForCommonChat(chat: Chat): Vacancy {
    return chat.vacancy;
  }

  isVacancy(chat: Chat): boolean {
    return chat.vacancy != null;
  }
}
