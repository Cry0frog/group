import { RegionalHourCost } from './../../../models/rates/regionalHourCost';
import { PaymentCalc } from './../../../models/payment/paymentCalc';
import { RatesCheck } from './../../../models/rates/RatesCheck';
import { RegionalCoefficient } from './../../../models/rates/regionalCoefficient';
import { RatesWithCountedPages } from 'src/app/models/rates/ratesWithCountedPages';
import { Rate } from './../../../models/rates/rate';
import { BaseHandlerService } from './../../../common/services/service.base.handler';
import { AdminApiUrls } from './../adminApiUrls';
import { AuthService } from './../../../auth/auth.service';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RateJobType } from 'src/app/models/rateJobs/rateJobType';
import { RateJob } from 'src/app/models/rateJobs/rateJob';


@Injectable({
  providedIn: 'root'
})
export class RateService extends BaseHandlerService {

  constructor(private http: HttpClient,
      protected auth: AuthService) {
    super(auth);
  }

  getAllRates(ratesWithPages: RatesWithCountedPages): Observable<RatesWithCountedPages> {
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

  getAllRegionalCoefficients(): Observable<RegionalCoefficient[]> {
    return this.http.get<RegionalCoefficient[]>(`${AdminApiUrls.REGIONAL_COEFFICIENTS}`, BaseHandlerService.httpOptions)
      .pipe(
        catchError(this.handleError('getAllRegionalCoefficients', null))
    );
  }

  addRegionalCoefficient(rate: RegionalCoefficient): Observable<RegionalCoefficient> {
    return this.http.post<RegionalCoefficient>(AdminApiUrls.REGIONAL_COEFFICIENTS, rate, BaseHandlerService.httpOptions);
  }

  updateRegionalCoefficient(rate: RegionalCoefficient): Observable<RegionalCoefficient> {
    return this.http.put<RegionalCoefficient>(AdminApiUrls.REGIONAL_COEFFICIENTS, rate, BaseHandlerService.httpOptions);
  }

  deleteRegionalCoefficient(id: number): Observable<{}> {
    return this.http.delete(`${AdminApiUrls.REGIONAL_COEFFICIENTS}${id}`, BaseHandlerService.httpOptions);
  }

  //hour regional cost
  getAllRegionalHourCosts(): Observable<RegionalHourCost[]> {
    return this.http.get<RegionalHourCost[]>(`${AdminApiUrls.REGIONAL_HOUR_COEFFICIENTS}`, BaseHandlerService.httpOptions)
      .pipe(
        catchError(this.handleError('getAllRegionalHourCosts', null))
    );
  }

  getDefaultRegionalHourCost(): Observable<RegionalHourCost> {
    return this.http.get<RegionalHourCost>(`${AdminApiUrls.REGIONAL_HOUR_DEFAULT_COEFFICIENT}`, BaseHandlerService.httpOptions)
      .pipe(
        catchError(this.handleError('getDefaultRegionalHourCost', null))
    );
  }

  addRegionalHourCoefficient(rate: RegionalHourCost): Observable<RegionalHourCost> {
    return this.http.post<RegionalHourCost>(AdminApiUrls.REGIONAL_HOUR_COEFFICIENTS, rate, BaseHandlerService.httpOptions);
  }

  updateRegionalHourCoefficient(rate: RegionalHourCost): Observable<RegionalHourCost> {
    return this.http.put<RegionalHourCost>(AdminApiUrls.REGIONAL_HOUR_COEFFICIENTS, rate, BaseHandlerService.httpOptions);
  }

  deleteRegionalHourCoefficient(id: number): Observable<{}> {
    return this.http.delete(`${AdminApiUrls.REGIONAL_HOUR_COEFFICIENTS}${id}`, BaseHandlerService.httpOptions);
  }


  checkPayCalc(ratesCheck: RatesCheck): Observable<PaymentCalc> {
    return this.http.post<PaymentCalc>(AdminApiUrls.RATES_CHECK_PAY_CALC, ratesCheck, BaseHandlerService.httpOptions)
      .pipe(
        map((caymentCalc: PaymentCalc) => PaymentCalc.convertToObj(caymentCalc)),
        catchError(this.handleError('checkPayCalc', null))
    );
  }

  getAllRateJobs(rateJobType: RateJobType): Observable<RateJob[]> {
    return this.http.get<RateJob[]>(`${AdminApiUrls.RATEJOBS}/all/${rateJobType}`, BaseHandlerService.httpOptions).pipe(
      map(listRateJobs => listRateJobs.map(rateJob => RateJob.convertToObj(rateJob))),
      catchError(this.handleError('getAllRateJobs', null))
    );
  }

  addRateJob(rateJob: RateJob): Observable<RateJob> {
    return this.http.post<RateJob>(`${AdminApiUrls.RATEJOBS}/`, rateJob, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('addRateJob', null))
    );
  }

  updateRateJob(rateJob: RateJob): Observable<RateJob> {
    return this.http.put<RateJob>(`${AdminApiUrls.RATEJOBS}/`, rateJob, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('updateRateJob', null))
    );
  }

  deleteRateJob(id: number): Observable<{}> {
    return this.http.delete(`${AdminApiUrls.RATEJOBS}/${id}`, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('deleteRateJob', null))
    );
  }

}
