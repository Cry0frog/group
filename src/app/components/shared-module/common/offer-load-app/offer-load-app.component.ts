import { SessionStorageService } from 'angular-web-storage';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offer-load-app',
  templateUrl: './offer-load-app.component.html',
  styleUrls: ['./offer-load-app.component.css']
})
export class OfferLoadAppComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<OfferLoadAppComponent>,
    private authService: AuthService,
    private sessionService: SessionStorageService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: boolean) { }

  ngOnInit() {}

  linkToStore() {
    window.open(`${this.getLinkToUpload()}`, '_blank');
    this.dialogRef.close(this.data);
  }

  isAutorizedUser(): boolean {
    return this.authService.LoggedUser.authorities != null;
  }

  notOfferLoadApp() {
    this.authService.notOfferLoadApp().subscribe(data => {
      this.authService.updateNotShowOfferLoadApp();
      this.sessionService.remove(AuthService.TIME_NEXT_SHOW_OFFER);
      this.dialogRef.close();
    });
  }

  getLinkToUpload(): string {
    return navigator.userAgent.toLowerCase().indexOf("iphone") != -1
      ? "https://apps.apple.com/ru/app/gooddeal/id1507809289"
      : "https://play.google.com/store/apps/details?id=com.keeneye.gd"
  }
}
