import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActiveUrls } from 'src/app/auth/activeUrls';
import { UrlResolver } from 'src/app/components/partner/common/urlResolver';

@Component({
  selector: 'app-job-area',
  templateUrl: './job-area.component.html',
  styleUrls: ['./job-area.component.css']
})
export class JobAreaComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    const url = UrlResolver.getMainSectionFromUrl(this.router.url);
    // @ts-ignore
    document.querySelectorAll(`.user-panel .${url}`)[0].checked = true;
  }


  switchToVacancies() {
    this.router.navigate([ActiveUrls.ADMIN_USERS_VACANCIES]);
  }

  switchToResume() {
    this.router.navigate([ActiveUrls.ADMIN_USERS_RESUME]);
  }
}
