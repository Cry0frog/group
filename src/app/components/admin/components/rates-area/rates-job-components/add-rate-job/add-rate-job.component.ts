import { RATE_JOB_DAYS } from '../../../../common/admin.descriptions';
import { RateJob } from 'src/app/models/rateJobs/rateJob';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-rate-job',
  templateUrl: './add-rate-job.component.html',
  styleUrls: ['./add-rate-job.component.css']
})
export class AddRateJobComponent implements OnInit {

  rateJobDays = RATE_JOB_DAYS;

  constructor(public dialogRef: MatDialogRef<AddRateJobComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RateJob) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
