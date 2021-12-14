import { RegionStatisticUsers } from './../../../models/region_statistic_users/regionStatisticUsers';
import { StatisticSettings } from './../../../models/statistics/statisticSettings';
import { AdminApiUrls } from './../adminApiUrls';
import { StatisticResponse } from './../../../models/statistics/statisticResponse';
import { map, catchError } from 'rxjs/operators';
import { BaseHandlerService } from './../../../common/services/service.base.handler';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class AdminStatisticsService extends BaseHandlerService {

  static fileHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/octet-stream'
    })
  };

  constructor(private http: HttpClient,
      protected auth: AuthService) {
    super(auth);
  }

  getChartActivityUsers(settings: StatisticSettings): Observable<StatisticResponse> {
    return this.http.post<StatisticResponse>(AdminApiUrls.STATISTICS_ACTIVITY_USERS, settings, BaseHandlerService.httpOptions)
    .pipe(
      map(el => StatisticResponse.convertToObj(el)),
      catchError(this.handleError('getChartActivityUsers', null))
    );
  }

  getChartCountOfOrders(settings: StatisticSettings): Observable<StatisticResponse> {
    return this.http.post<StatisticResponse>(AdminApiUrls.STATISTICS_COUNT_ALL_ORDERS, settings, BaseHandlerService.httpOptions)
    .pipe(
      map(el => StatisticResponse.convertToObj(el)),
      catchError(this.handleError('getChartCountOfOrders', null))
    );
  }

  getChartAverageCheck(settings: StatisticSettings): Observable<StatisticResponse> {
    return this.http.post<StatisticResponse>(AdminApiUrls.STATISTICS_AVERAGE_CHECK, settings, BaseHandlerService.httpOptions)
    .pipe(
      map(el => StatisticResponse.convertToObj(el)),
      catchError(this.handleError('getChartAverageCheck', null))
    );
  }

  getChartNumberOfSalesSuccess(settings: StatisticSettings): Observable<StatisticResponse> {
    return this.http.post<StatisticResponse>(AdminApiUrls.STATISTICS_SALES_SUCCESS, settings, BaseHandlerService.httpOptions)
    .pipe(
      map(el => StatisticResponse.convertToObj(el)),
      catchError(this.handleError('getChartNumberOfSalesSuccess', null))
    );
  }

  getChartRevenue(settings: StatisticSettings): Observable<StatisticResponse> {
    return this.http.post<StatisticResponse>(AdminApiUrls.STATISTICS_REVENUE, settings, BaseHandlerService.httpOptions)
    .pipe(
      map(el => StatisticResponse.convertToObj(el)),
      catchError(this.handleError('getChartRevenue', null))
    );
  }

  getChartPayout(settings: StatisticSettings): Observable<StatisticResponse> {
    return this.http.post<StatisticResponse>(AdminApiUrls.STATISTICS_PAYOUT, settings, BaseHandlerService.httpOptions)
    .pipe(
      map(el => StatisticResponse.convertToObj(el)),
      catchError(this.handleError('getChartPayout', null))
    );
  }

  getChartCountReg(settings: StatisticSettings): Observable<StatisticResponse> {
    return this.http.post<StatisticResponse>(AdminApiUrls.STATISTICS_COUNT_REG, settings, BaseHandlerService.httpOptions)
    .pipe(
      map(el => StatisticResponse.convertToObj(el)),
      catchError(this.handleError('getChartCountReg', null))
    );
  }

  getChartCountRegPerformers(settings: StatisticSettings): Observable<StatisticResponse> {
    return this.http.post<StatisticResponse>(AdminApiUrls.STATISTICS_COUNT_REG_PERFORMERS, settings, BaseHandlerService.httpOptions)
    .pipe(
      map(el => StatisticResponse.convertToObj(el)),
      catchError(this.handleError('getChartCountRegPerformers', null))
    );
  }

  getChartSurveyResult(settings: StatisticSettings): Observable<StatisticResponse> {
    return this.http.post<StatisticResponse>(AdminApiUrls.STATISTICS_SURVEY_RESULT, settings, BaseHandlerService.httpOptions)
    .pipe(
      map(el => StatisticResponse.convertToObj(el)),
      catchError(this.handleError('getChartSurveyResult', null))
    );
  }

  getRegionUsersRegistrationStatistics(settings: StatisticSettings): Observable<RegionStatisticUsers[]> {
    return this.http.post<RegionStatisticUsers[]>(AdminApiUrls.STATISTICS_REGION_USERS, settings, BaseHandlerService.httpOptions)
    .pipe(
      map((statistics: RegionStatisticUsers[]) => statistics.map(statistic => RegionStatisticUsers.convertToObj(statistic))),
      catchError(this.handleError('getChartSurveyResult', []))
    );
  }

  getChartNewVacancies(settings: StatisticSettings): Observable<StatisticResponse> {
    return this.http.post<StatisticResponse>(AdminApiUrls.STATISTICS_NEW_VACANCIES, settings, BaseHandlerService.httpOptions)
    .pipe(
      map(el => StatisticResponse.convertToObj(el)),
      catchError(this.handleError('getChartCreateVacancy', null))
    );
  }

  getChartNewDefResume(settings: StatisticSettings): Observable<StatisticResponse> {
    return this.http.post<StatisticResponse>(AdminApiUrls.STATISTICS_NEW_DEF_RESUME, settings, BaseHandlerService.httpOptions)
    .pipe(
      map(el => StatisticResponse.convertToObj(el)),
      catchError(this.handleError('getChartNewDefResume', null))
    );
  }

  getSubmittedResumeChart(settings: StatisticSettings): Observable<StatisticResponse> {
    return this.http.post<StatisticResponse>(AdminApiUrls.STATISTICS_SUBMITTED_RESUME, settings, BaseHandlerService.httpOptions)
    .pipe(
      map(el => StatisticResponse.convertToObj(el)),
      catchError(this.handleError('getSubmittedResumeChart', null))
    );
  }

  getStatisticReportByCountOfOrders(settings: StatisticSettings) {
    this.getChartCommonReport(AdminApiUrls.STATISTICS_REPORT_COUNT_ORDERS,
      settings
    );
  }

  getStatisticReportByAverageCheck(settings: StatisticSettings) {
    this.getChartCommonReport(AdminApiUrls.STATISTICS_REPORT_AVERAGE_CHECK,
      settings
    );
  }

  getStatisticReportByNumberOfSales(settings: StatisticSettings) {
    this.getChartCommonReport(AdminApiUrls.STATISTICS_REPORT_NUMBER_OF_SALES,
      settings
    );
  }

  getStatisticReportByRevenue(settings: StatisticSettings) {
    this.getChartCommonReport(AdminApiUrls.STATISTICS_REPORT_REVENUE,
      settings
    );
  }

  getStatisticReportByPayout(settings: StatisticSettings) {
    this.getChartCommonReport(AdminApiUrls.STATISTICS_REPORT_PAYOUT,
      settings
    );
  }

  getStatisticReportRegistration(settings: StatisticSettings) {
    this.getChartCommonReport(AdminApiUrls.STATISTICS_REPORT_REG,
      settings
    );
  }

  getStatisticReportRegistrationPerformers(settings: StatisticSettings) {
    this.getChartCommonReport(AdminApiUrls.STATISTICS_REPORT_REG_PERFORMERS,
      settings
    );
  }

  getStatisticFullReportRegistration(settings: StatisticSettings) {
    this.getChartCommonReport(AdminApiUrls.STATISTICS_FULL_REPORT_REG,
      settings
    );
  }

  getStatisticReportPartnershipRequests() {
    this.getChartCommonReport(AdminApiUrls.STATISTICS_REPORT_PARTNERSHIP_REQUEST,
      null
    );
  }

  private getChartCommonReport(reportUrl: string, settings: StatisticSettings) {
    var oReq = new XMLHttpRequest();
    oReq.open("POST",  reportUrl, true);
    oReq.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    oReq.responseType = "arraybuffer";
    oReq.withCredentials = true;
    oReq.send(JSON.stringify(settings));
    oReq.onload = function(oEvent) {
        var arrayBuffer = oReq.response;
        var byteArray = new Uint8Array(arrayBuffer);
        const strHeader = oReq.getResponseHeader('content-disposition');
        const filename = strHeader.substring(strHeader.indexOf('filename="') + 'filename="'.length,
          strHeader.length -1);
        saveExcelFile(byteArray, filename);
    };

    //oReq.send();
  }

}

export const saveExcelFile = (data, filename) => {
  saveAs(
      new Blob([data], {
          type: 'application/octet-stream'
      }),
      filename
  );
};
