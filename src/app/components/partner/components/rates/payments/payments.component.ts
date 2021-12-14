import { TaskRequest } from './../../../../../models/task/taskRequest';
import { SessionStorageService } from 'angular-web-storage';
import { PaymentComponent } from './../../payment/payment.component';
import { Router } from '@angular/router';
import { PayService } from './../../../../../services/pay.service';
import { PaymentFilter } from './../../../../../models/payment/paymentFilter';
import { ExecutePayComponent } from './execute-pay/execute-pay.component';
import { PAYMENT_TYPE_TRANSLATE, PAYMENT_STATUS_TRANSLATE } from './../../../../../common/payment.description';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { PaymentService } from 'src/app/common/services/payment.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PaymentView } from 'src/app/models/payment/paymentView';
import { RequestToPayout } from 'src/app/models/payment/requestToPayout';
import { PaymentType } from 'src/app/models/payment/paymentType';
import { PaymentStatus } from 'src/app/models/payment/paymentStatus';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  static UPDATE_STATUS_PART = '?mode=READY_TO_PAYOUT';
  static ENABLE_PAY_YA = '?mode=PAY_TASK';

  payments: PaymentView[];
  dataSource: MatTableDataSource<PaymentView>;
  displayedColumns: string[] = ['createdAt', 'amount', 'paymentType', 'status',
    'description', 'operations'];

  paymentTypeTranslates = PAYMENT_TYPE_TRANSLATE;
  paymentStatusTranslates = PAYMENT_STATUS_TRANSLATE;
  filter: PaymentFilter;
  totalChoosen: number;

  constructor(private paymentService: PaymentService,
    private payService: PayService,
    public dialog: MatDialog,
    private router: Router,
    private sessionStorage: SessionStorageService
  ) {
    this.totalChoosen = 0;
    this.payments = [];
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    const url = this.router.routerState.snapshot.url;
    if(!url.includes(PaymentsComponent.UPDATE_STATUS_PART)) {
      this.filterAll();
    }
    else {
      this.filterAvailableToPayout();
    }

    if(url.includes(PaymentsComponent.ENABLE_PAY_YA)) {
      const requestStr = this.sessionStorage.get('COMMISSION_USUAL_TASK');
      if(requestStr != null && requestStr != '') {
        this.sessionStorage.remove('COMMISSION_USUAL_TASK');
        const taskRequest: TaskRequest = JSON.parse(requestStr);

        const dialogRef = this.dialog.open(PaymentComponent, {
          width: '550px',
          data: {
            summ: taskRequest.moneyForCommission,
            redirUrl: `find_task/${taskRequest.taskId}`,
            message: 'После оплаты Вы будете переадресованы назад на задачу, подождите некоторое время (обычно не более 5 минут, пока платеж не будет подтвержден и попробуйте подать заявку снова)'
          }
        });
        dialogRef.afterClosed().subscribe((res) => {
          if(res != null) {
            window.location.reload(true);
          }
        });
      }
    }
  }

  isAllStatus(): boolean {
    return this.filter == PaymentFilter.ALL;
  }

  isAvailableToPayoutStatus(): boolean {
    return this.filter == PaymentFilter.READY_TO_PAYOUT;
  }

  isPayoutInProgress(): boolean {
    return this.filter == PaymentFilter.READY_TO_PAYOUT;
  }

  isPayoutSuccess(): boolean {
    return this.filter == PaymentFilter.READY_TO_PAYOUT;
  }

  isPayoutable(el: PaymentView) {
    return el.paymentType == PaymentType.SECURE_RECEIVING_FOR_TASK
      && el.status == PaymentStatus.SECURE_READY_TO_PAYOUT;
  }

  filterAll() {
    this.filter = PaymentFilter.ALL;
    this.reloadViewPayments();
  }

  filterAvailableToPayout() {
    this.filter = PaymentFilter.READY_TO_PAYOUT;
    this.reloadViewPayments();
  }

  filterByPayoutInProgress() {
    this.filter = PaymentFilter.PAYOUT_IN_PROGRESS;
    this.reloadViewPayments();
  }

  filterBySuccess() {
    this.filter = PaymentFilter.SUCCESS;
    this.reloadViewPayments();
  }

  reloadViewPayments() {
    this.paymentService.getPaymentsOfUser(this.filter).subscribe((data: PaymentView[]) => {
      this.payments = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    });
  }

  isStillOneForPayout(): boolean {
    return this.payments.some(el => el.choosen);
  }

  isCanPay(): boolean {
    return this.totalChoosen >= 61;
  }

  calcChoosenSummNumber(): number {
    this.totalChoosen = this.payments.filter(el => el.choosen)
      .reduce((summ, el) => summ + parseFloat(el.amount.value), 0);
    return this.totalChoosen;
  }

  calcChoosenSumm(): string {
    return this.calcChoosenSummNumber() + ' Р';
  }

  checkPaymentDeal(payment: PaymentView) {
    this.payService.checkPaymentDeal(payment.id).subscribe(_ => {
      this.reloadViewPayments();
    });
  }

  requestPayout() {
    const paymentIds = this.payments.filter(el => el.choosen).map(el => el.id);
    this.payService.requestPayout(new RequestToPayout(paymentIds)).subscribe(_ => {
      window.location.reload(true);
    });
  }

  payFinished(row: PaymentView) {
    const dialogRef = this.dialog.open(ExecutePayComponent, {
      width: '750px',
      data: row,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((res) => {
      if(res != null) {
        window.location.reload(true);
      }
    });
  }

}
