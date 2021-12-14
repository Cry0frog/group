import { ActiveUrls } from 'src/app/auth/activeUrls';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-layout',
  templateUrl: './registration-layout.component.html',
  styleUrls: ['./registration-layout.component.css']
})
export class RegistrationLayoutComponent implements OnInit {

  currentUrl: string;

  constructor(public router: Router) { }

  ngOnInit() {
    this.getCurrentUrl();
    // @ts-ignore
    document.querySelectorAll(`.mode-tasks-area .${this.currentUrl}`)[0].click();
  }

  getCurrentUrl() {
    location.pathname.split('/').forEach(url => {
      if(url == ActiveUrls.REG_INDIVID || url == ActiveUrls.REG_LEGAL) {
        this.currentUrl = url;
      }
    });
  }

  switchToRegIndivid() {
    if(this.currentUrl != `${ActiveUrls.REGISTRATION}/${ActiveUrls.REG_INDIVID}`) {
      this.router.navigateByUrl(`${ActiveUrls.REGISTRATION}/${ActiveUrls.REG_INDIVID}`);
    }
  }

  switchToPartnerRegLegal() {
    if(this.currentUrl != `${ActiveUrls.REGISTRATION}/${ActiveUrls.REG_LEGAL}`) {
      this.router.navigateByUrl(`${ActiveUrls.REGISTRATION}/${ActiveUrls.REG_LEGAL}`);
    }
  }

}
