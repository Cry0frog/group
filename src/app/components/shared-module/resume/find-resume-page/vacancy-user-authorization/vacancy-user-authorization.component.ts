import { ShortResume } from './../../../../../models/resume/shortResume';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-vacancy-user-authorization',
  templateUrl: './vacancy-user-authorization.component.html',
  styleUrls: ['./vacancy-user-authorization.component.css']
})
export class VacancyUserAuthorizationComponent implements OnInit {

  constructor(public router: Router,
    public dialogRef: MatDialogRef<VacancyUserAuthorizationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShortResume,
    public sessionStorage: SessionStorageService) { }

  ngOnInit() {
  }

  userAuthorization(): void {
    this.dialogRef.close();
    this.sessionStorage.set(AuthService.backUrlName, `/user/${this.data.creatorId}`);
    window.open(this.router.serializeUrl(this.router.createUrlTree([`/login`])), '_blank');
  }
}
