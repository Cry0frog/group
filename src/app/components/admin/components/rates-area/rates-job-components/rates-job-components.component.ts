import { RATE_JOB_DAYS_REVERSE } from './../../../common/admin.descriptions';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { RateJob } from 'src/app/models/rateJobs/rateJob';
import { RateJobType } from 'src/app/models/rateJobs/rateJobType';
import { RateService } from '../../../service/rate.service';
import { AddRateJobComponent } from './add-rate-job/add-rate-job.component';
import { DeleteRateJobComponent } from './delete-rate-job/delete-rate-job.component';

@Component({
  selector: 'app-rates-job-components',
  templateUrl: './rates-job-components.component.html',
  styleUrls: ['./rates-job-components.component.css']
})
export class RatesJobComponentsComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() rateJobType: RateJobType;

  displayedColumns: string[] = ['id', 'countDays', 'amountValue', 'operations'];

  dataSource: MatTableDataSource<RateJob>;
  rateJobs: RateJob[];

  rateJobDays = RATE_JOB_DAYS_REVERSE;

  constructor(
    private rateService: RateService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.reloadRateJobs();
  }

  reloadRateJobs() {
    this.rateService.getAllRateJobs(this.rateJobType).subscribe((data: RateJob[]) => {
      this.rateJobs = data;
      this.dataSource = new MatTableDataSource(this.rateJobs);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  addOrUpdateRateJob(rateJob: RateJob) {
    const job: RateJob = new RateJob();
    Object.assign(job, rateJob);
    const dialogRef = this.dialog.open(AddRateJobComponent, {
      width: '700px',
      data: job == null ? new RateJob() : job
    });
    dialogRef.afterClosed().subscribe((rateJob: RateJob) => {
      if(rateJob != null) {
        if(rateJob.id == null) {
          rateJob.rateJobType = this.rateJobType;
          this.rateService.addRateJob(rateJob).subscribe(el => {
            this.reloadRateJobs();
          });
        }
        else {
          this.rateService.updateRateJob(rateJob).subscribe(el => {
            this.reloadRateJobs();
          });
        }
      }
    });
  }

  deleteRateJob(rateJob: RateJob) {
    const dialogRef = this.dialog.open(DeleteRateJobComponent, {
      width: '550px',
      data: rateJob.id
    });
    dialogRef.afterClosed().subscribe((id: number) => {
      if(id != null) {
        this.rateService.deleteRateJob(rateJob.id).subscribe(el => {
          this.reloadRateJobs();
        });
      }
    });
  }

}
