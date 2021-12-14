import { ShortResume } from './../../../models/resume/shortResume';
import { FilterStatusVacancy } from 'src/app/models/vacancy/filterStatusVacancy';
import { PageableParams } from './../../../models/pageable/PageableParams';
import { ShortVacancy } from './../../../models/vacancy/shortVacancy';
import { Vacancy } from 'src/app/models/vacancy/vacancy';
import { saveAs } from 'file-saver';
import { PartnerInfoWithCity } from 'src/app/models/partnerInfo/partnerInfoWithCity';
import { ShortPromotion } from './../../../models/promotion/shortPromotion';
import { RegionalHourCost } from './../../../models/rates/regionalHourCost';
import { MapTaskPropertyPoint } from 'src/app/models/task/properties/map/mapTaskPropertyPoint';
import { GeoCityProperty } from './../../../models/map/geo/city/geoCityProperty';
import { FilterStatusCommonType } from './../../../models/task/filterStatusCommonType';
import { CustomerInfo } from './../../../models/task/customerInfo';
import { ShortPartner } from './../../../models/partner/shortPartner';
import { PaymentCalc } from './../../../models/payment/paymentCalc';
import { SessionStorageService } from 'angular-web-storage';
import { ROLE } from './../../../auth/role';
import { TaskStatus } from './../../../models/task/taskStatus';
import { ShortTask } from './../../../models/task/shortTask';
import { tap, catchError, map } from 'rxjs/operators';
import { ApiUrls, ActiveUrls } from './../../../auth/activeUrls';
import { BaseHandlerService } from './../../../common/services/service.base.handler';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './../../../auth/auth.service';
import { Injectable } from '@angular/core';
import { Task } from 'src/app/models/task/task';
import { PartnerInfo } from 'src/app/models/partnerInfo/partnerInfo';
import { ShortComment } from 'src/app/models/partner/shortComment';
import { ShortCategory } from 'src/app/models/partner/shortCategory';
import { Category } from 'src/app/models/category/category';
import { ShortUserInfo } from 'src/app/models/task/shortUserInfo';
import { PasswordValidationProperty } from 'src/app/models/partnerInfo/passwordValidationProperty';
import { ResorceUploadState } from 'src/app/models/common/resorceUploadState';
import { ShortTaskRequest } from 'src/app/models/task/shortTaskRequest';
import { FilterStatusRequest } from 'src/app/models/task/filterStatusRequest';
import { ShortHomeCategoty } from 'src/app/models/category/shortHomeCategory';
import { RegistrationRequest } from 'src/app/models/auth/registrationRequest';
import { PasswordRecovery } from 'src/app/models/auth/passwordRecovery';
import { ShortPartnerPromotion } from 'src/app/models/promotion/shortPartnerPromotion';
import { RegistrationLegalEntityRequest } from 'src/app/models/auth/registrationLegalEntityRequest';
import { LegalEntityInfo } from 'src/app/models/legal-entity-info/legalEntityInfo';
import { RequestSupport } from 'src/app/models/support/requestSupport';
import { ObligatoryPerformerInfo } from 'src/app/models/partnerInfo/obligatoryPerformerInfo';
import { ImageWorkExample } from 'src/app/models/image_work_example/imageWorkExample';
import { TaskDoc } from 'src/app/models/task/taskDoc';
import { Resume } from 'src/app/models/resume/resume';
import { SubscriptionJob } from 'src/app/models/rateJobs/subscriptionJob';


@Injectable({
  providedIn: 'root'
})
export class PartnerService extends BaseHandlerService {

  constructor(private http: HttpClient,
      protected auth: AuthService,
      private sessionStorage: SessionStorageService) {
    super(auth);
  }

  addTask(task: Task): Observable<Task> {
    task.prepareBeforeSave();
    let url = ApiUrls.PARTNER_TASKS;
    if(task.userInfo.verificationToken != null) {
      url = url + `?verificationToken=${task.userInfo.verificationToken}`
    }
    return this.http.post<Task>(url, task, BaseHandlerService.httpOptions)
      .pipe(
        tap((data: any) => this.log('')),
        catchError(this.handleErrorCreationTask('getMyTaskInfo', task, null))
    );
  }

  getLastThreeTasks(): Observable<ShortTask[]> {
    return this.http.get<ShortTask[]>(`${ApiUrls.SHORT_LAST_THREE_TASKS}`, BaseHandlerService.httpOptions).pipe(
      map((shortTasks: ShortTask[]) => shortTasks.map(shortTask => ShortTask.convertToObj(shortTask))),
      catchError(this.handleError('getShortLastThreeTasks', []))
    );
  }

  //TODO merge with admin
  getUsedSities(): Observable<GeoCityProperty[]> {
    return this.http.get<GeoCityProperty[]>(ApiUrls.USED_CITIES, BaseHandlerService.httpOptions)
    .pipe(
      map((cities: []) => cities.map(city => GeoCityProperty.convertToObj(city, null))),
      catchError(this.handleError('getUsedSities', []))
    );
  }

  payCalc(task: Task): Observable<PaymentCalc> {
    task.prepareBeforeCalc();
    return this.http.post<Task>(ApiUrls.PARTNER_TASKS_CALC_PAY, task, BaseHandlerService.httpOptions)
      .pipe(
        tap((data: any) => this.log('')),
        catchError(this.handleErrorCreationTask('payCalc', task, null))
    );
  }

  getMessageForMinHour(startPoint: MapTaskPropertyPoint): Observable<RegionalHourCost> {
    return this.http.post<RegionalHourCost>(ApiUrls.PARTNER_HOUR_MESSAGE, startPoint, BaseHandlerService.httpOptions)
      .pipe(
        catchError(this.handleError('getMessageForMinHour', null))
    );
  }

  protected handleErrorCreationTask<T>(operation = 'operation', actualData: Task,
      result?: T) {
    return this.handleErrorWithHandler(operation, null,
      () => {
        this.sessionStorage.set('create_content__saved_task', JSON.stringify(actualData));
        this.sessionStorage.set(AuthService.backUrlName, ActiveUrls.NEW_TASK);
      }
    );
  }

  getMyShortInfoTasks(filterStatusCommonType: FilterStatusCommonType, pageable: PageableParams): Observable<ShortTask[]> {
    return this.http.post<ShortTask[]>(`${ApiUrls.MY_TASKS_INFO}/${filterStatusCommonType}`, pageable, BaseHandlerService.httpOptions).pipe(
      map((shortTasks: ShortTask[]) => shortTasks.map(shortTask => ShortTask.convertToObj(shortTask))),
      catchError(this.handleError('getMyShortInfoTasks', []))
    );
  }

  getMyTaskInfo(taskId: number): Observable<Task> {
    return this.http.get<Task>(ApiUrls.PARTNER_TASKS + taskId, BaseHandlerService.httpOptions).pipe(
      map((task: Task) => Task.convertToObj(task)),
      catchError(this.handleError('getMyTaskInfo', {} as Task))
    );
  }

  getYourAvailableShortInfoTasks(pageable: PageableParams, performerId): Observable<ShortTask[]> {
    if(performerId != null) {
      BaseHandlerService.httpOptions.params = new HttpParams()
        .set('performerId', performerId);
    }

    return this.http.post<ShortTask[]>(ApiUrls.MY_AVAILABLE_SHORT_TASKS_INFO, pageable, BaseHandlerService.httpOptions).pipe(
      map((shortTasks: ShortTask[]) => shortTasks.map(shortTask => ShortTask.convertToObj(shortTask))),
      catchError(this.handleError('getYourAvailableShortInfoTasks', []))
    );
  }

  offerTaskToPerformer(taskId: number, performerId): Observable<ShortComment> {
    return this.http.post<ShortComment>(`${ApiUrls.OFFER_SHORT_TASKS_INFO}/${taskId}/${performerId}`,
        BaseHandlerService.httpOptions).pipe(
      catchError(this.handleErrorPartnerComment('offerTaskToPerformer', null))
    );
  }

  getMyTaskWithPerformer(taskId: number): Observable<Task> {
    return this.http.get<Task>(`${ApiUrls.PARTNER_TASK_PERFORMER}${taskId}`, BaseHandlerService.httpOptions).pipe(
      map((task: Task) => Task.convertToObj(task)),
      catchError(this.handleError('getMyTaskInfo', {} as Task))
    );
  }

  getMyTaskWithPartner(taskId: number): Observable<Task> {
    return this.http.get<Task>(`${ApiUrls.PARTNER_TASK_CREATOR}${taskId}`, BaseHandlerService.httpOptions).pipe(
      map((task: Task) => Task.convertToObj(task)),
      catchError(this.handleError('getMyTaskInfo', {} as Task))
    );
  }

  getMyPerformTaskInfo(taskId: number): Observable<Task> {
    return this.http.get<Task>(ApiUrls.PERFORMER_TASKS + taskId, BaseHandlerService.httpOptions).pipe(
      map((task: Task) => Task.convertToObj(task)),
      catchError(this.handleError('getMyPerformTaskInfo', {} as Task))
    );
  }

  switchStatusTask(taskId: number, status: TaskStatus): Observable<Task> {
    return this.http.put<Task>(ApiUrls.SWITCH_STATUS_TASK + taskId + '/' + status,
      BaseHandlerService.httpOptions).pipe(
        map((task: Task) => Task.convertToObj(task)),
        catchError(this.handleError('switchStatusTask', {} as Task))
    );
  }

  addPerformerRole(): Observable<ROLE[]> {
    return this.http.put<ROLE[]>(ApiUrls.PERFORMER_ROLE,
      BaseHandlerService.httpOptions).pipe(
        tap((roles: ROLE[]) => {
          this.auth.updateRoles(roles);
        }),
        catchError(this.handleError('addPerformerRole', []))
    );
  }

  getCurrentPartnerInfo(partnerId: number): Observable<PartnerInfoWithCity> {
    return this.http.get<PartnerInfoWithCity>(`${ApiUrls.PARTNER_INFO}${partnerId}`, BaseHandlerService.httpOptions).pipe(
      map((partnerInfo: PartnerInfoWithCity) => PartnerInfoWithCity.convertToObj(partnerInfo)),
      catchError(this.handleError('getCurrentPartnerInfo', {} as PartnerInfoWithCity))
    );
  }

  checkValidateByUpdatePartnerInfo(partnerInfo: PartnerInfoWithCity): Observable<PartnerInfoWithCity> {
    return this.http.post<PartnerInfoWithCity>(ApiUrls.VALIDATE_PARTNER_INFO, partnerInfo, BaseHandlerService.httpOptions).pipe(
      tap((data: any) => this.log('')),
      catchError(this.handleErrorUpdatePartnerInfo('checkValidateByUpdatePartnerInfo', partnerInfo, null))
    );
  }

  updatePartnerInfo(partnerInfo: PartnerInfoWithCity): Observable<PartnerInfoWithCity> {
    let params = null;
    if(partnerInfo.verificationToken != null) {
      params = new HttpParams()
        .set('verificationToken', partnerInfo.verificationToken);
    }
    return this.http.put<PartnerInfoWithCity>(ApiUrls.PARTNER_INFO, partnerInfo, {params}).pipe(
      tap((data: any) => this.log('')),
      catchError(this.handleErrorUpdatePartnerInfo('updatePartnerInfo', partnerInfo, null))
    );
  }

  protected handleErrorUpdatePartnerInfo<T>(operation = 'operation', actualData: PartnerInfo,
    result?: T) {
      return this.handleErrorWithHandler(operation, null,
      () => {
        this.sessionStorage.set('update_content__update_partner_info', JSON.stringify(actualData));
      }
    );
  }

  checkValidateByFillingInfo(info: ObligatoryPerformerInfo): Observable<ObligatoryPerformerInfo> {
    return this.http.post<ObligatoryPerformerInfo>(ApiUrls.VALIDATE_FILLING_PERFORMER_INFO, info, BaseHandlerService.httpOptions).pipe(
      tap((data: any) => this.log('')),
      catchError(this.handleErrorFillingObligatoryInfoPermormer('checkValidateByFillingInfo', info, null))
    );
  }

  updateObligatoryInfoPermormer(info: ObligatoryPerformerInfo): Observable<ObligatoryPerformerInfo> {
    let params = null;
    if(info.verificationToken != null) {
      params = new HttpParams()
        .set('verificationToken', info.verificationToken);
    }
    return this.http.put<ObligatoryPerformerInfo>(ApiUrls.PERFORMER_INFO, info, {params}).pipe(
      tap((data: any) => this.log('')),
      catchError(this.handleErrorFillingObligatoryInfoPermormer('updateObligatoryInfoPermormer', info, null))
    );
  }

  protected handleErrorFillingObligatoryInfoPermormer<T>(operation = 'operation', actualData: ObligatoryPerformerInfo,
    result?: T) {
      return this.handleErrorWithHandler(operation, null,
      () => {
        this.sessionStorage.set('filling_obligatory_info_permormer', JSON.stringify(actualData));
      }
    );
  }

  updatePassword(password: PasswordValidationProperty): Observable<PasswordValidationProperty> {
    return this.http.put<PasswordValidationProperty>(ApiUrls.PARTNER_INFO_PASSWORD, password, BaseHandlerService.httpOptions).pipe(
      tap((data: any) => this.log('')),
      catchError(this.handleErrorUpdatePassword('updatePassword', password, null))
    );
  }

  protected handleErrorUpdatePassword<T>(operation = 'operation', actualData: PasswordValidationProperty,
      result?: T) {
    return this.handleErrorWithHandler(operation, null,
      () => {
        this.sessionStorage.set('update_content__update_password', JSON.stringify(actualData));
      }
    );
  }

  getThreePartnerInfoForTheCategoryConstruction(): Observable<PartnerInfoWithCity[]> {
    return this.http.get<PartnerInfoWithCity[]>(ApiUrls.THREE_PARTNER_INFO_FOR_THE_CATEGORY_CONSTRUCTION, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('getThreePartnerInfoForTheCategoryConstruction',[]))
    );
  }

  getPartnersComments(partnerId: number): Observable<ShortComment[]> {
    return this.http.get<ShortComment[]>(`${ApiUrls.SHORT_COMMENTS}${partnerId}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('getPartnersComments',[]))
    );
  }

  getTaskComments(taskId: number): Observable<ShortComment[]> {
    return this.http.get<ShortComment[]>(`${ApiUrls.SHORT_TASK_COMMENTS}${taskId}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('getPartnersComments',[]))
    );
  }

  checkPartnerComment(taskId: number): Observable<number> {
    return this.http.get<number>(`${ApiUrls.CHECK_PARTNER_COMMENT}${taskId}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('checkPartnerComment', null))
    );
  }

  addPartnerComment(shortComment: ShortComment): Observable<ShortComment> {
    return this.http.post<ShortComment>(ApiUrls.SHORT_COMMENTS, shortComment, BaseHandlerService.httpOptions).pipe(
      map((comment: ShortComment) => ShortComment.convertToObj(comment)),
      tap((data: any) => this.log('')),
      catchError(this.handleErrorPartnerComment('addPartnerComment', shortComment, null))
    );
  }

  protected handleErrorPartnerComment<T>(operation = 'operation', actualData: ShortComment,
    result?: T) {
      return this.handleErrorWithHandler(operation, null,
      () => {
        this.sessionStorage.set('add_content__add_short_comment', JSON.stringify(actualData));
      }
    );
  }

  updatePartnersComments(shortComment: ShortComment): Observable<any> {
    return this.http.put<ShortComment>(ApiUrls.SHORT_COMMENTS, shortComment, BaseHandlerService.httpOptions).pipe(
      map((comment: ShortComment) => ShortComment.convertToObj(comment)),
      tap((data: any) => this.log('')),
      catchError(this.handleErrorPartnerComment('updatePartnersComments', shortComment, null))
    );
  }

  deletePartnerComment(id: number): Observable<{}> {
    return this.http.delete(`${ApiUrls.SHORT_COMMENTS}${id}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('deletePartnerComment', {} as ShortComment))
    );
  }

  getAllCategoryNames(): Observable<Category[]> {
    return this.http.get<Category[]>(ApiUrls.ALL_CATEGORY_NAMES, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('getAllCategoryNames',[]))
    );
  }

  getAllUserCategories(partnerId: number): Observable<ShortCategory[]> {
    return this.http.get<ShortCategory[]>(`${ApiUrls.SHORT_CATEGORY}/${partnerId}`, BaseHandlerService.httpOptions).pipe(
      map((categories: ShortCategory[]) => categories.map((category: ShortCategory) => ShortCategory.convertToObj(category))),
      catchError(this.handleError('getAllUserCategories', []))
    );
  }

  addUserCategory(shortCategory: ShortCategory): Observable<ShortCategory> {
    return this.http.put<ShortCategory>(ApiUrls.SHORT_CATEGORY, shortCategory, BaseHandlerService.httpOptions).pipe(
      tap((data: any) => this.log('')),
      catchError(this.handleErrorAddUserCategory('addUserCategory', shortCategory, null))
    );
  }

  protected handleErrorAddUserCategory<T>(operation = 'operation', actualData: ShortCategory,
    result?: T) {
      return this.handleErrorWithHandler(operation, null,
      () => {
        this.sessionStorage.set('add_content__add_short_comment', JSON.stringify(actualData));
      }
    );
  }

  deleteUserCategory(id: number): Observable<{}> {
    return this.http.delete<{}>(`${ApiUrls.SHORT_CATEGORY}/${id}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('deleteUserCategory', {} as ShortCategory))
    );
  }

  getAllPartnerTaskRequest(filterStatusCommonType: FilterStatusCommonType, pageable: PageableParams): Observable<ShortTask[]> {
    return this.http.post<ShortTask[]>(`${ApiUrls.MY_PERFORM_TASKS_INFO}/${filterStatusCommonType}`, pageable, BaseHandlerService.httpOptions).pipe(
      map((shortTasks: ShortTask[]) => shortTasks.map(shortTask => ShortTask.convertToObj(shortTask))),
      catchError(this.handleError('getAllPartnerTaskRequest', []))
    );
  }

  getCurrenUserInfoForTask(partnerId: number): Observable<ShortUserInfo> {
    return this.http.get<ShortPartner>(`${ApiUrls.PARTNER_INFO}${partnerId}`, BaseHandlerService.httpOptions).pipe(
      map((userInfo: ShortPartner) => ShortUserInfo.convertToObj(userInfo))
    );
  }

  getCityOfUser(): Observable<GeoCityProperty> {
    return this.http.get<GeoCityProperty>(ApiUrls.PARTNER_GEO_CITY, BaseHandlerService.httpOptions).pipe(
      map((geoCity: GeoCityProperty) => GeoCityProperty.convertToObj(geoCity, null))
    )
  }

  getMyPerformTaskCreatorInfo(taskId: number): Observable<CustomerInfo> {
    return this.http.get<CustomerInfo>(`${ApiUrls.MY_PERFORM_TASK_CREATOR_INFO}${taskId}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('getMyPerformTaskCreatorInfo', {} as CustomerInfo))
    );
  }

  updateUserPhoto(image: FormData, idPartner: number): Observable<any> {
    return this.http.post<FormData>(`${ApiUrls.USER_PHOTO}${idPartner}`, image, { reportProgress: true, observe: 'events' }).pipe(
      catchError(this.handleError('updateUserPhoto', {} as any))
    );
  }

  getMyPerformTaskPerformerInfo(taskId: number): Observable<CustomerInfo> {
    return this.http.get<CustomerInfo>(`${ApiUrls.MY_PERFORM_TASK_PERFORMER_INFO}${taskId}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('getMyPerformTaskPerformerInfo', {} as CustomerInfo))
    );
  }

  getMyPerformShortInfoTasks(filterStatusRequest: FilterStatusRequest, pageable: PageableParams): Observable<ShortTaskRequest[]> {
    return this.http.post<ShortTaskRequest[]>( `${ApiUrls.USER_TASK_REQUEST}/${filterStatusRequest}`, pageable, BaseHandlerService.httpOptions).pipe(
      map((shortTasksRequest: ShortTaskRequest[]) => shortTasksRequest.map(shortTaskRequest => ShortTaskRequest.convertToObj(shortTaskRequest))),
      catchError(this.handleError('getMyPerformShortInfoTasks', []))
    );
  }

  getCountConfirmations(): Observable<number> {
    return this.http.get<number>(ApiUrls.USER_TASK_REQUEST_COUNT, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('getMyPerformTaskPerformerInfo', {} as number))
    );
  }

  getAllNameCategoryForHome(pageable: PageableParams): Observable<ShortHomeCategoty[]> {
    return this.http.post<ShortHomeCategoty[]>(ApiUrls.ALL_CATEGORY_NAMES_FOR_HOME, pageable, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('getAllCategoryNames',[]))
    );
  }

  getAllPromotionsForHome(): Observable<ShortPromotion[]> {
    return this.http.get<ShortPromotion[]>(ApiUrls.ALL_PROMOTIONS_FOR_HOME, BaseHandlerService.httpOptions).pipe(
      map(promotions => promotions.map(promo => ShortPromotion.convertToObj(promo))),
      catchError(this.handleError('getAllPromotionsForHome',[]))
    );
  }

  checkRegistration(registrationRequest: RegistrationRequest): Observable<boolean> {
    return this.http.post<any>(ApiUrls.REGISTRATION_CHECK, registrationRequest, BaseHandlerService.httpOptions).pipe(
      tap((data: any) => this.log('')),
      catchError(this.handleErrorRegistration('checkRegistration', registrationRequest, null))
    );
  }

  registration(registrationRequest: RegistrationRequest): Observable<any> {
    return this.http.post<any>(ApiUrls.REGISTRATION, registrationRequest, BaseHandlerService.httpOptions).pipe(
      tap((data: any) => this.log('')),
      catchError(this.handleErrorRegistration('registration', registrationRequest, null))
    );
  }

  protected handleErrorRegistration<T>(operation = 'operation', actualData: RegistrationRequest,
  result?: T) {
    return this.handleErrorWithHandler(operation, null,
      () => {
        this.sessionStorage.set('registration_content', JSON.stringify(actualData));
      }
    );
  }

  checkRegistrationLegalEntity(registrationRequest: RegistrationLegalEntityRequest): Observable<boolean> {
    return this.http.post<any>(ApiUrls.REGISTRATION_CHECK_LEGAL_ENTITY, registrationRequest, BaseHandlerService.httpOptions).pipe(
      tap((data: any) => this.log('')),
      catchError(this.handleErrorRegistrationLegalEntity('checkRegistrationLegalEntity', registrationRequest, null))
    );
  }

  registrationLegalEntity(registrationRequest: RegistrationLegalEntityRequest): Observable<any> {
    return this.http.post<any>(ApiUrls.REGISTRATION_LEGAL_ENTITY, registrationRequest, BaseHandlerService.httpOptions).pipe(
      tap((data: any) => this.log('')),
      catchError(this.handleErrorRegistrationLegalEntity('registrationLegalEntity', registrationRequest, null))
    );
  }

  protected handleErrorRegistrationLegalEntity<T>(operation = 'operation', actualData: RegistrationLegalEntityRequest,
  result?: T) {
    return this.handleErrorWithHandler(operation, null,
      () => {
        this.sessionStorage.set('registration_legal_entity_content', JSON.stringify(actualData));
      }
    );
  }

  checkPartnerForPasswordRecovery(passwordRecovery: PasswordRecovery): Observable<any> {
    return this.http.post<PasswordRecovery>(ApiUrls.CHECK_PARTNER_FOR_PASSWORD_RECOVERY, passwordRecovery, BaseHandlerService.httpOptions).pipe(
      tap((data: any) => this.log('')),
      catchError(this.handleErrorPasswordRecovery('passwordRecovery', passwordRecovery, null))
    );
  }

  passwordRecovery(passwordRecovery: PasswordRecovery): Observable<any> {
    return this.http.post<PasswordRecovery>(ApiUrls.PASSWORD_RECOVERY, passwordRecovery, BaseHandlerService.httpOptions).pipe(
      tap((data: any) => this.log('')),
      catchError(this.handleErrorPasswordRecovery('passwordRecovery', passwordRecovery, null))
    );
  }

  protected handleErrorPasswordRecovery<T>(operation = 'operation', actualData: PasswordRecovery,
  result?: T) {
    return this.handleErrorWithHandler(operation, null,
      () => {
        this.sessionStorage.set('password_recovery_content', JSON.stringify(actualData));
      }
    );
  }

  getCurrentLegalEntityInfo(userId: number): Observable<LegalEntityInfo> {
    return this.http.get<LegalEntityInfo>(`${ApiUrls.LEGAL_ENTITY_INFO}/${userId}`, BaseHandlerService.httpOptions).pipe(
      map((legalEntityInfo: LegalEntityInfo) => LegalEntityInfo.convertToObj(legalEntityInfo)),
      catchError(this.handleError('getCurrentLegalEntityInfo', {} as LegalEntityInfo))
    );
  }

  updateLegalEntityInfo(legalEntityInfo: LegalEntityInfo): Observable<LegalEntityInfo> {
    let params = null;
    if(legalEntityInfo.verificationToken != null) {
      params = new HttpParams()
        .set('verificationToken', legalEntityInfo.verificationToken);
    }
    return this.http.put<LegalEntityInfo>(ApiUrls.LEGAL_ENTITY_INFO, legalEntityInfo, {params}).pipe(
      catchError(this.handleError('getCurrentLegalEntityInfo', {} as LegalEntityInfo))
    );
  }

  viewTimer(): Observable<any> {
    return this.http.get<any>(ApiUrls.SETTING, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('viewTimer', null))
    );
  }

  sendRequestMember(request: RequestSupport): Observable<any> {
    return this.http.post<any>(ApiUrls.SEND_REQUEST_MEMBER, request, BaseHandlerService.httpOptions).pipe(
      tap((data: any) => this.log('')),
      catchError(this.handleErrorSendRequestMember('sendRequestmember', request, null))
    );
  }

  protected handleErrorSendRequestMember<T>(operation = 'operation', actualData: RequestSupport,
  result?: T) {
    return this.handleErrorWithHandler(operation, null,
      () => {
        this.sessionStorage.set('send_request_member_content', JSON.stringify(actualData));
      }
    );
  }

  getCurrentPartnerSharedCode(promoId: number): Observable<ShortPartnerPromotion> {
    return this.http.get<ShortPartnerPromotion>(`${ApiUrls.PARTNER_SHARE}/${promoId}`, BaseHandlerService.httpOptions).pipe(
      map(el => ShortPartnerPromotion.convertToObjWithFriends(el)),
      catchError(this.handleError('getCurrentPartnerSharedCode', {} as ShortPartnerPromotion))
    );
  }

  partnerParticipatePromotion(promoId: number): Observable<ShortPartnerPromotion> {
    return this.http.get<ShortPartnerPromotion>(`${ApiUrls.PARTNER_PARTICIPATION_PROMOTION}/${promoId}`, BaseHandlerService.httpOptions).pipe(
      map(el => ShortPartnerPromotion.convertToObj(el)),
      catchError(this.handleError('partnerParticipatePromotion', {} as ShortPartnerPromotion))
    );
  }

  getMyPromotion(): Observable<ShortPromotion> {
    return this.http.get<ShortPromotion>(`${ApiUrls.MY_SHARE}`, BaseHandlerService.httpOptions).pipe(
      map(promo => ShortPromotion.convertToObj(promo),
      catchError(this.handleError('getMyPromotion', null)))
    );
  }

  editTask(task: Task): Observable<any> {
    task.prepareBeforeSave();
    return this.http.put<Task>(ApiUrls.PARTNER_UPDATE_TASK, task, BaseHandlerService.httpOptions)
      .pipe(
        map(el => Task.convertToObj(el)),
        tap((data: any) => this.log('')),
        catchError(this.handleErrorUpdateTask('editTask', task, null))
    );
  }

  protected handleErrorUpdateTask<T>(operation = 'operation', actualData: Task,
    result?: T) {
    return this.handleErrorWithHandler(operation, null,
      () => {
        this.sessionStorage.set('update_content__saved_task', JSON.stringify(actualData));
      }
    );
  }

  checkBlockingPartner(): Observable<number> {
    return this.http.get<number>( ApiUrls.CHECK_BLOCKING_PARTNER, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('checkBlockingPartner', null))
    );
  }

  updatePartnerImage(file: FormData, partnerId: number, taskId: number, image: ImageWorkExample): Observable<any> {
    return this.http.post<FormData>(`${ApiUrls.PARTNER_IMAGE_WORK_EXAMPLE}/${partnerId}?imageId=${image.id ? image.id : -1}&taskId=${taskId ? taskId : -1}&showImage=${image.showImage}`,
      file, { reportProgress: true, observe: 'events' }).pipe(
      catchError(this.handleError('updatePartnerImage', {} as any))
    );
  }

  updatePartnerImageCross(file: FormData, partnerId: number, taskId: number, image: ImageWorkExample): Observable<ResorceUploadState> {
    return this.http.post<FormData>(`${ApiUrls.PARTNER_IMAGE_WORK_EXAMPLE}/${partnerId}?imageId=${image.id ? image.id : -1}&taskId=${taskId ? taskId : -1}&showImage=${image.showImage}`,
      file).pipe(
      catchError(this.handleError('updatePartnerImage', {} as any))
    );
  }

  deleteImage(id: number): Observable<{}> {
    return this.http.delete(`${ApiUrls.PARTNER_IMAGE_WORK_EXAMPLE}/${id}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('deleteImage', {} as ImageWorkExample))
    );
  }

  changeNotificationConf(partnerInfo: PartnerInfoWithCity): Observable<PartnerInfoWithCity> {
    return this.http.put<PartnerInfoWithCity>(ApiUrls.PARTNER_CONF, partnerInfo, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('changeNotificationConf', null as PartnerInfoWithCity))
    );
  }

  getTaskDocs(taskId): Observable<TaskDoc[]> {
    return this.http.get<TaskDoc[]>(`${ApiUrls.PARTNER_TASK_DOC}/${taskId}`, BaseHandlerService.httpOptions).pipe(
      map(docs => docs.map(doc => TaskDoc.convertToObj(doc))),
      catchError(this.handleError('getTaskDocs', []))
    );
  }

  saveDoc(file: FormData, taskId: number): Observable<any> {
    return this.http.post<FormData>(`${ApiUrls.PARTNER_TASK_DOC}/${taskId}`, file, { reportProgress: true, observe: 'events' }).pipe(
      catchError(this.handleError('saveDoc', {} as any))
    );
  }

  saveDocCross(file: FormData, taskId: number): Observable<any> {
    return this.http.post<FormData>(`${ApiUrls.PARTNER_TASK_DOC}/${taskId}`, file).pipe(
      catchError(this.handleError('saveDocCross', {} as any))
    );
  }

  deleteDoc(id: number): Observable<{}> {
    return this.http.delete(`${ApiUrls.PARTNER_TASK_DOC}/${id}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('deleteDoc', {} as TaskDoc))
    );
  }

  downloadDoc(doc: TaskDoc) {
    let url = `${ApiUrls.PARTNER_TASK_DOC_DOWNLOAD}/${doc.id}`;
    this.http.get(url, { responseType: 'blob'}).subscribe((res) => {
      const file = new Blob([res], {
        type: 'application/octet-stream',
      });
      saveAs(file, doc.nameDoc);
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

  getAllRootCategoriesWithChildren(): Observable<Category[]> {
    return this.http.get<Category[]>(ApiUrls.ALL_ROOT_CATEGORIES_WITH_CHILDREN, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('getAllRootCategoriesWithChildren',[]))
    );
  }

  createVacancy(vacancy: Vacancy): Observable<any> {
    return this.http.post<Vacancy>(ApiUrls.PARTNER_CREATE_VACANCY, vacancy, BaseHandlerService.httpOptions)
      .pipe(
        catchError(this.handleErrorEditVacancy('createVacancy', vacancy, null))
    );
  }

  protected handleErrorEditVacancy<T>(operation = 'operation', actualData: Vacancy,
    result?: T) {
      return this.handleErrorWithHandler(operation, null,
      () => {
        this.sessionStorage.set('create_content__saved_vacancy', JSON.stringify(actualData));
      }
    );
  }

  getVacancy(vacancyId): Observable<Vacancy> {
    return this.http.get<Vacancy>(`${ApiUrls.VACANCY}/${vacancyId}`, BaseHandlerService.httpOptions).pipe(
      map(vacancy => Vacancy.convertToObj(vacancy)),
      catchError(this.handleError('getVacancy', null))
    );
  }

  getPartnerVacancy(vacancyId): Observable<Vacancy> {
    return this.http.get<Vacancy>(`${ApiUrls.CREATOR_VACANCY}/${vacancyId}`, BaseHandlerService.httpOptions).pipe(
      map(vacancy => Vacancy.convertToObj(vacancy)),
      catchError(this.handleError('getPartnerVacancy', null))
    );
  }

  getWorkerVacancy(vacancyId): Observable<Vacancy> {
    return this.http.get<Vacancy>(`${ApiUrls.WORKER_VACANCY}/${vacancyId}`, BaseHandlerService.httpOptions).pipe(
      map(vacancy => Vacancy.convertToObj(vacancy)),
      catchError(this.handleError('getWorkerVacancy', null))
    );
  }

  updateVacancy(vacancy: Vacancy): Observable<any> {
    return this.http.put<Vacancy>(ApiUrls.PARTNER_UPDATE_VACANCY, vacancy, BaseHandlerService.httpOptions)
      .pipe(
        catchError(this.handleErrorEditVacancy('updateVacancy', vacancy, null))
    );
  }

  getLastThreeVacancy(): Observable<ShortVacancy[]> {
    return this.http.get<ShortVacancy[]>(`${ApiUrls.SHORT_LAST_THREE_VACANCY}`, BaseHandlerService.httpOptions).pipe(
      map((shortVacancy: ShortVacancy[]) => shortVacancy.map(shortVacancy => ShortVacancy.convertToObj(shortVacancy))),
      catchError(this.handleError('getShortLastThreeVacancy', []))
    );
  }

  markVacancy(vacancy: Vacancy): Observable<Vacancy> {
    return this.http.post<Vacancy>(ApiUrls.MARK_VACANCY, vacancy, BaseHandlerService.httpOptions).pipe(
      map((vacancy: Vacancy) => Vacancy.convertToObj(vacancy)),
      catchError(this.handleError('markVacancy', null))
    );
  }

  offerVacancy(vacancyId, partnerId): Observable<number> {
    return this.http.get<number>(`${ApiUrls.OFFER_VACANCY}/${vacancyId}/${partnerId}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('offerVacancy', null))
    );
  }

  getYourAvailableShortVacancies(resumeId): Observable<ShortVacancy[]> {
    return this.http.get<ShortVacancy[]>(`${ApiUrls.VACANCIES_OFFER}/${resumeId}`, BaseHandlerService.httpOptions).pipe(
      map((shortVacancies: ShortVacancy[]) => shortVacancies.map(vacancy => ShortVacancy.convertToObj(vacancy))),
      catchError(this.handleError('getYourAvailableShortVacancies', []))
    );
  }

  getAllVacancyByCreator(filterStatusVacancy: FilterStatusVacancy, pageable: PageableParams): Observable<ShortVacancy[]> {
    return this.http.post<ShortVacancy[]>(`${ApiUrls.PARTNER_VACANCY}/${filterStatusVacancy}`, pageable).pipe(
      map((shortVacancy: ShortVacancy[]) => shortVacancy.map(shortVacancy => ShortVacancy.convertToObj(shortVacancy))),
      catchError(this.handleError('getAllVacancyByCreator', []))
    );
  }

  switchVacancyStatus(vacancy: Vacancy): Observable<Vacancy> {
    return this.http.post<Vacancy>(`${ApiUrls.SWITCH_STATUS_VACANCY}`, vacancy).pipe(
      map((vacancy: Vacancy) => Vacancy.convertToObj(vacancy)),
      catchError(this.handleError('switchVacancyStatus', null))
    );
  }

  protected handleErrorEditResume<T>(operation = 'operation', actualData: Resume,
    result?: T) {
      return this.handleErrorWithHandler(operation, null,
      () => {
        this.sessionStorage.set('create_content__saved_resume', JSON.stringify(actualData));
      }
    );
  }

  getMyDefaultResume(): Observable<Resume> {
    return this.http.get<Resume>(`${ApiUrls.PARTNER_DEFAULT_RESUME}`, BaseHandlerService.httpOptions).pipe(
      map(resume => Resume.convertToObj(resume)),
      catchError(this.handleError('getMyDefaultResume', null))
    );
  }

  createDefaultResume(resume: Resume): Observable<any> {
    resume.prepareBeforeSave();
    return this.http.post<Resume>(ApiUrls.PARTNER_CREATE_RESUME, resume, BaseHandlerService.httpOptions)
      .pipe(
        map((data: Resume) => Resume.convertToObj(data)),
        catchError(this.handleErrorEditResume('createDefaultResume', resume, null))
    );
  }

  updateDefaultResume(resume: Resume): Observable<any> {
    resume.prepareBeforeSave();
    return this.http.put<Resume>(ApiUrls.PARTNER_UPDATE_DEFAULT_RESUME, resume, BaseHandlerService.httpOptions)
      .pipe(
      map((data: Resume) => Resume.convertToObj(data)),
      catchError(this.handleErrorEditResume('updateDefaultResume', resume, null))
    );
  }

  createResume(resume: Resume): Observable<any> {
    resume.prepareBeforeSave();
    return this.http.post<Resume>(ApiUrls.VACANCY_CREATE_RESUME, resume, BaseHandlerService.httpOptions)
      .pipe(
        map((data: Resume) => Resume.convertToObj(data)),
        catchError(this.handleErrorEditResume('createResume', resume, null))
    );
  }

  getAllResumeVacancy(vacancyId: number): Observable<Resume[]> {
    return this.http.get<Resume[]>(`${ApiUrls.ALL_RESUME_VACANCY}/${vacancyId}`, BaseHandlerService.httpOptions).pipe(
      map((listResume: Resume[]) => listResume.map(resume => Resume.convertToObj(resume))),
      catchError(this.handleError('getAllResumeVacancy', []))
    );
  }

  deleteResume(resumeId: number): Observable<{}> {
    return this.http.delete(`${ApiUrls.PARTNER_RESUME}/${resumeId}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('deleteResume', null))
    );
  }

  getVacancyCreatorInfo(vacancyId: number): Observable<CustomerInfo> {
    return this.http.get<CustomerInfo>(`${ApiUrls.VACANCY_CREATOR_INFO}/${vacancyId}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('getVacancyCreatorInfo', {} as CustomerInfo))
    );
  }

  getVacanciesBySubmittedResume(pageableParams: PageableParams): Observable<ShortVacancy[]> {
    return this.http.post<ShortVacancy[]>(`${ApiUrls.VACANCIES_SUBMITTED_RESUME}`, pageableParams, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('getVacanciesBySubmittedResume', []))
    );
  }

  getFavoriteVacancies(pageableParams: PageableParams): Observable<ShortVacancy[]> {
    return this.http.post<ShortVacancy[]>(`${ApiUrls.FAVORITE_VACANCIES}`, pageableParams, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('getFavoriteVacancies', []))
    );
  }

  addCountShowing(vacancyId: number): Observable<number> {
    return this.http.get<number>(`${ApiUrls.SHOWING_VACANCIES}/${vacancyId}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('addCountShowing', null))
    );
  }

  getFavoritesResume(pageableParams: PageableParams): Observable<ShortResume[]> {
    return this.http.post<ShortResume[]>(`${ApiUrls.PARTNER_FAVORITES_RESUME}`, pageableParams, BaseHandlerService.httpOptions).pipe(
      map((favoritesResume: ShortResume[]) => favoritesResume.map(favoriteResume => ShortResume.convertToObj(favoriteResume))),
      catchError(this.handleError('getFavoritesResume', []))
    );
  }

  markResume(resume: Resume): Observable<Resume> {
    return this.http.post<Resume>(ApiUrls.MARK_RESUME, resume, BaseHandlerService.httpOptions).pipe(
      map((data: Resume) => Resume.convertToObj(data)),
      catchError(this.handleError('markResume', null))
    );
  }

  // checkResumeIsFavorite(resumeId): Observable<boolean> {
  //   return this.http.get<Resume[]>(`${ApiUrls.CHECK_RESUME}/${resumeId}`, BaseHandlerService.httpOptions).pipe(
  //     catchError(this.handleError('checkResumeIsFavorite', null))
  //   );
  // }

  addCountShowingResume(resumeId: number): Observable<number> {
    return this.http.get<number>(`${ApiUrls.SHOWING_RESUME}/${resumeId}`, BaseHandlerService.httpOptions).pipe(
    catchError(this.handleError('addCountShowingResume', null))
    );
  }

  getResumeCreatorInfo(resumeId: number): Observable<CustomerInfo> {
    return this.http.get<CustomerInfo>(`${ApiUrls.RESUME_CREATOR_INFO}/${resumeId}`, BaseHandlerService.httpOptions).pipe(
     catchError(this.handleError('getResumeCreatorInfo', null))
    );
  }

  getSubscription(): Observable<SubscriptionJob> {
    return this.http.get<SubscriptionJob>(ApiUrls.PARTNER_INFO_SUBSCRIBE, BaseHandlerService.httpOptions).pipe(
      map(data => SubscriptionJob.convertObj(data)),
      catchError(this.handleError('getSubscription', null))
    )
  }
}
