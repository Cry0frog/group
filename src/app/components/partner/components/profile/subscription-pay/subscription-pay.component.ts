import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PaymentService } from 'src/app/common/services/payment.service';
import { RATE_JOB_DAYS } from 'src/app/components/admin/common/admin.descriptions';
import { RateJob } from 'src/app/models/rateJobs/rateJob';
import { RateJobType } from 'src/app/models/rateJobs/rateJobType';

@Component({
  selector: 'app-subscription-pay',
  templateUrl: './subscription-pay.component.html',
  styleUrls: ['./subscription-pay.component.css']
})
export class SubscriptionPayComponent implements OnInit {

  rateJobDays = RATE_JOB_DAYS;
  selectedRateJob: RateJob;

  rateJob: RateJob[];

  constructor(
    public dialogRef: MatDialogRef<SubscriptionPayComponent>,
    private paymentService: PaymentService,
  ) {
    this.rateJob = [];
    this.selectedRateJob = new RateJob();
  }

  ngOnInit() {
    this.paymentService.getRateJob(RateJobType.SUBSCRIPTION).subscribe((data: RateJob[]) => {
      this.rateJob = data;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onPayClick() {
    this.paymentService.paymentForSubscribe(this.selectedRateJob.amountValue, this.selectedRateJob.countDays).subscribe((data: RateJob) => {
      this.dialogRef.close(data);
    });
  }

  selectedCountDays(event) {
    if(this.rateJob.length != 0){
      this.selectedRateJob = this.rateJob.find(rate => rate.countDays == event.value);
    }
  }
}
