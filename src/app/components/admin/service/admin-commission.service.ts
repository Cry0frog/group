import { Offset } from 'src/app/common/offset';
import { catchError, map } from 'rxjs/operators';
import { Commission } from './../../../models/payment/commission';
import { AdminApiUrls } from './../adminApiUrls';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { BaseHandlerService } from './../../../common/services/service.base.handler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminCommissionService extends BaseHandlerService {

  constructor(private http: HttpClient,
      protected auth: AuthService) {
    super(auth);
  }

  getAllCommission(): Observable<Commission[]> {
    return this.http.get<Commission[]>(AdminApiUrls.COMMISSION, BaseHandlerService.httpOptions)
      .pipe(
        map((commissions: []) => commissions.map(commission => Commission.convertToObj(commission))),
        catchError(this.handleError('getAllCommission', []))
    );
  }

  addCommission(commission: Commission): Observable<Commission> {
    commission.offset = Offset.getCurTimeZone();
    return this.http.post<Commission>(AdminApiUrls.COMMISSION, commission, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('add commission error', {} as Commission))
    );
  }

  updateCommission(commission: Commission): Observable<Commission> {
    commission.offset = Offset.getCurTimeZone();
    return this.http.put<Commission>(AdminApiUrls.COMMISSION, commission, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('update commission error', {} as Commission))
    );
  }

  deleteCommission(commission: Commission): Observable<number> {
    return this.http.delete(`${AdminApiUrls.COMMISSION}${commission.id}`).pipe(
      catchError(this.handleError('delete commission error', null))
    );
  }
}
