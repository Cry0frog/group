import { AuthService } from 'src/app/auth/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Payment } from 'src/app/models/payment/payment';
import { Task } from 'src/app/models/task/task';
import { PaymentService } from 'src/app/common/services/payment.service';
import { Component, OnInit, Inject } from '@angular/core';

declare function showWidget(confirmationToken: string, backUrl: string):any;

@Component({
  selector: 'app-pay-task',
  templateUrl: './pay-task.component.html',
  styleUrls: ['./pay-task.component.css']
})
export class PayTaskComponent implements OnInit {
  isLoaded: boolean;

  constructor(public dialogRef: MatDialogRef<PayTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task,
    private paymentService: PaymentService,
    private authService: AuthService
  ) {
    this.isLoaded = false;
  }

  ngOnInit() {
    this.createPayment();
  }

  createPayment() {
    this.paymentService.createPayment(this.data.readyToPay.toString(), this.data.id)
      .subscribe((response: Payment) => {
        this.isLoaded = true;
        Promise.resolve(null).then(obj => {
          const redirUrl = `user/${this.authService.getCurrentId}/my-tasks/${this.data.id}`;
          let backUrl = `${window.location.protocol}//${window.location.host}/pay_wrapper?task_id=${this.data.id}&url=${redirUrl}`;
          console.log('Yandex.Payment: ' + backUrl);
          showWidget(response.confirmation.confirmationToken, backUrl);
        });
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
