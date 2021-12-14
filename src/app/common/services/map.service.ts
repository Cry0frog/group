import { BaseHandlerService } from './service.base.handler';
import { PointToPointPathResponse } from './../../models/map/pointToPointPathResponse';
import { AuthService } from './../../auth/auth.service';
import { tap, catchError } from 'rxjs/operators';
import { ApiUrls } from './../../auth/activeUrls';
import { PointToPointRequest } from './../../models/map/pointToPointRequest';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapService extends BaseHandlerService {

  constructor(private http: HttpClient,
      protected auth: AuthService) {
    super(auth);
  }

  getPathFromStartToEnd(pointToPointRequest: PointToPointRequest): Observable<PointToPointPathResponse> {
    return this.http.post<PointToPointPathResponse>(ApiUrls.MAP_PATH_FROM_START_TO_END, pointToPointRequest, BaseHandlerService.httpOptions)
      .pipe(
        tap((data: any) => this.log('getPathFromStartToEnd')),
        catchError(this.handleError('getPathFromStartToEnd error', []))
    );
  }

}
