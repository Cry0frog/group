import { RateJob } from 'src/app/models/rateJobs/rateJob';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-rate-job',
  templateUrl: './delete-rate-job.component.html',
  styleUrls: ['./delete-rate-job.component.css']
})
export class DeleteRateJobComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteRateJobComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RateJob
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
