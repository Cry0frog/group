import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UrlResolver } from 'src/app/components/partner/common/urlResolver';
import { ActiveUrls } from 'src/app/auth/activeUrls';

@Component({
  selector: 'app-development',
  templateUrl: './development.component.html',
  styleUrls: ['./development.component.css']
})
export class DevelopmentComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    const url = UrlResolver.getMainSectionFromUrl(this.router.url);
    // @ts-ignore
    document.querySelectorAll(`.partner-panel .${url}`)[0].checked = true;
  }

  getFakePartners() {
    return ActiveUrls.ADMIN_FAKE_PARTNERS;
  }

  getFakeTasks() {
    return ActiveUrls.ADMIN_FAKE_TASKS;
  }
}
