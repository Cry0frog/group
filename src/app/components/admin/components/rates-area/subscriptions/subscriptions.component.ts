import { Component, OnInit } from '@angular/core';
import { RateJobType } from 'src/app/models/rateJobs/rateJobType';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {

  rateJobType = RateJobType.SUBSCRIPTION;

  constructor() { }

  ngOnInit() {
  }

}
