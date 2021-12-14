import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SessionStorageService } from 'angular-web-storage';
import { AuthService } from 'src/app/auth/auth.service';
import { OfferLoadAppComponent } from '../../common/offer-load-app/offer-load-app.component';
import { FAQComponent } from '../../home/faq/faq.component';

@Component({
  selector: 'app-common-layout',
  templateUrl: './common-layout.component.html',
})
export class CommonLayoutComponent implements OnInit {

  faqComponent: FAQComponent;

  constructor(private authService: AuthService,
    private sessionService: SessionStorageService,
    public dialog: MatDialog) { }

  ngOnInit() {}

  showOfferLoadApp() {
    let nextDate: Date = new Date(this.sessionService.get(AuthService.TIME_NEXT_SHOW_OFFER));
    const currentDate = new Date();

    if((nextDate == null || currentDate >= nextDate) && !this.authService.isNotShowOfferLoadApp()) {
      this.openOfferLoadApp();
    }
  }

  handleIsJobNavigation(event) {
    if (this.faqComponent != null){
      this.faqComponent.chengeFAQContent(event, null);
    }
  }

  openOfferLoadApp() {
    const dialogRef = this.dialog.open( OfferLoadAppComponent, {
      width: '550px',
      data: this.authService.LoggedUser != null && this.authService.LoggedUser.authenticated != null
    });
    dialogRef.afterClosed().subscribe(data => {
      if(data != null) {
        const nextDate = new Date(new Date().getTime() + AuthService.INTERVAL_SHOW_OFFER*60000);
        this.sessionService.set(AuthService.TIME_NEXT_SHOW_OFFER, nextDate);
      }
    })
  }

  onRouterOutletActivate(event) {
    if(event == null) {
      return;
    }

    if(this.authService.isMobileMode()) {
      this.showOfferLoadApp();
    }

    if(event instanceof FAQComponent){
      this.faqComponent = event;
    } else {
      this.faqComponent = null;
    }
  }
}
