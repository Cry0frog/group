import { FilterTaskStatus } from './../components/development/fake-tasks/filterTaskStatus';
import { DevelopmentTasksWithCountedPages } from './../../../models/development/developmentTasksWithCountedPages';
import { DevelopmentPartnersWithCountedPages } from './../../../models/development/developmentPartnersWithCountedPages';
import { PlannedTask } from './../../../models/development/plannedTask';
import { AdminApiUrls } from './../adminApiUrls';
import { AuthService } from './../../../auth/auth.service';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ResorceUploadState } from 'src/app/models/common/resorceUploadState';

import { BaseHandlerService } from './../../../common/services/service.base.handler';
import { Injectable } from '@angular/core';
import { DevelopmentPartner as DevelopmentPartner } from 'src/app/models/development/developmentPartner';

@Injectable({
  providedIn: 'root'
})
export class DevelopmentService extends BaseHandlerService {

  constructor(private http: HttpClient,
      protected auth: AuthService) {
    super(auth);
  }

//tasks

  getAllPlannedTasks(params: DevelopmentTasksWithCountedPages, filter: FilterTaskStatus): Observable<DevelopmentTasksWithCountedPages> {
    return this.http.get<DevelopmentTasksWithCountedPages>(
        `${AdminApiUrls.DEV_TASK}/${params.pageableParams.page}/${params.pageableParams.size}/${params.sortParams.typeSort}/${params.sortParams.nameSort}/${filter}/?search=${params.search}`,
        BaseHandlerService.httpOptions).pipe(
      map(task => DevelopmentTasksWithCountedPages.convertToObj(task)),
    );
  }

  addPlannedTask(task: PlannedTask): Observable<PlannedTask> {
    return this.http.post<PlannedTask>(AdminApiUrls.DEV_TASK, task, BaseHandlerService.httpOptions).pipe(
      map((task: PlannedTask) => PlannedTask.convertToObj(task)),
    );
  }

  updatePlannedTask(task: PlannedTask): Observable<PlannedTask> {
    return this.http.put<PlannedTask>(AdminApiUrls.DEV_TASK, task).pipe(
      map((task: PlannedTask) => PlannedTask.convertToObj(task)),
    );
  }

  deletePlannedTask(taskId: number): Observable<number> {
    return this.http.delete(`${AdminApiUrls.DEV_TASK}/${taskId}`).pipe(
      catchError(this.handleError('delete planned error', null))
    );
  }

  getTaskWithPropertyByTaskId(id: number): Observable<PlannedTask> {
    return this.http.get<PlannedTask>(`${AdminApiUrls.DEV_TASK_BASE}/${id}`).pipe(
      map((task: PlannedTask) => PlannedTask.convertToObj(task))
    );
  }

//partners

  getAllDevelopmentPartners(): Observable<DevelopmentPartner[]> {
    return this.http.get<DevelopmentPartner[]>(AdminApiUrls.DEV_PARTNER, BaseHandlerService.httpOptions).pipe(
      map((partners: []) => partners.map(partner => DevelopmentPartner.convertToObj(partner))),
    );
  }

  getAllDevelopmentPartnersWithCountedPages(params: DevelopmentPartnersWithCountedPages): Observable<DevelopmentPartnersWithCountedPages> {
    return this.http.get<DevelopmentPartnersWithCountedPages>(
        `${AdminApiUrls.DEV_PARTNER_BY_PAGES}/${params.pageableParams.page}/${params.pageableParams.size}/${params.sortParams.typeSort}/${params.sortParams.nameSort}?search=${params.search}`,
        BaseHandlerService.httpOptions)
    .pipe(
      map(fake => DevelopmentPartnersWithCountedPages.convertToObj(fake)),
    );
  }

  addDevelopmentPartner(partner: DevelopmentPartner): Observable<DevelopmentPartner> {
    return this.http.post<DevelopmentPartner>(AdminApiUrls.DEV_PARTNER, partner, BaseHandlerService.httpOptions).pipe(
      map((partner: DevelopmentPartner) => DevelopmentPartner.convertToObj(partner)),
    );
  }

  updateDevelopmentPartner(partner: DevelopmentPartner): Observable<DevelopmentPartner> {
    return this.http.put<DevelopmentPartner>(AdminApiUrls.DEV_PARTNER, partner).pipe(
      map((partner: DevelopmentPartner) => DevelopmentPartner.convertToObj(partner)),
    );
  }

  updateDevelopmentPhoto(image: FormData, idPartner: number): Observable<ResorceUploadState> {
    return this.http.post<FormData>(`${AdminApiUrls.PHOTO_DEV_PARTNER}/${idPartner}`, image).pipe(
      catchError(this.handleError('updateDevelopmentPhoto', {} as any))
    );
  }
}
