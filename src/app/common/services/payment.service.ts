import { RateJobType } from './../../models/rateJobs/rateJobType';
import { RateJob } from './../../models/rateJobs/rateJob';
import { PaymentFilter } from './../../models/payment/paymentFilter';
import { Commission } from './../../models/payment/commission';
import { BaseHandlerService } from './service.base.handler';
import { AmountResponse } from './../../models/payment/amountResponse';
import { Payment } from './../../models/payment/payment';
import { AuthService } from './../../auth/auth.service';
import { tap, catchError, map } from 'rxjs/operators';
import { ApiUrls } from './../../auth/activeUrls';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentView } from 'src/app/models/payment/paymentView';

@Injectable({
    providedIn: 'root'
})
export class PaymentService extends BaseHandlerService {

  constructor(private http: HttpClient,
      protected auth: AuthService) {
    super(auth);
  }

  getCommissions(): Observable<Commission[]> {
    return this.http.get<Commission[]>(ApiUrls.COMMISSION, PaymentService.httpOptions).pipe(
      map((commissions: []) => commissions.map(commission => Commission.convertToObj(commission))),
      catchError(this.handleError('getCommissions', null))
    );
  }

  getAmount(): Observable<AmountResponse> {
    return this.http.get<AmountResponse>(ApiUrls.PAYMENT, PaymentService.httpOptions).pipe(
      map(amount => AmountResponse.convertToObj(amount)),
      catchError(this.handleError('getAmount', null))
    );
  }

  getIncome(): Observable<AmountResponse> {
    return this.http.get<AmountResponse>(ApiUrls.PAYMENT_INCOME, PaymentService.httpOptions).pipe(
      map(amount => AmountResponse.convertToObj(amount)),
      catchError(this.handleError('getIncome', null))
    );
  }

  getPaymentsOfUser(filter: PaymentFilter): Observable<PaymentView[]> {
    return this.http.get<PaymentView[]>(`${ApiUrls.ALL_PAYMENTS}/${filter}`, PaymentService.httpOptions).pipe(
      map((payments: []) => payments.map(payment => PaymentView.convertToObj(payment))),
      catchError(this.handleError('getPaymentsOfUser', null))
    );
  }

  createPaymentForRefillBalance(amount: string): Observable<Payment> {
    let params = new HttpParams();
    params = params.append('amount', amount);

    return this.http.post<Payment>(`${ApiUrls.REFILL_PAYMENT}`, null,
      { headers: BaseHandlerService.httpOptions.headers, params: params })
    .pipe(
      tap((data: any) => this.log('createPaymentForRefillBalance')),
      catchError(this.handleError('createPaymentForRefillBalance error', []))
    );
  }

  createPayment(amount: string, taskId: number): Observable<Payment> {
    let params = new HttpParams();
    params = params.append('amount', amount).append('taskId', taskId.toString());

    return this.http.post<Payment>(ApiUrls.CREATE_PAYMENT, null,
        { headers: BaseHandlerService.httpOptions.headers, params: params })
    .pipe(
      tap((data: any) => this.log('createPayment')),
      catchError(this.handleError('createPayment error', []))
    );
  }

  getPayment(id: string): Observable<Payment> {
    return this.http.get<Payment>(`${ApiUrls.GET_PAYMENT}${id}`, PaymentService.httpOptions).pipe(
      //map(amount => AmountResponse.convertToObj(amount)),
      catchError(this.handleError('getPayment', null))
    );
  }

  markTaskAsPayed(taskId: number): Observable<number> {
    return this.http.post<number>(`${ApiUrls.TASK_MARK_AS_PAYED}/${taskId}`, null, BaseHandlerService.httpOptions).pipe(
      tap((data: any) => this.log('markTaskAsPayed')),
      catchError(this.handleError('markTaskAsPayed error', []))
    );
  }

  markRefillAsPayed(paymentId: string): Observable<number> {
    return this.http.post<number>(`${ApiUrls.TASK_MARK_REFILL_AS_PAYED}/${paymentId}`, null,
      BaseHandlerService.httpOptions).pipe(
        catchError(this.handleError('markRefillAsPayed error', null))
    );
  }

  paymentVacancy(id: number, amount: string, countDays: number): Observable<RateJob> {
    return this.http.get<RateJob>(`${ApiUrls.PARTNER_PAYMENT_VACANCY}${id}/${amount}/${countDays}`, BaseHandlerService.httpOptions).pipe(
      map(data => RateJob.convertToObj(data)),
      catchError(this.handleError('paymentVacancy', null))
    );
  }

  paymentForViewResume(id: number, amount: number): Observable<RateJob> {
    return this.http.get<RateJob>(`${ApiUrls.PARTNER_PAYMENT_VACANCY}${id}/${amount}`, BaseHandlerService.httpOptions).pipe(
      map(data => RateJob.convertToObj(data)),
      catchError(this.handleError('paymentForViewResume', null))
    );
  }

  paymentForSubscribe(amount: number, countDays: number): Observable<RateJob> {
    return this.http.get<RateJob>(`${ApiUrls.PAYMENT_SUBSCRIPTION}/${amount}/${countDays}`, BaseHandlerService.httpOptions).pipe(
      map(data => RateJob.convertToObj(data)),
      catchError(this.handleError('paymentForViewResume', null))
    );
  }

  getAmountValueForViewResume(): Observable<number>{
    return this.http.get<number>(ApiUrls.SETTING_AMOUNT_VALUE, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('getAmountValueForViewResume', null))
    );
  }

  getRateJob(rateJobType: RateJobType): Observable<RateJob[]> {
    return this.http.get<RateJob[]>(`${ApiUrls.PARTNER_PAYMENT_VACANCY_RATE_VACANCY}/${rateJobType}`, BaseHandlerService.httpOptions).pipe(
      map((data: []) => data.map(data => RateJob.convertToObj(data))),
      catchError(this.handleError('getRateJob', null))
    );
  }

  checkOnlySubscriptionVacancy(): Observable<boolean> {
    return this.http.get<boolean>(ApiUrls.SETTING_ONLY_SUBSCRIPTION_VACANCY, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('checkOnlySubscriptionVacancy', null))
    );
  }

  checkOnlySubscriptionResume(): Observable<boolean> {
    return this.http.get<boolean>(ApiUrls.SETTING_ONLY_SUBSCRIPTION_RESUME, BaseHandlerService.httpOptions).pipe(
      catchError(this.handleError('checkOnlySubscriptionResume', null))
    );
  }
}
