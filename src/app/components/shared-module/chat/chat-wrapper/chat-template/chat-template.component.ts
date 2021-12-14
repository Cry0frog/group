import { FINISHED_CHAT_ARBITRATION_STATUSES } from './../../../../../models/chat/arbitration/chatArbitrationStatus';
import { Subscription } from 'rxjs';
import { CHAT_ARBITRATION_STATUS_TRANSLATE } from './../../../../../common/task.description';
import { ChatNotification } from './../../../../../models/chat/notification/chatNotification';
import { ChatEventService } from './../../../service/chat-event.service';
import { ChatArbitration } from './../../../../../models/chat/arbitration/chatArbitration';
import { SessionStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import { ChatService } from './../../../service/chat.service';
import { ChatMessage } from './../../../../../models/chat/common/chatMessage';
import { User } from './../../../../../models/user/user';
import { BaseChatMessage } from './../../../../../models/chat/baseChatMessage';
import { AuthService } from './../../../../../auth/auth.service';
import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { BaseChat } from 'src/app/models/chat/baseChat';
import { Chat } from 'src/app/models/chat/common/chat';
import { Offset } from 'src/app/common/offset';
import { ChatNotificationType } from 'src/app/models/chat/notification/chatNotificationType';
import { ChatArbitrationStatus } from 'src/app/models/chat/arbitration/chatArbitrationStatus';
import { ArbitrationResolutionType } from 'src/app/models/chat/arbitration/arbitrationResolutionType';
import { CommonDialogNotificationComponent } from '../../../common/common-dialog-notification/common-dialog-notification.component';
import { MatDialog } from '@angular/material';
import { ChatType } from 'src/app/models/chat/chatType';

@Component({
  selector: 'app-chat-template',
  templateUrl: './chat-template.component.html',
  styleUrls: ['./chat-template.component.css']
})
export class ChatTemplateComponent implements OnInit, OnDestroy {
  @Output() eventSetArbitration = new EventEmitter<BaseChat>();
  chat: BaseChat;
  messages: ChatMessage[];
  page: number;
  chatArbitrationStatusTranslate = CHAT_ARBITRATION_STATUS_TRANSLATE;

  curMessage: ChatMessage;
  isNoOneCurrent: boolean;
  subscriptionChat: Subscription;
  isClosed: boolean;

  isOpenOnlineConsultantChat: boolean;

  constructor(private authService: AuthService,
      private chatService: ChatService,
      private router: Router,
      private sessionStorage: SessionStorageService,
      private chatEventService: ChatEventService,
      public dialog: MatDialog) {
    this.messages = [];
    this.chat = new Chat();
    this.isClosed = false;
    this.curMessage = new ChatMessage();
  }

  ngOnInit() {
  }

  get isMobileMode() {
    return this.authService.isMobileMode();
  }

  ngOnDestroy() {
    this.destroyChatService();
  }

  destroyChatService() {
    this.chatEventService.dispose();
    /*if(this.subscriptionChat != null) {
      this.subscriptionChat.unsubscribe();
      this.subscriptionChat = null;
    }*/
  }

  autogrow(){
    const textArea = document.querySelector("textarea");
    if(textArea.scrollHeight <= 260) {
      textArea.style.overflow = 'hidden';
      textArea.style.height = '0px';
      textArea.style.height = textArea.scrollHeight + 'px';

      const chatContent = document.querySelector(".chat-content");
      if(textArea.scrollHeight > 45) {
        //@ts-ignore
        chatContent.style.height = this.isAdmin() ? `calc(100% - ${10 + textArea.scrollHeight}px)` :  `calc(100% - ${textArea.scrollHeight}px)`;
      }

      if(textArea.scrollHeight <= 45) {
        //@ts-ignore
        chatContent.style.height = 'calc(100% - 55px)';
      }
    }
    else {
      textArea.style.overflow = 'auto';
    }
  }

  isAdmin(): boolean {
    return !this.authService.isUser();
  }

  isCurrent(message: BaseChatMessage): boolean {
    return message.author.id == this.authService.getUserId;
  }

  getUser(chat: BaseChat): User {
    return chat.getUser(this.authService.getUserId);
  }

  getInitiator(chat: BaseChat): User {
    return chat.getInitiator();
  }

  getParticipant(chat: BaseChat): User {
    return chat.getParticipant();
  }

  getArbitrations(): ChatArbitration {
    return <ChatArbitration>this.chat;
  }

  isFinishedArbitration(): boolean {
    const chatArbitration = this.getArbitrations();
    return chatArbitration.status == ChatArbitrationStatus.SUCCESS ||
      chatArbitration.status == ChatArbitrationStatus.SUCCESS_IN_FAVOR_CUSTOMER ||
      chatArbitration.status == ChatArbitrationStatus.SUCCESS_IN_FAVOR_PERFORMER;
  }

  isSummernoteText(text: string): boolean {
    return text.indexOf('<p>') != -1;
  }

  determChatToFinished(chat: BaseChat) {
    if(!chat.isArbitration()) {
      return;
    }

    //@ts-ignore
    if(FINISHED_CHAT_ARBITRATION_STATUSES.includes(chat.status)) {
      this.isClosed = true;
    }
  }

  reloadCurrentChat(currentChat: BaseChat, isOpenOnlineConsultantChatWithAdmin: boolean) {

    this.isOpenOnlineConsultantChat = isOpenOnlineConsultantChatWithAdmin;
    //this.destroyChatService();
    this.chat = currentChat;
    this.eventSetArbitration.emit(this.chat);
    this.chatEventService.connect(this.chat.id);

    this.determChatToFinished(this.chat);

    //this.subscriptionChat = this.chatEventService.newMessageNotification$.subscribe((chatNotification: ChatNotification) => {
    this.chatEventService.newMessageNotification$.subscribe((chatNotification: ChatNotification) => {
      if(chatNotification.chatNotificationType == ChatNotificationType.NEW_MESSAGE) {
        this.checkMessage(chatNotification.message.id);
        this.messages.push(chatNotification.message);
        this.scrollToLastMessage();
      }
      else if(chatNotification.chatNotificationType == ChatNotificationType.MARK_AS_READ) {
        const messages = this.messages.filter(el => el.id == chatNotification.message.id);
        if(messages.length == 0) {
          return;
        }
        const message: ChatMessage = messages[0];
        if(message.saw == null) {
          message.saw = [];
        }
        if(!message.saw.includes(chatNotification.userId)) {
          message.saw.push(chatNotification.userId);
        }
      }
      else if(chatNotification.chatNotificationType == ChatNotificationType.RESOLUTION_CHANGING_ACCEPT) {
        const arbitration: ChatArbitration = <ChatArbitration>this.chat;

        if(chatNotification.arbitrationResolutionType == ArbitrationResolutionType.IN_FAVOR_CUSTOMER) {
          if(arbitration.approveToFinishInFavorCustomerUser == null) {
            arbitration.approveToFinishInFavorCustomerUser = [];
          }
          arbitration.approveToFinishInFavorCustomerUser.push(
            arbitration.getApproveToFinishedUser(chatNotification.userId)
          );
        }
        else {
          if(arbitration.approveToFinishInFavorPerformerUser == null) {
            arbitration.approveToFinishInFavorPerformerUser = [];
          }
          arbitration.approveToFinishInFavorPerformerUser.push(
            arbitration.getApproveToFinishedUser(chatNotification.userId)
          );
        }

        this.eventSetArbitration.emit(this.chat);
      }
      else if(chatNotification.chatNotificationType == ChatNotificationType.RESOLUTION_CHANGING_CANCEL) {
        const arbitration: ChatArbitration = <ChatArbitration>this.chat;

        if(chatNotification.arbitrationResolutionType == ArbitrationResolutionType.IN_FAVOR_CUSTOMER) {
          arbitration.approveToFinishInFavorCustomerUser = arbitration.approveToFinishInFavorCustomerUser
            .filter(el => el.id != chatNotification.userId);
        }
        else {
          arbitration.approveToFinishInFavorPerformerUser = arbitration.approveToFinishInFavorPerformerUser
            .filter(el => el.id != chatNotification.userId);
        }

        this.eventSetArbitration.emit(this.chat);
      }
      else if(chatNotification.chatNotificationType == ChatNotificationType.TASK_RESOLVED) {
        const arbitration: ChatArbitration = <ChatArbitration>this.chat;

        if(chatNotification.arbitrationResolutionType == ArbitrationResolutionType.IN_FAVOR_CUSTOMER) {
          arbitration.status = ChatArbitrationStatus.SUCCESS_IN_FAVOR_CUSTOMER;
        }
        else if(chatNotification.arbitrationResolutionType == ArbitrationResolutionType.IN_FAVOR_PERFORMER) {
          arbitration.status = ChatArbitrationStatus.SUCCESS_IN_FAVOR_PERFORMER;
        }
        else {
          arbitration.status = ChatArbitrationStatus.SUCCESS;
        }

        arbitration.task.status = chatNotification.taskStatus;
        this.eventSetArbitration.emit(this.chat);
      }
    });
    this.reloadMessages();
  }

//#region "Messages"
  getSortedMessages(messages: BaseChatMessage[]): BaseChatMessage[] {
    return messages.sort((a: BaseChatMessage, b: BaseChatMessage) =>
      (a.id > b.id) ? 1
      : (a.id === b.id) ? 0
      : -1
    );
  }

  reloadMessages() {
    if(this.chat != null && this.chat.id != null) {
      this.page = 0;
      this.chatService.getMessages(this.chat.id, this.page++).subscribe((data: ChatMessage[]) => {
        this.messages = data;
        this.scrollToLastMessage();
      });
    }
  }

  loadMore() {
    this.chatService.getMessages(this.chat.id, this.page++).subscribe((data: ChatMessage[]) => {
      this.messages = this.messages.concat(data)
    });
  }

  scrollToLastMessage() {
    setTimeout(() => {
      const el = document.getElementById("scroll_div");
      el.scrollTo(0, el.scrollHeight);
    }, 300);
  }

  handleAddShortCommentError(error: any) {
    this.curMessage.isError = true;
    this.curMessage.errors = error.errors;
  }

  sendMessage(event) {
    if(this.isMobileMode && event != null) {
      return;
    }

    if(event != null) {
      event.preventDefault();
    }
    if(this.curMessage.message == null || this.curMessage.message == '' || this.curMessage.message.length > 2000) {
      return;
    }
    //const msg = new ChatMessage();
    //msg.message = this.curMessage;
    //msg.refChatId = this.chat.id;
    this.curMessage.isError = false;
    this.curMessage.refChatId = this.chat.id;

    this.chatService.sendMessage(this.curMessage, this.chat.type).subscribe((data: any )=> {
      if (data.notValid) {
        if (this.chat.type == ChatType.ARBITRATION) {
          this.dialogErrorMessage('Арбитраж закрыт, Вы больше не можете отправлять сюда сообщения');
          return;
        }
        else {
          this.dialogErrorMessage('Вы не можете отправлять сообщение в этот чат, так как задача не в статусе "В процессе"');
          return;
        }
      }
      if(data == null) {
        this.isClosed = true;
        return;
      }
      if(data.ok != null && data.ok == false) {
        this.handleAddShortCommentError(data.error);
        return;
      }

      this.sessionStorage.remove('send_cur_message');
      this.reloadMessages();

     if(!this.isOpenOnlineConsultantChat) {
      const  textArea = document.querySelector("textarea");
      textArea.style.height = '45px';

      const chatContent = document.querySelector(".chat-content");
      //@ts-ignore
      chatContent.style.height = 'calc(100% - 55px)';
     }

    });

    this.curMessage.message = '';
  }
//#endregion "Messages"

  goBack() {
    const backUrl = this.sessionStorage.get('back_chat_url');
    this.sessionStorage.remove('back_chat_url');
    if(backUrl != null && backUrl != '') {
      this.router.navigate([backUrl]);
    }
    else {
      if(this.authService.isUser()) {
        const arbitration = this.getArbitrations();
        if(arbitration != null && arbitration.task != null) {
          if(arbitration.task.creatorId == this.authService.getCurrentId) {
            return this.router.navigate([`/user/${this.authService.getCurrentId}/my-tasks/${arbitration.task.id}`]);
          }
          else if(arbitration.task.performerId == this.authService.getCurrentId){
            return this.router.navigate([`/user/${this.authService.getCurrentId}/executor-tasks/${arbitration.task.id}`]);
          }
        }

        this.router.navigate([`/user/${this.authService.getCurrentId}`]);
      }
      else {
        this.router.navigate([`/admin/chats`]);
      }
    }
  }

  callFileChoosing() {
    document.getElementById('fileInputUloadResource').click();
  }

  fileChanged(files: FileList) {
    let formData = new FormData();
    formData.append('image', files.item(0), files.item(0).name);

    const msg = new ChatMessage();
    msg.message = this.curMessage.message;
    msg.refChatId = this.chat.id;
    msg.offset = Offset.getCurTimeZone();
    formData.append('message', JSON.stringify(msg));
    formData.append('offset', msg.offset);
    this.chatService.uploadFile(formData, this.chat.id, this.chat.type).subscribe((el: any) => {
      if (el == -1) {
        if (this.chat.type == ChatType.ARBITRATION) {
          this.isClosed = true;
          this.dialogErrorMessage('Арбитраж закрыт, Вы больше не можете отправлять сюда сообщения');
        }
        else {
          this.dialogErrorMessage('Вы не можете отправлять сообщение в этот чат, так как задача не в статусе "В процессе"');
        }
      } else {
        this.reloadMessages();
      }
    });
    return false;
  }

  loadFile(msg: BaseChatMessage) {
    this.chatService.download(this.chat.id, msg.id, this.chat.type, msg.attachment);
  }

  refreshCurrentArbitration(id: number) {
    this.chatService.getArbitrationById(id).subscribe((data: ChatArbitration) => {
      this.chat = data;
      this.eventSetArbitration.emit(this.chat);
      this.determChatToFinished(this.chat);
    });
  }

  checkMessage(id) {
    this.chatService.checkChatMessage(id).subscribe(data => {});
  }

  sendOnlineConsultantMessage(curMessage: ChatMessage) {
    this.curMessage = curMessage;
    this.sendMessage(null);
  }

  dialogErrorMessage(message: string) {
    const dialogRef = this.dialog.open(CommonDialogNotificationComponent, {
      width: '500px',
      data: message
      });
      dialogRef.afterClosed().subscribe(data => {
      window.location.reload(true);
    });
  }
}
