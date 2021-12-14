import { ChatsWithCountedPages } from 'src/app/models/chat/chatsWithCountedPages';
import { Chat } from '../../../models/chat/common/chat';
import { ChatArbitration } from '../../../models/chat/arbitration/chatArbitration';
import { AdminApiUrls } from '../adminApiUrls';
import { map, catchError } from 'rxjs/operators';
import { BaseHandlerService } from '../../../common/services/service.base.handler';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ArbitrationsWithCountedPages } from 'src/app/models/chat/arbitrationsWithCountedPages';

@Injectable({
  providedIn: 'root'
})
export class AdminChatService extends BaseHandlerService {

  constructor(private http: HttpClient,
      protected auth: AuthService){
    super(auth);
  }

//#region 'Admin chat'
  getTaskChats(params: ChatsWithCountedPages): Observable<ChatsWithCountedPages>  {
    return this.http.get<ChatsWithCountedPages>(
        `${AdminApiUrls.CHATS_TASK}/${params.pageableParams.page}/${params.pageableParams.size}/${params.sortParams.typeSort}/${params.sortParams.nameSort}?search=${params.search}`,
        BaseHandlerService.httpOptions
      ).pipe(
        map(chat => ChatsWithCountedPages.convertToObj(chat)),
        catchError(this.handleError('getTaskChats', null)
      )
    );
  }

  getVacancyChats(params: ChatsWithCountedPages): Observable<ChatsWithCountedPages>  {
    return this.http.get<ChatsWithCountedPages>(
        `${AdminApiUrls.CHATS_VACANCY}/${params.pageableParams.page}/${params.pageableParams.size}/${params.sortParams.typeSort}/${params.sortParams.nameSort}?search=${params.search}`,
        BaseHandlerService.httpOptions
      ).pipe(
        map(chat => ChatsWithCountedPages.convertToObj(chat)),
        catchError(this.handleError('getTaskChats', null)
      )
    );
  }

  getAllMyChats(params: ChatsWithCountedPages): Observable<ChatsWithCountedPages>  {
    return this.http.get<ChatsWithCountedPages>(
        `${AdminApiUrls.ALL_MY_CHATS}/${params.pageableParams.page}/${params.pageableParams.size}/${params.sortParams.typeSort}/${params.sortParams.nameSort}?search=${params.search}`,
        BaseHandlerService.httpOptions).pipe(
      map(chat => ChatsWithCountedPages.convertToObj(chat)),
      catchError(this.handleError('getAllMyChats', null))
    );
  }

  getChatById(chatId: number): Observable<Chat> {
    return this.http.get<Chat>(`${AdminApiUrls.CHAT}${chatId}`, BaseHandlerService.httpOptions).pipe(
      map((chat: Chat) => Chat.convertToObj(chat)),
      catchError(this.handleError('getChatById', null))
    );
  }

  getChatByParticipantId(participantId: number): Observable<Chat> {
    return this.http.get<Chat>(`${AdminApiUrls.CHAT_COMMON}${0}?participantId=${participantId}`, BaseHandlerService.httpOptions).pipe(
      map((chat: Chat) => Chat.convertToObj(chat)),
      catchError(this.handleError('getChatByParticipantId', null))
    );
  }
//#endregion 'Admin chat'

//#region 'Admin arbitration'
  getMyArbitrations(): Observable<ChatArbitration[]> {
    return this.http.get<ChatArbitration[]>(AdminApiUrls.MY_ARBITRATIONS, BaseHandlerService.httpOptions).pipe(
      map((chats: ChatArbitration[]) => chats.map(chat => ChatArbitration.convertToObj(chat))),
      catchError(this.handleError('getMyArbitrations', []))
    );
  }

  getAllMyArbitrations(params: ArbitrationsWithCountedPages): Observable<ArbitrationsWithCountedPages> {
    return this.http.get<ArbitrationsWithCountedPages>(
        `${AdminApiUrls.ALL_MY_ARBITRATIONS}/${params.pageableParams.page}/${params.pageableParams.size}/${params.sortParams.typeSort}/${params.sortParams.nameSort}?search=${params.search}`,
        BaseHandlerService.httpOptions).pipe(
      map(chat => ArbitrationsWithCountedPages.convertToObj(chat)),
      catchError(this.handleError('getMyArbitrations', null))
    );
  }

  getAllArbitrations(params: ArbitrationsWithCountedPages): Observable<ArbitrationsWithCountedPages> {
    return this.http.get<ArbitrationsWithCountedPages>(
        `${AdminApiUrls.ALL_ARBITRATIONS}/${params.pageableParams.page}/${params.pageableParams.size}/${params.sortParams.typeSort}/${params.sortParams.nameSort}?search=${params.search}`,
        BaseHandlerService.httpOptions).pipe(
      map(chat => ArbitrationsWithCountedPages.convertToObj(chat)),
      catchError(this.handleError('getAllArbitrations', null))
    );
  }

  adminJoinedToArbitration(arbitrationId: number): Observable<number> {
    return this.http.put<ChatArbitration>(`${AdminApiUrls.ARBITRATIONS_JOIN_ADMIN}${arbitrationId}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('adminJoinedToArbitration', null))
    );
  }

  getArbitrationById(chatId: number): Observable<ChatArbitration> {
    return this.http.get<ChatArbitration>(`${AdminApiUrls.ARBITRATION}${chatId}`, BaseHandlerService.httpOptions).pipe(
      map((chat: ChatArbitration) => ChatArbitration.convertToObj(chat)),
      catchError(this.handleError('getArbitrationById', null))
    );
  }

//#endregion 'Admin arbitration'

}
