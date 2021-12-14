import { RateJobType } from 'src/app/models/rateJobs/rateJobType';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-one-time-payments',
  templateUrl: './one-time-payments.component.html',
  styleUrls: ['./one-time-payments.component.css']
})
export class OneTimePaymentsComponent implements OnInit {

  rateJobType = RateJobType.ONCE;

  constructor() { }

  ngOnInit(): void {
  }

}
