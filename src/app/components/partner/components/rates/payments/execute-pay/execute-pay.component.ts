import { Payment } from 'src/app/models/payment/payment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PaymentView } from './../../../../../../models/payment/paymentView';
import { PaymentService } from 'src/app/common/services/payment.service';
import { AuthService } from './../../../../../../auth/auth.service';
import { Component, OnInit, Inject } from '@angular/core';

declare function showWidget(confirmationToken: string, backUrl: string):any;

@Component({
  selector: 'app-execute-pay',
  templateUrl: './execute-pay.component.html',
  styleUrls: ['./execute-pay.component.css']
})
export class ExecutePayComponent implements OnInit {
  isLoaded: boolean;

  constructor(public dialogRef: MatDialogRef<ExecutePayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PaymentView,
    private paymentService: PaymentService,
    private authService: AuthService
  ) {
    this.isLoaded = false;
  }

  ngOnInit() {
    this.finishedPayment();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  finishedPayment() {
    this.paymentService.getPayment(this.data.id).subscribe((response: Payment) => {
      this.isLoaded = true;
      Promise.resolve(null).then(obj => {
        const redirUrl = `user/${this.authService.getCurrentId}/payments`;
        let backUrl = `${window.location.protocol}//${window.location.host}/pay_wrapper?payment_id=${this.data.id}&url=${redirUrl}`;
        console.log('Yandex.Payment: ' + backUrl);
        showWidget(response.confirmation.confirmationToken, backUrl);
      });
    });
  }

}
