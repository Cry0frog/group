import { AuthService } from 'src/app/auth/auth.service';
import { SessionStorageService } from 'angular-web-storage';
import { AdminChatService } from '../../../../service/admin-chat.service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Chat } from './../../../../../../models/chat/common/chat';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ChatsWithCountedPages } from 'src/app/models/chat/chatsWithCountedPages';
import { BaseLazyLoadingService } from 'src/app/services/base-lazy-loading.service';
import { PageableParams } from 'src/app/models/pageable/PageableParams';
import { SortParams } from 'src/app/models/sort/sortParams';
import { FilterChat } from 'src/app/models/chat/filterChat';

@Component({
  selector: 'app-common-chats',
  templateUrl: './common-chats.component.html',
  styleUrls: ['./common-chats.component.css']
})
export class CommonChatsComponent implements OnInit {
  @Input() typeChat: FilterChat;
  @Output() reloadChatsEvent = new EventEmitter<ChatsWithCountedPages>();

  displayedColumns: string[] = ['id', 'initiator', 'participant', 'creationDate', 'lastActiveInitiator', 'lastActiveParticipant', 'operations'];
  dataSource: MatTableDataSource<Chat>;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  chats: Chat[];

  chatsWithCountedPages: ChatsWithCountedPages;

  constructor(private router: Router,
      private chatService: AdminChatService,
      private sessionStorage: SessionStorageService,
      private authService: AuthService,
      private baseLazyLoadingService: BaseLazyLoadingService) {
    this.chats = [];
    this.chatsWithCountedPages = new ChatsWithCountedPages();
  }

  isVacancy(): boolean {
    return this.typeChat == FilterChat.VACANCY;
  }

  isTask(): boolean {
    return this.typeChat == FilterChat.TASK;
  }

  isMy(): boolean {
    return this.typeChat == FilterChat.MY;
  }

  ngOnInit() {
  }

  sortChange(event) {
    this.chatsWithCountedPages.sortParams = this.baseLazyLoadingService.sortChange(event, this.chatsWithCountedPages.sortParams);
    this.chatsWithCountedPages.pageableParams = new PageableParams();
    this.reloadChatsEvent.emit(this.chatsWithCountedPages);
  }

  public handlePage(event: any) {
    this.chatsWithCountedPages.pageableParams = this.baseLazyLoadingService.handlePage(event, this.chatsWithCountedPages.pageableParams);
    this.reloadChatsEvent.emit(this.chatsWithCountedPages);
  }

  applyFilter(filterValue: string) {
    filterValue === "" ? this.chatsWithCountedPages.search = null : this.chatsWithCountedPages.search = filterValue;
    this.chatsWithCountedPages.search = filterValue;
    this.chatsWithCountedPages.pageableParams = new PageableParams();
    this.chatsWithCountedPages.sortParams = new SortParams();
    this.reloadChatsEvent.emit(this.chatsWithCountedPages);
  }

  reloadChats(arbitrations: Chat[]) {
    this.dataSource = new MatTableDataSource(arbitrations);
    this.dataSource.sort = this.sort;
  }

  isYourChat(row: Chat): boolean {
    return (row.initiator != null && row.initiator.id == this.authService.getUserId)
      || (row.participant != null && row.participant.id == this.authService.getUserId);
  }

  goToChat(row: Chat) {
    let participantId = -1;
    if(row.participant.id == this.authService.getUserId) {
      participantId = row.initiator.id;
    }
    else if(row.initiator.id == this.authService.getUserId) {
      participantId = row.participant.id;
    }
    else {
      this.chatService.getChatById(row.id).subscribe((chat: Chat) => {
        this.sessionStorage.set('back_chat_url', this.router.url);
        this.router.navigate([`admin/chats/${chat.id}`]);
      });
      return;
    }
    this.chatService.getChatByParticipantId(participantId).subscribe((chat: Chat) => {
      this.sessionStorage.set('back_chat_url', this.router.url);
      this.router.navigate([`admin/chats/${chat.id}`]);
    });
  }

}
