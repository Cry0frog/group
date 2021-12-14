import { FilterChat } from './../../../../../../models/chat/filterChat';
import { TaskComponentMode } from './../../../../../shared-module/tasks/task/taskComponentMode';
import { SessionStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import { Chat } from './../../../../../../models/chat/common/chat';
import { ChatService } from './../../../../../shared-module/service/chat.service';
import { CustomerInfo } from './../../../../../../models/task/customerInfo';
import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { Component, OnInit, Input } from '@angular/core';
import { UrlResolver } from 'src/app/components/partner/common/urlResolver';
import { TaskStatus } from 'src/app/models/task/taskStatus';
import { VacancyStatus } from 'src/app/models/vacancy/vacancyStatus';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-partner-card',
  templateUrl: './partner-card.component.html',
  styleUrls: ['./partner-card.component.css']
})
export class PartnerCardComponent implements OnInit {
  @Input() objectId: number;
  @Input() taskComponentMode: TaskComponentMode;
  @Input() isVacancyComponent: FilterChat;

  customerInfo: CustomerInfo;
  isLoaded: boolean;

  constructor(private partnerService: PartnerService,
    private chatService: ChatService,
    private router: Router,
    private sessionStorage: SessionStorageService,
    private authService: AuthService,) { }

  ngOnInit() {
    this.customerInfo = new CustomerInfo();
    this.reloadCustomerInfo();
  }

  isShowChatBtn(): boolean {
    return (this.customerInfo.taskStatus != null &&
      this.customerInfo.taskStatus != TaskStatus.FINISHED &&
      this.customerInfo.taskStatus != TaskStatus.FINISHED_IN_FAVOR_CUSTOMER &&
      this.customerInfo.taskStatus != TaskStatus.FINISHED_IN_FAVOR_PERFORMER &&
      this.customerInfo.taskStatus != TaskStatus.CANCELED_BY_PERFORMER &&
      this.customerInfo.taskStatus != TaskStatus.CANCELED_BY_PARTNER &&
      this.customerInfo.taskStatus != TaskStatus.PUBLISHED) ||
      (this.customerInfo.vacancyStatus != null &&
       this.customerInfo.vacancyStatus == VacancyStatus.PUBLISHED);
  }

  isPerformer(): boolean {
    return this.taskComponentMode == TaskComponentMode.PERFORMER;
  }

  isPartner(): boolean {
    return this.taskComponentMode == TaskComponentMode.PARTNER;
  }

  isVacancy(): boolean {
    return this.isVacancyComponent == FilterChat.VACANCY;
  }

  reloadCustomerInfo() {
    this.isLoaded = false;
    if(this.taskComponentMode == TaskComponentMode.PERFORMER) {
      this.partnerService.getMyPerformTaskCreatorInfo(this.objectId).subscribe((customerInfo: CustomerInfo) => {
        this.customerInfo = customerInfo;
        this.isLoaded = true;
      });
    }
    else if(this.taskComponentMode == TaskComponentMode.PARTNER) {
      this.partnerService.getMyPerformTaskPerformerInfo(this.objectId).subscribe((customerInfo: CustomerInfo) => {
        this.customerInfo = customerInfo;
        this.isLoaded = true;
      });
    } else if (this.isVacancyComponent == FilterChat.VACANCY){
      this.partnerService.getVacancyCreatorInfo(this.objectId).subscribe((customerInfo: CustomerInfo) => {
        this.customerInfo = customerInfo;
        this.isLoaded = true;
      });
    }
  }

  openChat() {
    if (this.isVacancyComponent == FilterChat.VACANCY) {
      this.chatService.getChatVacancyByParticipantId(this.objectId, 0).subscribe((chat: Chat) => {
        this.sessionStorage.set('back_chat_url', this.router.url);
        window.scrollTo(0, 0);
        this.router.navigate([UrlResolver.prepareChatUrl(`/user/${this.authService.getCurrentId}`, `/chat/${chat.id}`)]);
      });
    } else {
      this.chatService.getChatByParticipantId(this.objectId).subscribe((chat: Chat) => {
        this.sessionStorage.set('back_chat_url', this.router.url);
        this.router.navigate([UrlResolver.prepareChatUrl(this.router.url, `/chat/${chat.id}`)]);
      });
    }
  }

}
