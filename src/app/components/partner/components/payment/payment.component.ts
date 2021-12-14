import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AuthService } from './../../../../auth/auth.service';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { PaymentService } from 'src/app/common/services/payment.service';
import { Payment } from 'src/app/models/payment/payment';
import { StorageService, SessionStorageService } from 'angular-web-storage';

declare function showWidget(confirmationToken: string, backUrl: string):any;

@Component({
  selector: 'app-rates',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  isLoaded: boolean;
  isStartLoading: boolean;
  summ: number;

  constructor(public dialogRef: MatDialogRef<PaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private paymentService: PaymentService,
    private authService: AuthService,
    private sessionStorage: SessionStorageService
  ) {
    this.isLoaded = false;
    this.isStartLoading = false;

    if(data != null) {
      this.summ = data.summ;
    }
  }

  ngOnInit() {}

  isMessageAvailable(): boolean {
    return this.data != null && this.data.message != null;
  }

  getMessage(): string {
    return this.data.message;
  }

  requestPayout() {
    this.isStartLoading = true;
    this.createPayment();
  }

  createPayment() {
    this.paymentService.createPaymentForRefillBalance(this.summ + '').subscribe((response: Payment) => {
      this.isLoaded = true;
      Promise.resolve(null).then(obj => {
        let redirUrl = null;
        if(this.data != null && this.data.redirUrl != null) {
          redirUrl = this.data.redirUrl;
        }
        else {
          redirUrl = `user/${this.authService.getCurrentId}/payments`;
        }

        let backUrl = `${window.location.protocol}//${window.location.host}/pay_wrapper?payment_id=${response.id}&url=${redirUrl}`;
        console.log('Yandex.Payment: ' + backUrl);
        showWidget(response.confirmation.confirmationToken, backUrl);
      });
    });
  }
}
