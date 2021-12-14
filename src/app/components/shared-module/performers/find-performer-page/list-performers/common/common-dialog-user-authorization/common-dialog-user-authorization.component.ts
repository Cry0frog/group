import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { AuthService } from 'src/app/auth/auth.service';
import { PartnerInfoWithCity } from 'src/app/models/partnerInfo/partnerInfoWithCity';

@Component({
  selector: 'app-common-dialog-user-authorization',
  templateUrl: './common-dialog-user-authorization.component.html',
  styleUrls: ['./common-dialog-user-authorization.component.css']
})
export class CommonDialogUserAuthorizationComponent implements OnInit {

  constructor(public router: Router,
    public dialogRef: MatDialogRef<CommonDialogUserAuthorizationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PartnerInfoWithCity,
    public sessionStorage: SessionStorageService) { }

  ngOnInit() {
  }

  userAuthorization(): void {
    this.dialogRef.close();
    this.sessionStorage.set(AuthService.backUrlName, `/user/${this.data.idPartner}`);
    window.open(this.router.serializeUrl(this.router.createUrlTree([`/login`])), '_blank');
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
