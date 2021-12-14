import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentService } from 'src/app/common/services/payment.service';
import { RateJob } from 'src/app/models/rateJobs/rateJob';

@Component({
  selector: 'app-resume-pay-for-view',
  templateUrl: './resume-pay-for-view.component.html',
  styleUrls: ['./resume-pay-for-view.component.css']
})
export class ResumePayForViewComponent implements OnInit {

  amountValue: number;

  constructor(
    public dialogRef: MatDialogRef<ResumePayForViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private paymentService: PaymentService,
  ) {}

  ngOnInit() {
    this.paymentService.getAmountValueForViewResume().subscribe((data: number) =>{
      this.amountValue = data;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onPayClick() {
    this.paymentService.paymentForViewResume(this.data, this.amountValue).subscribe((data: RateJob) => {
      this.dialogRef.close(data);
    });
  }
}
