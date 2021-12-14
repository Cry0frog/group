import { ArbitrationResolutionType } from './../../../models/chat/arbitration/arbitrationResolutionType';
import { AdminApiUrls } from './../../admin/adminApiUrls';
import { ChatType } from './../../../models/chat/chatType';
import { ChatArbitration } from './../../../models/chat/arbitration/chatArbitration';
import { ChatMessage } from './../../../models/chat/common/chatMessage';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiUrls } from './../../../auth/activeUrls';
import { Observable } from 'rxjs';
import { Chat } from './../../../models/chat/common/chat';
import { AuthService } from './../../../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseHandlerService } from './../../../common/services/service.base.handler';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver'
import { SessionStorageService } from 'angular-web-storage';
import { ResorceUploadState } from 'src/app/models/common/resorceUploadState';

@Injectable({
  providedIn: 'root'
})
export class ChatService extends BaseHandlerService {

  constructor(private http: HttpClient,
    private sessionStorage: SessionStorageService,
    protected auth: AuthService
  ) {
    super(auth);
  }

//#region "Chats"
  getMyChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(ApiUrls.CHATS_COMMON, BaseHandlerService.httpOptions).pipe(
      map((chats: Chat[]) => chats.map(chat => Chat.convertToObj(chat))),
      catchError(this.handleError('getMyChats', []))
    );
  }

  getChatByParticipantId(taskId: number): Observable<Chat> {
    return this.http.get<Chat>(`${ApiUrls.CHAT_COMMON}${taskId}`, BaseHandlerService.httpOptions).pipe(
      map((chat: Chat) => Chat.convertToObj(chat)),
      catchError(this.handleError('getCommonChatByParticipantId', null))
    );
  }

  getChatVacancyByParticipantId(vacancyId: number, resumeId: number): Observable<Chat> {
    return this.http.get<Chat>(`${ApiUrls.CHAT_COMMON_VACANCY}${vacancyId}?resumeId=${resumeId}`, BaseHandlerService.httpOptions).pipe(
      map((chat: Chat) => Chat.convertToObj(chat)),
      catchError(this.handleError('getChatVacancyByParticipantId', null))
    );
  }

  getChatById(chatId: number): Observable<Chat> {
    return this.http.get<Chat>(`${ApiUrls.CHAT}${chatId}`, BaseHandlerService.httpOptions).pipe(
      map((chat: Chat) => Chat.convertToObj(chat)),
      catchError(this.handleError('getChatById', null))
    );
  }
//#endregion "Chats"
  uploadFile(fileToUpload, chatId: number, type: ChatType): Observable<ResorceUploadState> {
    return this.http.post<ChatArbitration>(`${ApiUrls.CHAT_COMMON_UPLOAD_FILE}${chatId}/${type}`, fileToUpload).pipe(
      catchError(this.handleError('uploadFile', null))
    );
  }

  download(chatId: number, msgId: number, chatType: ChatType, attachment: string) {
    let url = `${ApiUrls.CHAT_COMMON_GET_FILE}${chatId}/${chatType}/${msgId}`;
    this.http.get(url, { responseType: 'blob'}).subscribe((res) => {
      const file = new Blob([res], {
        type: 'application/octet-stream',
      });
      saveAs(file, attachment);
      return res;
    }, error => {
      let alert: any = {
        title: 'Notify Title',
        body: 'Notify Body',
      };
      alert.body = error.error.message || JSON.stringify(error.error);
      alert.title = error.error.error;
      alert.position = 'rightTop';
      console.log(error);
      return error;
    });

  }

  //TODO compare with download
  getFile(chatId: number, msgId: number, chatType: ChatType, attachment: string) {
    let url = `${ApiUrls.CHAT_COMMON_GET_FILE}${chatId}/${chatType}/${msgId}`;
    this.http.get(url, { responseType: 'blob'}).pipe(
      catchError(this.handleError('getFile', null))
    ).subscribe(el => {
      const file = new Blob([el], {
        type: 'application/pdf',
      });
      saveAs(file, attachment);
    });
  }

//#region "Arbitrations"
  getMyArbitrations(): Observable<ChatArbitration[]> {
    return this.http.get<ChatArbitration[]>(ApiUrls.CHATS_ARBITRATION, BaseHandlerService.httpOptions).pipe(
      map((chats: ChatArbitration[]) => chats.map(chat => ChatArbitration.convertToObj(chat))),
      catchError(this.handleError('getArbitrations', []))
    );
  }

  getArbitrationById(chatId: number): Observable<ChatArbitration> {
    return this.http.get<ChatArbitration>(`${ApiUrls.CHAT_ARBITRATION}${chatId}`, BaseHandlerService.httpOptions).pipe(
      map((chat: ChatArbitration) => ChatArbitration.convertToObj(chat)),
      catchError(this.handleError('getArbitrationById', null))
    );
  }

  getRequestArbitration(taskId: number): Observable<ChatArbitration> {
    return this.http.post<ChatArbitration>(`${ApiUrls.CHAT_ARBITRATION}${taskId}`, BaseHandlerService.httpOptions).pipe(
      map((chat: ChatArbitration) => ChatArbitration.convertToObj(chat)),
      catchError(this.handleError('getRequestArbitration', null))
    );
  }

  resolutionArbitration(arbitrationId: number, arbitrationResolutionType: ArbitrationResolutionType): Observable<ChatArbitration> {
    return this.http.put<ChatArbitration>(`${ApiUrls.CHATS_ARBITRATION_RESOLUTION}${arbitrationId}/${arbitrationResolutionType}`,
      BaseHandlerService.httpOptions).pipe(
        catchError(this.handleError('resolutionArbitration', null))
    );
  }

  cancelResolutionArbitration(arbitrationId: number, type: ArbitrationResolutionType): Observable<ChatArbitration> {
    return this.http.put<ChatArbitration>(`${ApiUrls.CHATS_ARBITRATION_CANCEL_RESOLUTION}${arbitrationId}/${type}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('cancelResolutionArbitration', null))
    );
  }

  requestAdminHelp(arbitrationId: number): Observable<ChatArbitration> {
    return this.http.put<ChatArbitration>(`${ApiUrls.CHATS_ARBITRATION_REQUEST_ADMIN_HELP}${arbitrationId}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('requestAdminHelp', null))
    );
  }

  adminJoinedToArbitration(arbitrationId: number): Observable<number> {
    return this.http.put<ChatArbitration>(`${AdminApiUrls.ARBITRATIONS_JOIN_ADMIN}${arbitrationId}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('adminJoinedToArbitration', null))
    );
  }

  adminResolveArbitration(arbitrationId: number, type: ArbitrationResolutionType): Observable<number> {
    return this.http.put<ChatArbitration>(`${AdminApiUrls.RESOLVE_ARBITRATION}${arbitrationId}/${type}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('adminResolveArbitration', null))
    );
  }

//#endregion "Arbitrations"

//#region "Messages"
  getMessages(chatId: number, page: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${ApiUrls.CHAT_MESSAGES}${chatId}/${page}`, BaseHandlerService.httpOptions).pipe(
      map((msgs: ChatMessage[]) => msgs.map(msg => ChatMessage.convertToObj(msg))),
      catchError(this.handleError('getMessages', []))
    );
  }

  sendMessage(message: ChatMessage, chatType: ChatType): Observable<any> {
    message.prepareBeforeSave();
    return this.http.post<ChatMessage>(`${ApiUrls.CHAT}${chatType}`, message, BaseHandlerService.httpOptions)
      .pipe(
        map((msg: ChatMessage) => ChatMessage.convertToObj(msg)),
        //catchError(this.handleError('sendMessage', null))
        tap((data: any) => this.log('')),
        catchError(this.handleSendMessage('sendMessage', message, null))
    );
  }

  protected handleSendMessage<T>(operation = 'operation', actualData: ChatMessage,
  result?: T) {
    return this.handleErrorWithHandler(operation, null,
      () => {
        this.sessionStorage.set('send_cur_message', JSON.stringify(actualData));
      }
    );
  }

  updateMessage(message: ChatMessage): Observable<ChatMessage> {
    message.prepareBeforeSave();
    return this.http.put<ChatMessage>(ApiUrls.CHAT, message, BaseHandlerService.httpOptions)
      .pipe(
        map((msg: ChatMessage) => ChatMessage.convertToObj(msg)),
        catchError(this.handleError('updateMessage', null))
    );
  }

  markAsRead(chatId: number, mesageId: number): Observable<ChatMessage> {
    return this.http.put<ChatMessage>(`${ApiUrls.CHAT_MARK_AS_READ}${chatId}/${mesageId}`, BaseHandlerService.httpOptions)
      .pipe(
        map((msg: ChatMessage) => ChatMessage.convertToObj(msg)),
        catchError(this.handleError('updateMessage', null))
    );
  }

  //#endregion "Messages"

  getChatWithAdmin(): Observable<Chat> {
    return this.http.get<Chat>(`${ApiUrls.CHAT_COMMON_WITH_ADMIN}`, BaseHandlerService.httpOptions).pipe(
      map((chat: Chat) => Chat.convertToObj(chat)),
      catchError(this.handleError('getChatWithAdmin', null))
    );
  }

  checkChat(id: number): Observable<number> {
    return this.http.get<Chat>(`${ApiUrls.CHECK_CHAT}/${id}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('checkChat', null))
    );
  }

  checkChatMessage(id: number): Observable<number> {
    return this.http.get<number>(`${ApiUrls.CHECK_CHAT_MESSAGE}/${id}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('checkChatMessage', null))
    );
  }

}
