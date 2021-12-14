import { SessionStorageService } from 'angular-web-storage';
import { Router, NavigationExtras } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-request-not-enough-money',
  templateUrl: './request-not-enough-money.component.html',
  styleUrls: ['./request-not-enough-money.component.css']
})
export class RequestNotEnoughMoneyComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RequestNotEnoughMoneyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private sessionStorage: SessionStorageService) { }

  ngOnInit() {}

  goToPayEnough() {
    //routerLink="/partner/{{data.partnerId}}/profile"
    let navigationExtras: NavigationExtras = {
      queryParams: {
        'mode': 'PAY_TASK',
      },
    };
    this.sessionStorage.set('COMMISSION_USUAL_TASK', JSON.stringify(this.data.request));
    this.router.navigate([`user/${this.data.partnerId}/payments`], navigationExtras);

    this.onNoClick();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
