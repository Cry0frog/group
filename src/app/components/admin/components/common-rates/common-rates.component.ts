import { RateMode } from './rateMode';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-common-rates',
  templateUrl: './common-rates.component.html',
  styleUrls: ['./common-rates.component.css']
})
export class CommonRatesComponent implements OnInit {
  rateMode: RateMode;

  constructor(public router: Router) {
    this.rateMode = RateMode.RATES;
  }

  ngOnInit() {
    const url = this.router.url;
    if(url.includes('rates/common_rates')) {
      // @ts-ignore
      document.querySelectorAll(`.mode-rates-area .common-rates`)[0].click();
      this.switchToCommonRates();
    }
    else if(url.includes('rates/region_rates')) {
      // @ts-ignore
      document.querySelectorAll(`.mode-rates-area .region-rates`)[0].click();
      this.switchToRegionRates();
    }
    else if(url.includes('rates/hour_rates')) {
      // @ts-ignore
      document.querySelectorAll(`.mode-rates-area .hour-rates`)[0].click();
      this.switchToHourRates();
    }
  }

  getNameActivePage() {
    if(this.rateMode == RateMode.RATES) {
      return 'Тарифы';
    }
    else if(this.rateMode == RateMode.REGION_RATES) {
      return 'Региональные тарифы';
    }
    else {
      return 'Часовые тарифы';
    }
  }

  switchToCommonRates() {
    this.rateMode = RateMode.RATES;
    this.router.navigate([`admin/rates/common_rates`]);
  }

  switchToRegionRates() {
    this.rateMode = RateMode.REGION_RATES;
    this.router.navigate([`admin/rates/region_rates`]);
  }

  switchToHourRates() {
    this.rateMode = RateMode.HOUR_RATES;
    this.router.navigate([`admin/rates/hour_rates`]);
  }
}
