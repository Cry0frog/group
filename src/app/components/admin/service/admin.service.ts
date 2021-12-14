import { ShortVacanciesWithCountedPages } from './../../../models/vacancy/shortVacanciesWithCountedPages';
import { FieldActivity } from './../../../models/field-activity/fileldActivity';
import { FilterRole } from './../../../auth/filterRole';
import { ParticipantsPromotionWithCountedPages } from 'src/app/models/promotion/participantsPromotionWithCountedPages';
import { ShortTaskWithCountedPages } from 'src/app/models/task/shortTasksWithCountedPages';
import { ShortPartnersWitCountedPages } from './../../../models/partner/shortPartnersWitCountedPages';
import { ShortPromotion } from '../../../models/promotion/shortPromotion';
import { ReplenishmentBonusesOfAdmin } from './../../../models/admin/replenishmentBonusesOfAdmin';
import { GeoCityProperty } from './../../../models/map/geo/city/geoCityProperty';
import { CategoryTree } from './../../../models/category/categoryTree';
import { Rate } from './../../../models/rates/rate';
import { BaseHandlerService } from './../../../common/services/service.base.handler';
import { AdminApiUrls } from './../adminApiUrls';
import { AuthService } from './../../../auth/auth.service';
import { tap, catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from 'src/app/models/category/category';
import { ShortPartner } from 'src/app/models/partner/shortPartner'
import { RatesWithCountedPages } from 'src/app/models/rates/ratesWithCountedPages';
import { ResorceUploadState } from 'src/app/models/common/resorceUploadState';
import { ShortLegalEntity } from 'src/app/models/legal-entity-info/shortLegalEntity';
import { AdminSetting } from 'src/app/models/auth/adminSetting';
import { PublicAdvertising } from 'src/app/models/advertising/publicAdvertising';
import { ShortBlockedUsers } from 'src/app/models/partner/shortBlockedUsers';
import { FilterStatusCommonType } from 'src/app/models/task/filterStatusCommonType';
import { ShortPartnerPromotion } from 'src/app/models/promotion/shortPartnerPromotion';
import { SendingNotificationOfAdmin } from 'src/app/models/admin/sendingNotificationOfAdmin';
import { ShortLegalEntityWithCountedPages } from 'src/app/models/legal-entity-info/shortLegalEntityWithCountedPages';
import { ShortNews } from 'src/app/models/news/shortNews';
import { ShortResumeWithCountedPages } from 'src/app/models/resume/shortResumeWithCountedPages';


@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseHandlerService {

  constructor(private http: HttpClient,
      protected auth: AuthService) {
    super(auth);
  }

  getUsedSities(): Observable<GeoCityProperty[]> {
    return this.http.get<GeoCityProperty[]>(AdminApiUrls.USED_CITIES, BaseHandlerService.httpOptions)
    .pipe(
      map((cities: []) => cities.map(city => GeoCityProperty.convertToObj(city, null))),
      catchError(this.handleError('getUsedSities', []))
    );
  }

  getAllCategories(): Observable<CategoryTree[]> {
    return this.http.get<CategoryTree[]>(AdminApiUrls.SHORT_CATEGORIES, BaseHandlerService.httpOptions)
    .pipe(
      map((categories: []) => categories.map(category => CategoryTree.convertToObj(category, true))),
      catchError(this.handleError('getAllCategories', []))
    );
  }

  getAllCategoriesWithProperties(): Observable<CategoryTree[]> {
    return this.http.get<CategoryTree[]>(AdminApiUrls.CATEGORIES, BaseHandlerService.httpOptions)
    .pipe(
      map((categories: []) => categories.map(category => CategoryTree.convertToObj(category, true))),
      catchError(this.handleError('getAllCategoriesWithProperties', []))
    );
  }

  addCategory(category: Category): Observable<Category> {
    category.prepareBeforeSave();
    return this.http.post<Category>(AdminApiUrls.CATEGORIES, category, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('add category error', {} as Category))
    );
  }

  updateImgCategory(image: FormData, categoryId: number): Observable<ResorceUploadState> {
    return this.http.post<FormData>(`${AdminApiUrls.CATEGORY_IMG}${categoryId}`, image).pipe(
      catchError(this.handleError('updateUserPhoto', {} as any))
    );
  }

  updateCategory(category: Category): Observable<Category> {
    category.prepareBeforeSave();
    category.children = null;
    return this.http.put<Category>(AdminApiUrls.CATEGORIES, category, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('update category error', {} as Category))
    );
  }

  deleteCategory(category: Category): Observable<number> {
    return this.http.delete(`${AdminApiUrls.CATEGORIES}${category.id}`).pipe(
      catchError(this.handleError('delete category error', null))
    );
  }

  transferCategory(category: Category): Observable<Category> {
    category.prepareBeforeSave();
    return this.http.put<Category>(AdminApiUrls.CATEGORY_TRANSFER, category, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('transfer category error', null))
    );
  }

  moveCategory(firtId: number, firstOrder: number, secondId: number, secondOrder: number) {
    return this.http.put<Category>(`${AdminApiUrls.CATEGORY_MOVE}/${firtId}/${firstOrder}/${secondId}/${secondOrder}`,
      BaseHandlerService.httpOptions
    ).pipe(
        catchError(this.handleError('move category error', null))
    );
  }

  getAllFolderCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(AdminApiUrls.CATEGORY_FOLDER, BaseHandlerService.httpOptions).pipe(
      tap(data => this.log('fetched all folder')),
      catchError(this.handleError('getAllFolderCategories', []))
    );
  }

  getAllShortPartners(params: ShortPartnersWitCountedPages): Observable<ShortPartnersWitCountedPages> {
    return this.http.get<ShortPartnersWitCountedPages>(
      `${AdminApiUrls.USERS}${params.pageableParams.page}/${params.pageableParams.size}/${params.sortParams.typeSort}/${params.sortParams.nameSort}/${params.filterRole}?search=${params.search}`,
      BaseHandlerService.httpOptions
    ).pipe(
      map((data: ShortPartnersWitCountedPages) => ShortPartnersWitCountedPages.convertToObj(data)),
      //tap(data => this.log('fetched all shortPartners for shortPartners')),
      catchError(this.handleError('getAllShortPartners', null))
    );
  }

  getAllLegalEntities(filterRole: FilterRole) :Observable<ShortLegalEntity[]> {
    return this.http.get<ShortLegalEntity[]>(`${AdminApiUrls.ALL_LEGAL_ENTITIES}/${filterRole}`, BaseHandlerService.httpOptions).pipe(
      map((users: ShortLegalEntity[]) => users.map(user => ShortLegalEntity.convertToObj(user))),
      catchError(this.handleError('getAllLegalEntities', []))
    );
  }

  getAllUsers(filterRole: FilterRole): Observable<ShortPartner[]> {
    return this.http.get<ShortPartner[]>(`${AdminApiUrls.ALL_USERS}/${filterRole}`, BaseHandlerService.httpOptions).pipe(
      map((users: ShortPartner[]) => users.map(user => ShortPartner.convertToObjForSelectedAllUsers(user))),
      catchError(this.handleError('getAllUsers', []))
    );
  }

  addShortPartner(shortPartner: ShortPartner): Observable<ShortPartner> {
    return this.http.post<ShortPartner>(AdminApiUrls.USERS, shortPartner, BaseHandlerService.httpOptions);
  }

  deleteShortPartner(id: number): Observable<{}> {
    return this.http.delete(`${AdminApiUrls.USERS}${id}`);
  }

  updateShortPartner(shortPartner: ShortPartner): Observable<ShortPartner> {
    return this.http.put<ShortPartner>(AdminApiUrls.USERS, shortPartner);
  }

  updateStatus(shortPartner: ShortPartner): Observable<ShortPartner> {
    return this.http.put<ShortPartner>(`${AdminApiUrls.STATUS}/${shortPartner.id}`, shortPartner);
  }

  getAllShortTasks(params: ShortTaskWithCountedPages, filterStatusCommonType: FilterStatusCommonType): Observable<ShortTaskWithCountedPages> {
    return this.http.get<ShortTaskWithCountedPages>(
      `${AdminApiUrls.ALL_TASKS}/${params.pageableParams.page}/${params.pageableParams.size}/${params.sortParams.typeSort}/${params.sortParams.nameSort}/${filterStatusCommonType}/?search=${params.search}`,
      BaseHandlerService.httpOptions)
    .pipe(
      map((task: ShortTaskWithCountedPages) => ShortTaskWithCountedPages.convertToObj(task)),
      catchError(this.handleError('getAllShortTasks', null))
    );
  }

  deleteTask(id: number, message: string): Observable<number> {
    if(message != null) {
      BaseHandlerService.httpOptions.params = new HttpParams()
        .set('message', message);
    }
    return this.http.delete(`${AdminApiUrls.DELETE_TASK}/${id}`, BaseHandlerService.httpOptions)
    .pipe(catchError(this.handleError('deleteTask', null)));
  }

  getAllParticipantsPromotions(params: ParticipantsPromotionWithCountedPages): Observable<ShortPartnerPromotion[]> {
    return this.http.get<ShortPartnerPromotion[]>(
      `${AdminApiUrls.ALL_PARTICIPANTS}/${params.pageableParams.page}/${params.pageableParams.size}/${params.sortParams.typeSort}/${params.sortParams.nameSort}?search=${params.search}`,
      BaseHandlerService.httpOptions
    )
    .pipe(
      map((partners: []) => partners.map(partner => ShortPartnerPromotion.convertToObjWithFriends(partner))),
      catchError(this.handleError('getAllShortPartnerShare', []))
    );
  }

  changeStatusPaymentForPartnerPromotion(row: ShortPartnerPromotion): Observable<ShortPartnerPromotion> {
    return this.http.put<ShortPartnerPromotion>(`${AdminApiUrls.CHANGE_STATUS_PAYMENT_PARTNER_PROMOTION}`, row, BaseHandlerService.httpOptions)
    .pipe(
      catchError(this.handleError('changeStatusPaymentForPartnerPromotion', null))
    );
  }

  replenishmentBonuses(replenishmentBonusesOfAdmin: ReplenishmentBonusesOfAdmin): Observable<ReplenishmentBonusesOfAdmin> {
    return this.http.post<ReplenishmentBonusesOfAdmin>(AdminApiUrls.BONUSES_USERS, replenishmentBonusesOfAdmin, BaseHandlerService.httpOptions)
    .pipe(catchError(this.handleError('replenishmentBonuses', null)));
  }

  sendMessages(sendingNotificationOfAdmin: SendingNotificationOfAdmin): Observable<SendingNotificationOfAdmin> {
    return this.http.post<SendingNotificationOfAdmin>(AdminApiUrls.MESSAGE_USERS, sendingNotificationOfAdmin, BaseHandlerService.httpOptions)
    .pipe(catchError(this.handleError('sendNotifications', null)));

  }

  getAllShortPromotions(): Observable<ShortPromotion[]> {
    return this.http.get<ShortPromotion[]>(`${AdminApiUrls.ADMIN_PROMOTION}`, BaseHandlerService.httpOptions).pipe(
      map((promotions: []) => promotions.map(promo => ShortPromotion.convertToObj(promo))),
      catchError(this.handleError('getAllShortPromotion', []))
    );
  }

  createShortPromotion(shortAdminPromotion: ShortPromotion): Observable<ShortPromotion> {
    return this.http.post<ShortPromotion>(`${AdminApiUrls.ADMIN_PROMOTION}`, shortAdminPromotion, BaseHandlerService.httpOptions).pipe(
      map(promo => ShortPromotion.convertToObj(promo)),
      catchError(this.handleError('createShortPromotion', null))
    );
  }

  updateShortPromotion(shortAdminPromotion: ShortPromotion): Observable<ShortPromotion> {
    return this.http.put<ShortPromotion>(`${AdminApiUrls.ADMIN_PROMOTION}`, shortAdminPromotion, BaseHandlerService.httpOptions).pipe(
      map(promo => ShortPromotion.convertToObj(promo)),
      catchError(this.handleError('updateShortPromotion', null))
    );
  }

  deleteShortPromotion(id: number): Observable<number> {
    return this.http.delete<ShortPromotion>(`${AdminApiUrls.ADMIN_PROMOTION}/${id}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('deleteShortPromotion', null))
    );
  }

  updateImgPromotion(image: FormData, id: number): Observable<ResorceUploadState> {
    return this.http.post<FormData>(`${AdminApiUrls.ADMIN_PROMOTION_PHOTO}/${id}`, image).pipe(
      catchError(this.handleError('updateImgPromotion', {} as any))
    );
  }

  blockUsers(shortPartner: ShortPartner): Observable<ShortPartner> {
    return this.http.put<ShortPartner>(AdminApiUrls.BLOCK_USERS, shortPartner, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('blockUsers', null))
    );
  }

  getAllRates(ratesWithPages :RatesWithCountedPages): Observable<RatesWithCountedPages> {
    return this.http.get<RatesWithCountedPages>(`${AdminApiUrls.RATES}${ratesWithPages.nameToSort}/${ratesWithPages.typeToSort}/${ratesWithPages.pageIndex}/${ratesWithPages.pageSize}/${ratesWithPages.search}`,
      BaseHandlerService.httpOptions)
      .pipe(
        map((ratesWithPages: RatesWithCountedPages) =>
          RatesWithCountedPages.convertToObj(ratesWithPages)
      ),
      catchError(this.handleError('getAllRates', null))
    );
  }

  addRate(rate: Rate): Observable<Rate> {
    return this.http.post<Rate>(AdminApiUrls.RATES, rate, BaseHandlerService.httpOptions);
  }

  updateRate(rate: Rate): Observable<Rate> {
    return this.http.put<Rate>(AdminApiUrls.RATES, rate, BaseHandlerService.httpOptions);
  }

  deleteRate(id: number): Observable<{}> {
    return this.http.delete(`${AdminApiUrls.RATES}${id}`, BaseHandlerService.httpOptions);
  }

  getAllShortLegalEntity(params: ShortLegalEntityWithCountedPages): Observable<ShortLegalEntityWithCountedPages> {
    return this.http.get<ShortLegalEntityWithCountedPages>(
      `${AdminApiUrls.SHORT_LEGAL_ENTITY}/${params.pageableParams.page}/${params.pageableParams.size}/${params.sortParams.typeSort}/${params.sortParams.nameSort}/${params.filterRole}?search=${params.search}`,
      BaseHandlerService.httpOptions)
    .pipe(
      map((data: ShortLegalEntityWithCountedPages) => ShortLegalEntityWithCountedPages.convertToObj(data)),
      catchError(this.handleError('getAllShortPartners', null))
    );
  }

  changeEnableLegalEntity(shortLegalEntity: ShortLegalEntity): Observable<ShortLegalEntity> {
    return this.http.put<ShortLegalEntity>(`${AdminApiUrls.ENABLE}`, shortLegalEntity, BaseHandlerService.httpOptions)
    .pipe(
      catchError(this.handleError('changeEnable', null))
    );
  }

  changeStatusLegalEntity(shortLegalEntity: ShortLegalEntity): Observable<ShortLegalEntity> {
    return this.http.put<ShortLegalEntity>(`${AdminApiUrls.LEGAL_ENTITY_STATUS}`, shortLegalEntity, BaseHandlerService.httpOptions)
    .pipe(
      catchError(this.handleError('changeStatusLegalEntity', null))
    );
  }

  blockLegalEntity(shortLegalEntity: ShortLegalEntity): Observable<ShortLegalEntity> {
    return this.http.put<ShortLegalEntity>(`${AdminApiUrls.BLOCK_LEGAL_ENTITY}`, shortLegalEntity, BaseHandlerService.httpOptions)
    .pipe(
      catchError(this.handleError('blockLegalEntity', null))
    );
  }


  getAdminSetting(): Observable<AdminSetting> {
    return this.http.get<AdminSetting>(AdminApiUrls.ADMIN_SETTING, BaseHandlerService.httpOptions)
    .pipe(
      map(adminSetting => AdminSetting.convertToObj(adminSetting)),
      catchError(this.handleError('getAdminSetting', null))
    );
  }

  editSetting(setting: AdminSetting): Observable<AdminSetting> {
    return this.http.put<AdminSetting>(AdminApiUrls.ADMIN_SETTING, setting, BaseHandlerService.httpOptions)
    .pipe(
      catchError(this.handleError('editSetting', null))
    );
  }

  getAllAdvertises(): Observable<PublicAdvertising[]> {
    return this.http.get<PublicAdvertising[]>(AdminApiUrls.ALL_ADVERTISING, BaseHandlerService.httpOptions)
    .pipe(
      catchError(this.handleError('getAllAdvertising', []))
    );
  }

  addAdvertising(publicAdvertising: PublicAdvertising): Observable<PublicAdvertising> {
    return this.http.post<PublicAdvertising>(AdminApiUrls.ADD_ADVERTISING, publicAdvertising, BaseHandlerService.httpOptions)
    .pipe(
      catchError(this.handleError('addAdvertising', null))
    );
  }

  editAdvertising(publicAdvertising: PublicAdvertising): Observable<PublicAdvertising> {
    return this.http.put<PublicAdvertising>(AdminApiUrls.EDIT_ADVERTISING, publicAdvertising, BaseHandlerService.httpOptions)
    .pipe(
      catchError(this.handleError('editAdvertising', null))
    );
  }

  deleteAdvertising(id: number): Observable<{}> {
    return this.http.delete(`${AdminApiUrls.DELETE_ADVERTISING}/${id}`, BaseHandlerService.httpOptions)
    .pipe(
      catchError(this.handleError('deleteAdvertising', null))
    );
  }

  getAllShortBlockedUsers(): Observable<ShortBlockedUsers[]> {
    return this.http.get<ShortBlockedUsers[]>(AdminApiUrls.BLOCKED_USERS, BaseHandlerService.httpOptions)
    .pipe(
      catchError(this.handleError('getAllShortBlockedUsers', []))
    );
  }

  getAllNews(): Observable<ShortNews[]> {
    return this.http.get<ShortNews[]>(AdminApiUrls.ADMIN_ALL_NEWS, BaseHandlerService.httpOptions)
    .pipe(
      map((newsList: ShortNews[]) => newsList.map((news: ShortNews) => ShortNews.convertToObj(news))),
      catchError(this.handleError('getAllNews', []))
    );
  }

  addNews(news: ShortNews): Observable<ShortNews> {
    return this.http.post<ShortNews>(AdminApiUrls.ADMIN_NEWS, news, BaseHandlerService.httpOptions)
    .pipe(
      map((news: ShortNews) => ShortNews.convertToObj(news)),
      catchError(this.handleError('addNews', null as ShortNews))
    );
  }

  editNews(news: ShortNews): Observable<ShortNews> {
    return this.http.put<ShortNews>(AdminApiUrls.ADMIN_NEWS, news, BaseHandlerService.httpOptions)
    .pipe(
      map((news: ShortNews) => ShortNews.convertToObj(news)),
      catchError(this.handleError('editAdvertising', null as ShortNews))
    );
  }

  deleteNews(id: number): Observable<{}> {
    return this.http.delete(`${AdminApiUrls.ADMIN_NEWS}/${id}`, BaseHandlerService.httpOptions)
    .pipe(
      catchError(this.handleError('deleteNews', null))
    );
  }

  updateImgNews(image: FormData, id: number): Observable<ResorceUploadState> {
    return this.http.post<FormData>(`${AdminApiUrls.ADMIN_NEWS_PHOTO}/${id}`, image).pipe(
      catchError(this.handleError('updateImgNews', {} as any))
    );
  }

  getAllFieldsActivity(): Observable<FieldActivity[]> {
    return this.http.get<FieldActivity[]>(AdminApiUrls.FIELD_ACTIVITY, BaseHandlerService.httpOptions)
    .pipe(
      map((categories: []) => categories.map(category => FieldActivity.convertToObj(category, false))),
      catchError(this.handleError('getAllFieldsActivity', []))
    );
  }

  addFieldActivity(fieldActivity: FieldActivity): Observable<FieldActivity> {
    return this.http.post<FieldActivity>(AdminApiUrls.FIELD_ACTIVITY, fieldActivity, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('add FieldActivity error', {} as FieldActivity))
    );
  }

  updateFieldActivity(fieldActivity: FieldActivity): Observable<FieldActivity> {
    return this.http.put<FieldActivity>(AdminApiUrls.FIELD_ACTIVITY, fieldActivity, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('update FieldActivity error', {} as FieldActivity))
    );
  }

  deleteFieldActivity(id: number): Observable<number> {
    return this.http.delete<number>(`${AdminApiUrls.FIELD_ACTIVITY}/${id}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('delete FieldActivity error', null))
    );
  }

  getAllShortVacancies(params: ShortVacanciesWithCountedPages): Observable<ShortVacanciesWithCountedPages> {
    return this.http.get<ShortVacanciesWithCountedPages>(
      `${AdminApiUrls.ALL_VACANCIES}/${params.pageableParams.page}/${params.pageableParams.size}/${params.sortParams.typeSort}/${params.sortParams.nameSort}/${params.filterStatusVacancy}/?search=${params.search}`,
      BaseHandlerService.httpOptions)
    .pipe(
      map((vacancies: ShortVacanciesWithCountedPages) => ShortVacanciesWithCountedPages.convertToObj(vacancies)),
      catchError(this.handleError('getAllShortVacancies', null))
    );
  }

  deleteVacancy(id: number, message: string): Observable<number> {
    if(message != null) {
      BaseHandlerService.httpOptions.params = new HttpParams()
        .set('message', message);
    }
    return this.http.delete(`${AdminApiUrls.ALL_VACANCIES}/${id}`, BaseHandlerService.httpOptions)
    .pipe(catchError(this.handleError('deleteVacancy', null)));
  }

  updateImgFieldActivity(image: FormData, fieldActivityId: number): Observable<ResorceUploadState> {
    return this.http.post<FormData>(`${AdminApiUrls.CATEGORY_FIELD_ACTIVITY}/${fieldActivityId}`, image).pipe(
      catchError(this.handleError('updateImgFieldActivity', {} as any))
    );
  }

  getAllShortResume(params: ShortResumeWithCountedPages): Observable<ShortResumeWithCountedPages> {
    return this.http.get<ShortResumeWithCountedPages>(
      `${AdminApiUrls.ALL_RESUME}/${params.pageableParams.page}/${params.pageableParams.size}/${params.sortParams.typeSort}/${params.sortParams.nameSort}/${params.filterStatusResume}?search=${params.search}`,
      BaseHandlerService.httpOptions)
    .pipe(
      map((resumeList: ShortResumeWithCountedPages) => ShortResumeWithCountedPages.convertToObj(resumeList)),
      catchError(this.handleError('getAllShortResume', null))
    );
  }

  deleteResume(id: number, message: string): Observable<number> {
    if(message != null) {
      BaseHandlerService.httpOptions.params = new HttpParams()
        .set('message', message);
    }
    return this.http.delete(`${AdminApiUrls.ALL_RESUME}/${id}`, BaseHandlerService.httpOptions)
    .pipe(catchError(this.handleError('deleteResume', null)));
  }
}
