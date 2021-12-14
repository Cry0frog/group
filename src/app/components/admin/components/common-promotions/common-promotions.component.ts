import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UrlResolver } from 'src/app/components/partner/common/urlResolver';

@Component({
  selector: 'app-common-promotions',
  templateUrl: './common-promotions.component.html',
  styleUrls: ['./common-promotions.component.css']
})
export class CommonPromotionsComponent implements OnInit {
  currentUrl: string;

  constructor(public router: Router) {}

  ngOnInit() {
    const url = UrlResolver.getMainSectionFromUrl(this.router.url);
    this.currentUrl = url;
    // @ts-ignore
    document.querySelectorAll(`.mode-tasks-area .${url}`)[0].click();
  }

  switchToPromotionsMode() {
    this.router.navigateByUrl(`admin/promotion/promotions`);
  }

  switchToParticipantsMode() {
    this.router.navigateByUrl(`admin/promotion/participants`);
  }
}
