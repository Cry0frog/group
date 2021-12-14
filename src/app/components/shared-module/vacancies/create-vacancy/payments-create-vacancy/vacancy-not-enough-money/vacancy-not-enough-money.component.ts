import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentComponent } from 'src/app/components/partner/components/payment/payment.component';

@Component({
  selector: 'app-vacancy-not-enough-money',
  templateUrl: './vacancy-not-enough-money.component.html',
  styleUrls: ['./vacancy-not-enough-money.component.css']
})
export class VacancyNotEnoughMoneyComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<VacancyNotEnoughMoneyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number) { }

  ngOnInit() {}

  goToPayEnough() {
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
