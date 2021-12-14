import { Resume } from 'src/app/models/resume/resume';
import { ShortFieldActivity } from '../../models/field-activity/category/shortJobFieldActivity';
import { FilterVacancy } from '../../models/filter/filterVacancy';
import { ShortNews } from './../../models/news/shortNews';
import { ShortPromotion } from 'src/app/models/promotion/shortPromotion';
import { PartnerInfoWithCity } from './../../models/partnerInfo/partnerInfoWithCity';
import { FilterTask } from './../../models/filter/filterTask';
import { TaskRequest } from './../../models/task/taskRequest';
import { ShortTask } from './../../models/task/shortTask';
import { BaseHandlerService } from './service.base.handler';
import { ApiUrls, ActiveUrls } from './../../auth/activeUrls';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../../models/category/category';
import { Task } from 'src/app/models/task/task';
import { Offset } from '../offset';
import { FilterPerformer } from 'src/app/models/filter/filterPerformer';
import { SessionStorageService } from 'angular-web-storage';
import { RequestSupport } from 'src/app/models/support/requestSupport';
import { PageableParams } from 'src/app/models/pageable/PageableParams';
import { LegalEntityInfo } from 'src/app/models/legal-entity-info/legalEntityInfo';
import { ShortAdvertising } from 'src/app/models/advertising/shortAdvertising';
import { UnlockUser } from 'src/app/models/blocked-user/unlock/unlockUser';
import { FieldActivity } from 'src/app/models/field-activity/fileldActivity';
import { ShortVacancy } from 'src/app/models/vacancy/shortVacancy';
import { FilterResume } from 'src/app/models/filter/filterResume';
import { ShortResume } from 'src/app/models/resume/shortResume';
import { NotificationType } from 'src/app/models/notification/notificationType';

@Injectable({
  providedIn: 'root'
})
export class CommonService extends BaseHandlerService {

  constructor(private http: HttpClient,
    private sessionStorage: SessionStorageService,
      protected auth: AuthService) {
    super(auth);
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(ApiUrls.CATEGORIES, BaseHandlerService.httpOptions).pipe(
      map((categories: []) => categories.map(category => Category.convertToObj(category, false))),
      catchError(this.handleError('getAllCategories', []))
    );
  }

  getAllShortInfoTasks(filterTask: FilterTask): Observable<ShortTask[]> {
    filterTask.prepareBeforeSend();
    return this.http.post<ShortTask[]>(ApiUrls.SHORT_TASKS_INFO, filterTask, BaseHandlerService.httpOptions).pipe(
      map((shortTasks: ShortTask[]) => shortTasks.map(shortTask => ShortTask.convertToObj(shortTask))),
      catchError(this.handleError('getAllShortInfoTasks', []))
    );
  }

  getAllShortInfoPerformers(filterPerformer: FilterPerformer, taskId): Observable<PartnerInfoWithCity[]> {
    filterPerformer.taskId = taskId
    filterPerformer.prepareBeforeSend();
    //const url = taskId ? `${ApiUrls.SHORT_PARTNERS_INFO}?taskId=${taskId}` : `${ApiUrls.SHORT_PARTNERS_INFO}`;
    return this.http.post<PartnerInfoWithCity[]>(`${ApiUrls.SHORT_PARTNERS_INFO}`, filterPerformer, BaseHandlerService.httpOptions).pipe(
      map((performers: PartnerInfoWithCity[]) => performers.map(performer => PartnerInfoWithCity.convertToObj(performer))),
      catchError(this.handleError('getAllShortInfoPerformers', []))
    );
  }

  getTaskInfo(taskId: number): Observable<Task> {
    return this.http.get<Task>(ApiUrls.TASKS + taskId, BaseHandlerService.httpOptions).pipe(
      map(task => Task.convertToObj(task)),
      catchError(this.handleError('getTaskInfo', {} as Task))
    );
  }

  createTaskRequest(request: TaskRequest): Observable<any> {
    request.offset = Offset.getCurTimeZone();
    return this.http.post<TaskRequest>(ApiUrls.PERFORMER_TASK_REQUEST, request, BaseHandlerService.httpOptions)
      .pipe(
        map((request: TaskRequest) => TaskRequest.convertToObj(request)),
        tap((data: any) => this.log('')),
        catchError(this.handleSendMessage('sendMessage', request, null))
    );
  }

  protected handleSendMessage<T>(operation = 'operation', actualData: TaskRequest,
  result?: T) {
    return this.handleErrorWithHandler(operation, null,
      () => {
        this.sessionStorage.set('send_task_request', JSON.stringify(actualData));
      }
    );
  }

  setNewPrice(request: TaskRequest): Observable<any> {
    return this.http.post<TaskRequest>(ApiUrls.PERFORMER_TASK_REQUEST_TRADE, request, BaseHandlerService.httpOptions)
    .pipe(
      map((request: TaskRequest) => TaskRequest.convertToObj(request)),
      catchError(this.handleSendMessage('setNewPrice', request, null))
      );
  }

  changeTaskRequestStatus(request: TaskRequest): Observable<TaskRequest> {
    request.offset = Offset.getCurTimeZone();
    return this.http.put<TaskRequest>(ApiUrls.PERFORMER_TASK_REQUEST_CHANGE_STATUS, request, BaseHandlerService.httpOptions)
      .pipe(
        catchError(this.handleError('changeTaskRequestStatus', {} as TaskRequest))
    );
  }

  removeTaskRequestStatus(requestId: number): Observable<number> {
    return this.http.delete<number>(ApiUrls.PERFORMER_TASK_REQUEST + requestId, BaseHandlerService.httpOptions)
      .pipe(
        catchError(this.handleError('removeTaskRequestStatus', 0))
    );
  }

  getTaskRequestsByTaskId(taskId: number): Observable<TaskRequest[]> {
    return this.http.get<TaskRequest[]>(ApiUrls.TASK_REQUEST + taskId, BaseHandlerService.httpOptions).pipe(
      map((taskRequests: []) => taskRequests.map(taskRequest => TaskRequest.convertToObj(taskRequest))),
      catchError(this.handleError('getTaskRequestsByTaskId', []))
    );
  }

  sendRequestSupport(requestSupoort: RequestSupport): Observable<any> {
    return this.http.post<RequestSupport>(ApiUrls.SUPPORT, requestSupoort, BaseHandlerService.httpOptions).pipe(
      tap((data: any) => this.log('')),
      catchError(this.handleSendRequestSupport('sendRequestSupport', requestSupoort, null))
    );
  }

  protected handleSendRequestSupport<T>(operation = 'operation', actualData: RequestSupport,
  result?: T) {
    return this.handleErrorWithHandler(operation, null,
      () => {
        this.sessionStorage.set('send_request_support', JSON.stringify(actualData));
      }
    );
  }

  getAllShortInfoMembers(pageable: PageableParams): Observable<PartnerInfoWithCity[]> {
    return this.http.post<PartnerInfoWithCity[]>(ApiUrls.SHORT_MEMBERS_INFO, pageable, BaseHandlerService.httpOptions).pipe(
      map((members: PartnerInfoWithCity[]) => members.map(member => PartnerInfoWithCity.convertToObj(member))),
      catchError(this.handleError('getAllShortInfoMembers', []))
    );
  }

  getAllShortLegalEntitesMembers(pageable: PageableParams): Observable<LegalEntityInfo[]> {
    return this.http.post<LegalEntityInfo[]>(ApiUrls.SHORT_LEGAL_ENTITIES_MEMBERS_INFO, pageable, BaseHandlerService.httpOptions).pipe(
      map((members: LegalEntityInfo[]) => members.map(member => LegalEntityInfo.convertToObj(member))),
      catchError(this.handleError('getAllShortLegalEntitesMembers', []))
    );
  }

  getShortAdvertising(shortAdvertising: ShortAdvertising): Observable<ShortAdvertising> {
    return this.http.post<ShortAdvertising>(ApiUrls.SHORT_ADVERTISING, shortAdvertising, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('getShortAdvertising', null))
    );
  }

  unlockUser(): Observable<UnlockUser> {
    return this.http.get<any>(ApiUrls.UNLOCK_USER, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('unlockUser', null))
    );
  }

  checkBlocking(): Observable<UnlockUser[]> {
    return this.http.get<UnlockUser[]>(ApiUrls.CHECK_BLOCKING, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('checkBlocking', []))
    );
  }


  getAllPromotions(): Observable<ShortPromotion[]> {
    return this.http.get<ShortPromotion[]>(ApiUrls.ALL_PROMOTIONS, BaseHandlerService.httpOptions).pipe(
      map((promotions: []) => promotions.map(promo => ShortPromotion.convertToObj(promo))),
      catchError(this.handleError('getAllPromotions', []))
    );
  }

  getPromotion(id: number): Observable<ShortPromotion> {
    return this.http.get<ShortPromotion>(`${ApiUrls.PROMOTION}/${id}`, BaseHandlerService.httpOptions).pipe(
      map(promo => ShortPromotion.convertToObj(promo)),
      catchError(this.handleError('getPromotion', null))
    );
  }

  checkTask(taskId): Observable<Task> {
    return this.http.get<Task>(`${ApiUrls.CHECK_TASK}/${taskId}`, BaseHandlerService.httpOptions).pipe(
      map(task => Task.convertToObj(task)),
      catchError(this.handleError('checkTask', null))
    )
  }

  getAllPromotionsWithPromoCode(): Observable<ShortPromotion[]> {
    return this.http.get<ShortPromotion[]>(ApiUrls.ALL_PROMOTIONS_PROMO_CODE, BaseHandlerService.httpOptions).pipe(
      map((promotions: []) => promotions.map(promo => ShortPromotion.convertToObj(promo))),
      catchError(this.handleError('getAllPromotions', []))
    );
  }

  checkTaskRequest(id): Observable<number> {
    return this.http.get<number>(`${ApiUrls.CHECK_TASK_REQUEST}/${id}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('checkTaskRequest', null))
    );
  }

  getAllNews(): Observable<ShortNews[]> {
    return this.http.get<ShortNews[]>(ApiUrls.ALL_NEWS, BaseHandlerService.httpOptions).pipe(
      map((newsList: []) => newsList.map(news => ShortNews.convertToObj(news))),
      catchError(this.handleError('getAllNews', []))
    );
  }

  getNews(id: number): Observable<ShortNews> {
    return this.http.get<ShortNews>(`${ApiUrls.NEWS}/${id}`, BaseHandlerService.httpOptions).pipe(
      map(news => ShortNews.convertToObj(news)),
      catchError(this.handleError('getNews', null))
    );
  }

  getLastsNews(): Observable<ShortNews[]> {
    return this.http.get<ShortNews[]>(ApiUrls.LASTS_NEWS, BaseHandlerService.httpOptions).pipe(
      map((newsList: []) => newsList.map(news => ShortNews.convertToObj(news))),
      catchError(this.handleError('getLastNews', []))
    );
  }

  sendRequestMember(request: RequestSupport): Observable<any> {
    return this.http.post<RequestSupport>(ApiUrls.SHARE_PARTNERSHIP_REQUEST, request, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleSendPartnershipRequest('sendRequestMember', request))
    );
  }

  protected handleSendPartnershipRequest<T>(operation = 'operation', actualData: RequestSupport,
  result?: T) {
    return this.handleErrorWithHandler(operation, null,
      () => {
        this.sessionStorage.set('send_partnership_request', JSON.stringify(actualData));
      }
    );
  }

  getAllShortInfoTasksByHistoryTasks(filterTask: FilterTask): Observable<ShortTask[]> {
    filterTask.prepareBeforeSend();
    return this.http.post<ShortTask[]>(ApiUrls.SHORT_TASKS_INFO_HISTORY, filterTask, BaseHandlerService.httpOptions).pipe(
      map((shortTasks: ShortTask[]) => shortTasks.map(shortTask => ShortTask.convertToObj(shortTask))),
      catchError(this.handleError('getAllShortInfoTasksByHistoryTasks', []))
    );
  }

  getAllRootFieldsActivity(): Observable<FieldActivity[]> {
    return this.http.get<FieldActivity[]>(ApiUrls.ALL_ROOT_FIELDS_ACTIVITY, BaseHandlerService.httpOptions).pipe(
      map(fields => fields.map(field => FieldActivity.convertToObj(field, false))),
      catchError(this.handleError('getAllRootFieldsActivity',[]))
    );
  }

  getAllShortVacancy(filterVacancy: FilterVacancy): Observable<ShortVacancy[]> {
    filterVacancy.prepareBeforeSend();
    return this.http.post<ShortVacancy[]>(ApiUrls.ALL_SHORT_VACANCY, filterVacancy, BaseHandlerService.httpOptions).pipe(
      map(vacancies => vacancies.map(vacancy => ShortVacancy.convertToObj(vacancy))),
      catchError(this.handleError('getAllShortVacancy',[]))
    );
  }

  getAllNameCategoryForJob(pageable: PageableParams): Observable<ShortFieldActivity[]> {
    return this.http.post<ShortFieldActivity[]>(ApiUrls.ALL_FIELDS_ACTIVITY_JOB_FieldActivity, pageable, BaseHandlerService.httpOptions).pipe(
      map(fieldActivity => fieldActivity.map(fieldActivity => ShortFieldActivity.convertToObj(fieldActivity))),
      catchError(this.handleError('getAllCategoryNames',[]))
    );
  }

  getAllResume(filterResume: FilterResume): Observable<ShortResume[]> {
    filterResume.prepareBeforeSend();
    return this.http.post<ShortResume[]>(ApiUrls.ALL_RESUME, filterResume, BaseHandlerService.httpOptions).pipe(
      map(listResume => listResume.map(resume => ShortResume.convertToObj(resume))),
      catchError(this.handleError('getAllResume',[]))
    );
  }

  getLastThreeResume(): Observable<ShortResume[]> {
    return this.http.get<ShortResume[]>(`${ApiUrls.LAST_THREE_RESUME}`, BaseHandlerService.httpOptions).pipe(
      map((shortResume: ShortResume[]) => shortResume.map(shortResume => ShortResume.convertToObj(shortResume))),
      catchError(this.handleError('getLastThreeResume', []))
    );
  }

  checkActualityVacancy(vacancyId, notificationType: NotificationType): Observable<number> {
    return this.http.get<ShortVacancy[]>(`${ApiUrls.CHECK_VACANCY}/${vacancyId}/${notificationType}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('checkActualityVacancy', null))
    );
  }

  getResumeById(id): Observable<Resume> {
    return this.http.get<Resume>(`${ApiUrls.RESUME}/${id}`, BaseHandlerService.httpOptions).pipe(
      map(resume => Resume.convertToObj(resume)),
      catchError(this.handleError('getResumeById',null))
    );
  }
}
