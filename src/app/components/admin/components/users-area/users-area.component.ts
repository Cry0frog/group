import { Component, OnInit } from '@angular/core';
import { ActiveUrls } from 'src/app/auth/activeUrls';
import { Router } from '@angular/router';
import { UrlResolver } from 'src/app/components/partner/common/urlResolver';

@Component({
  selector: 'app-users-area',
  templateUrl: './users-area.component.html',
  styleUrls: ['./users-area.component.css']
})
export class UsersAreaComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    const url = UrlResolver.getMainSectionFromUrl(this.router.url);
    // @ts-ignore
    document.querySelectorAll(`.user-panel .${url}`)[0].checked = true;
  }


  switchToUsersMode() {
    this.router.navigate([ActiveUrls.ADMIN_USERS]);
  }

  switchToLegalEntitiesMode() {
    this.router.navigate([ActiveUrls.ADMIN_LEGAL_ENTITIES]);
  }

  switchToBlockedUsersMode() {
    this.router.navigate([ActiveUrls.ADMIN_BLOCKED_USERS]);
  }

}
