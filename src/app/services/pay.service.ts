import { RequestToPayout } from './../models/payment/requestToPayout';
import { DealState } from './../models/walletone/deal/dealState';
import { PaymentTool } from '../models/walletone/tools/paymentTool';
import { catchError } from 'rxjs/operators';
import { ApiUrls } from './../auth/activeUrls';
import { Observable } from 'rxjs';
import { WalletOneCommonPostParams } from './../models/walletone/walletOneCommonPostParams';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { BaseHandlerService } from './../common/services/service.base.handler';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PayService extends BaseHandlerService {
  static UPDATE_STATUS_PART = '?update-status=1';

  constructor(private http: HttpClient,
    protected auth: AuthService
  ) {
    super(auth);
  }

  getPayBindingCustomerCardParams(taskId: number, errorHandler): Observable<WalletOneCommonPostParams> {
    const url = `https://gooddealonline.ru/one_wallet/partner/${this.auth.getCurrentId}/my-tasks/${taskId}`;
    return this.http.get<WalletOneCommonPostParams>(`${ApiUrls.PAY_BINDING_CUSTOMER_CARD_PARAMS}?backUrl=${url}`).pipe(
      catchError(this.handleErrorWithHandler('getPayBindingCustomerCardParams', null, errorHandler))
    );
  }

  openPayBindingCustomerCard(taskId: number, errorHandler) {
    this.getPayBindingCustomerCardParams(taskId, errorHandler).subscribe((el: WalletOneCommonPostParams) => {
      window.open(el.url, '_self');
    });
  }

  private getPayBindingPerformerCardParams(taskId: number, errorHandler): Observable<WalletOneCommonPostParams> {
    const url = `https://gooddealonline.ru/one_wallet/find_task/${taskId}`;
    return this.http.get<WalletOneCommonPostParams>(`${ApiUrls.PAY_BINDING_PERFORMER_CARD_PARAMS}?backUrl=${url}`).pipe(
      catchError(this.handleErrorWithHandler('getPayBindingPerformerCardParams', null, errorHandler))
    );
  }

  openPayBindingPerformerCard(taskId: number, errorHandler) {
    this.getPayBindingPerformerCardParams(taskId, errorHandler).subscribe((el: WalletOneCommonPostParams) => {
      window.open(el.url, '_self');
    });
  }

  getCustomerPaymentTools(errorHandler): Observable<PaymentTool[]> {
    return this.http.get<PaymentTool[]>(ApiUrls.PAY_CUSTOMER_PAYMENT_TOOLS).pipe(
      catchError(this.handleErrorWithHandler('getCustomerPaymentTools', null, errorHandler))
    );
  }

  getPerformerPaymentTools(errorHandler): Observable<PaymentTool[]> {
    return this.http.get<PaymentTool[]>(ApiUrls.PAY_PERFORMER_PAYMENT_TOOLS).pipe(
      catchError(this.handleErrorWithHandler('getPerformerPaymentTools', null, errorHandler))
    );
  }

  bindCustomerPaymentTool(taskId: number, toolId: number, mask: string): Observable<number> {
    return this.http.put<number>(`${ApiUrls.PAY_BIND_CUSTOMER_PAYMENT}/${taskId}/${toolId}/${mask}`, BaseHandlerService.httpOptions)
      .pipe(
        catchError(this.handleError('bindCustomerPaymentTool', null))
    );
  }

  payTask(taskId: number): Observable<WalletOneCommonPostParams> {
    const url = `https://gooddealonline.ru/one_wallet/partner/${this.auth.getCurrentId}/my-tasks/${taskId}${PayService.UPDATE_STATUS_PART}`;
    return this.http.put<WalletOneCommonPostParams>(`${ApiUrls.PAY_TASK}/${taskId}?backUrl=${url}`, BaseHandlerService.httpOptions)
      .pipe(
        catchError(this.handleError('payTask', null))
    );
  }

  checkDeal(taskId: number): Observable<DealState> {
    return this.http.put<DealState>(`${ApiUrls.PAY_CHECK_DEAL}/${taskId}`, BaseHandlerService.httpOptions)
      .pipe(
        catchError(this.handleError('checkDeal', null))
    );
  }

  checkPaymentDeal(paymentId: string): Observable<DealState> {
    return this.http.put<DealState>(`${ApiUrls.PAY_CHECK_PAYMENT_DEAL}/${paymentId}`, BaseHandlerService.httpOptions)
      .pipe(
        catchError(this.handleError('checkPaymentDeal', null))
    );
  }

  requestPayout(request: RequestToPayout): Observable<number> {
    return this.http.put<number>(ApiUrls.REQUEST_PAYOUT, request, BaseHandlerService.httpOptions)
      .pipe(
        catchError(this.handleError('requestPayout', null))
    );
  }

}
