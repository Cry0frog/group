import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-subscription-not-enough-money',
  templateUrl: './subscription-not-enough-money.component.html',
  styleUrls: ['./subscription-not-enough-money.component.css']
})
export class SubscriptionNotEnoughMoneyComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SubscriptionNotEnoughMoneyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number) { }

  ngOnInit() {}

  goToPayEnough() {
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
