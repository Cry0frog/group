import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { OneTimePaymentsComponent } from './one-time-payments/one-time-payments.component';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActiveUrls } from 'src/app/auth/activeUrls';
import { UrlResolver } from 'src/app/components/partner/common/urlResolver';


@Component({
  selector: 'app-rates-area',
  templateUrl: './rates-area.component.html',
  styleUrls: ['./rates-area.component.css']
})
export class RatesAreaComponent implements OnInit {

  showPayAdminSetting: boolean;
  isOneTimePayments:boolean;

  constructor(private router: Router) { }

  ngOnInit() {
    const url = UrlResolver.getMainSectionFromUrl(this.router.url);
    // @ts-ignore
    setTimeout(() => document.querySelectorAll(`.rate-panel .${url}`)[0].checked = true, 20);
  }

  onRouterOutletActivate(event) {
    if(event instanceof OneTimePaymentsComponent || event instanceof SubscriptionsComponent){
      this.showPayAdminSetting = true;
      if(event instanceof OneTimePaymentsComponent){
        this.isOneTimePayments = true;
      } else {
        this.isOneTimePayments = false;
      }
    } else {
      this.showPayAdminSetting = false;
    }
  }

  switchToRatesMode() {
    this.router.navigate([ActiveUrls.ADMIN_RATES]);
  }

  switchToRegionRatesMode() {
    this.router.navigate([ActiveUrls.ADMIN_REGION_RATES]);
  }

  switchToHourRates() {
    this.router.navigate([`admin/hour_rates`]);
  }

  switchToOneTimePayments() {
    this.router.navigate([`admin/${ActiveUrls.ONE_TIME_PAYMENTS}`]);
  }

  switchSubscriptions(){
    this.router.navigate([`admin/${ActiveUrls.SUBSCRIPTIONS}`]);
  }
}
