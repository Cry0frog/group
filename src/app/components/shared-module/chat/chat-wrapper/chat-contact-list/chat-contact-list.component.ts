import { ChatService } from './../../../service/chat.service';
import { ChatArbitration } from './../../../../../models/chat/arbitration/chatArbitration';
import { Router } from '@angular/router';
import { User } from './../../../../../models/user/user';
import { AuthService } from './../../../../../auth/auth.service';
import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { BaseChat } from 'src/app/models/chat/baseChat';
import { UrlResolver } from 'src/app/components/partner/common/urlResolver';
import { ChatType } from 'src/app/models/chat/chatType';
import { ArbitrationResolutionType } from 'src/app/models/chat/arbitration/arbitrationResolutionType';

@Component({
  selector: 'app-chat-contact-list',
  templateUrl: './chat-contact-list.component.html',
  styleUrls: ['./chat-contact-list.component.css']
})
export class ChatContactListComponent implements OnInit {
  @Input() commonChats: BaseChat[];
  @Input() deletedChats: BaseChat[];
  @Input() isLoadAll: boolean;
  @Output() eventCallRefreshArbitration = new EventEmitter<number>();
  @Output() eventLoadingMore = new EventEmitter();

  arbitration: ChatArbitration;

  constructor(private authService: AuthService,
    private router: Router,
    private chatService: ChatService) { }

  ngOnInit() {}

  @HostListener('scroll', ['$event'])
  scrollHandler(event) {
    //@ts-ignore
    let pos = document.querySelector('.contact-block').scrollTop  + document.querySelector('.contact-block').offsetHeight;
    let max = document.querySelector('.contact-block').scrollHeight - 1;
    if(pos >= max && !this.isLoadAll) {
      this.eventLoadingMore.emit();
    }
  }

  getUser(chat: BaseChat): User {
    return chat.getUser(this.authService.getUserId);
  }

  getTask(chat: ChatArbitration): string {
    return chat.task.name;
  }

  isJoinedAdmin(): boolean {
    return this.arbitration.admin != null;
  }

  isAllArbitration(): boolean {
    return this.commonChats.some(el => el.type == ChatType.ARBITRATION);
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

  setChatArbitration(arbitration: ChatArbitration) {
    this.arbitration = arbitration;
  }

  isUser(): boolean {
    return this.authService.isUser();
  }

  isYouResolveTask(arbitration: ChatArbitration) {
    return (arbitration.approveToFinishInFavorCustomer != null &&
      arbitration.approveToFinishInFavorCustomer.includes(this.authService.getUserId))
      || (arbitration.approveToFinishInFavorPerformer != null &&
        arbitration.approveToFinishInFavorPerformer.includes(this.authService.getUserId));
  }

//#region "Chat Arbitration"

  requestAdmin(arbitrationId: number) {
    this.chatService.requestAdminHelp(arbitrationId).subscribe((data: BaseChat) => {
      this.callRefreshCurrentArbitration(arbitrationId);
    });
  }

  adminJoinedToArbitration(arbitration: ChatArbitration) {
    this.chatService.adminJoinedToArbitration(arbitration.id).subscribe((arbitrationId: number) => {
      this.callRefreshCurrentArbitration(arbitrationId);
    });
  }

  resolveInFavorCustomer(arbitrationId: number) {
    this.chatService.resolutionArbitration(arbitrationId, ArbitrationResolutionType.IN_FAVOR_CUSTOMER).subscribe(data => {
      this.callRefreshCurrentArbitration(arbitrationId);
    });
  }

  resolveInFavorPerformer(arbitrationId: number) {
    this.chatService.resolutionArbitration(arbitrationId, ArbitrationResolutionType.IN_FAVOR_PERFORMER).subscribe(data => {
      this.callRefreshCurrentArbitration(arbitrationId);
    });
  }

  adminResolveInFavorCustomer(arbitration: ChatArbitration) {
    this.chatService.adminResolveArbitration(arbitration.id,
      ArbitrationResolutionType.IN_FAVOR_CUSTOMER).subscribe(_ => {
        this.callRefreshCurrentArbitration(arbitration.id);
    });
  }

  adminResolveInFavorPerformer(arbitration: ChatArbitration) {
    this.chatService.adminResolveArbitration(arbitration.id,
      ArbitrationResolutionType.IN_FAVOR_PERFORMER).subscribe(el => {
        this.callRefreshCurrentArbitration(arbitration.id);
    });
  }

  cancelResolutionTask(arbitrationId: number) {
    let type = this.arbitration.approveToFinishInFavorCustomer.includes(this.authService.getUserId)
      ? ArbitrationResolutionType.IN_FAVOR_CUSTOMER
      : ArbitrationResolutionType.IN_FAVOR_PERFORMER;
    this.chatService.cancelResolutionArbitration(arbitrationId, type).subscribe(data => {
      this.callRefreshCurrentArbitration(arbitrationId);
    });
  }

  callRefreshCurrentArbitration(id: number) {
    this.eventCallRefreshArbitration.emit(id);
  }
//#endregion "Chat Arbitration"

isNotEmptyChats(chats: BaseChat[]): boolean {
  return chats != null && chats.length != 0
}
}
