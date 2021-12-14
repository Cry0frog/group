import { RateJobType } from './../../../../../models/rateJobs/rateJobType';
import { RateJob } from './../../../../../models/rateJobs/rateJob';
import { Vacancy } from './../../../../../models/vacancy/vacancy';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RATE_JOB_DAYS } from 'src/app/components/admin/common/admin.descriptions';
import { AmountResponse } from 'src/app/models/payment/amountResponse';
import { PaymentService } from 'src/app/common/services/payment.service';
import { VacancyNotEnoughMoneyComponent } from './vacancy-not-enough-money/vacancy-not-enough-money.component';

@Component({
  selector: 'app-payments-create-vacancy',
  templateUrl: './payments-create-vacancy.component.html',
  styleUrls: ['./payments-create-vacancy.component.css']
})
export class PaymentsCreateVacancyComponent implements OnInit {

  rateJobDays = RATE_JOB_DAYS;
  selectedRateJob: RateJob;

  rateJob: RateJob[];

  constructor(
    public dialogRef: MatDialogRef<PaymentsCreateVacancyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Vacancy,
    private paymentService: PaymentService,
  ) {
    this.data.dateEndPublication = new Date();
    this.rateJob = [];
    this.selectedRateJob = new RateJob();
  }

  ngOnInit() {
    this.paymentService.getRateJob(RateJobType.ONCE).subscribe((data: RateJob[]) => {
      this.rateJob = data;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onPayClick() {
    this.paymentService.paymentVacancy(this.data.id, this.selectedRateJob.amountValue.toString(), this.selectedRateJob.countDays).subscribe((data: RateJob) => {
      this.dialogRef.close(data);
    });
  }

  selectedCountDays(event) {
    if(this.rateJob.length != 0){
      this.selectedRateJob = this.rateJob.find(rate => rate.countDays == event.value);
    }
  }
}
