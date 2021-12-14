import { ActiveUrls } from './../../../../auth/activeUrls';
import { Router } from '@angular/router';
import { UrlResolver } from './../../common/urlResolver';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.css']
})
export class RatesComponent implements OnInit {
  modeName: string;

  constructor(private router: Router) {
    this.modeName = ' ';
  }

  ngOnInit() {
    const url = UrlResolver.getMainSectionFromUrl(this.router.url);
    // @ts-ignore
    //document.querySelectorAll(`.mode-rates-area .${url}`)[0].checked = true;
    if(url == ActiveUrls.PARTNER_PAYMENTS) {
      this.switchToPaymentsMode();
    }
    else if(url == ActiveUrls.PARTNER_RATES) {
      this.switchToComissionMode();
    }
  }

  openPaymentsMode() {

  }

  openCommissionMode() {
    
  }

  switchToPaymentsMode() {
    this.modeName = 'Платежи';
  }

  switchToComissionMode() {
    this.modeName = 'Премиум - тарифы';
  }

}