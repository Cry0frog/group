import { Component, OnInit } from '@angular/core';
import { PasswordRecovery } from 'src/app/models/auth/passwordRecovery';
import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { SessionStorageService } from 'angular-web-storage';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { VerificationRequestComponent } from '../registration/verification-request/verification-request.component';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css']
})
export class PasswordRecoveryComponent implements OnInit {

  isVerificationTrue: boolean;

  passwordRecovery: PasswordRecovery;

  constructor(private partnerService: PartnerService,
    private sessionStorage: SessionStorageService,
    public dialog: MatDialog,
    public router: Router) {
    this.isVerificationTrue = false;
    this.passwordRecovery = new PasswordRecovery();
   }

  ngOnInit() {
  }

  handlePasswordRecoveryError(error: any) {
    this.passwordRecovery.isError = true;
    this.passwordRecovery.errors = error.errors;
    this.passwordRecovery.verificationToken = null;
  }

  pullCheckRequest() {
    this.passwordRecovery.isError = false;
    this.passwordRecovery.password = "default";
    this.passwordRecovery.confirmationPassword = "default";
    this.partnerService.checkPartnerForPasswordRecovery(this.passwordRecovery).subscribe((data: any) => {
      if(data.ok != null && data.ok == false) {
        this.handlePasswordRecoveryError(data.error);
        return;
      }

      this.sessionStorage.remove('password_recovery_content');
      if(data.errors == undefined) {
        if(data == true) {
          this.isVerificationTrue = true;
          this.passwordRecovery.password = null;
          this.passwordRecovery.confirmationPassword = null;
          return;
        }
      }
    });
  }

  getVerificationRequest() {
    const dialogRef = this.dialog.open(VerificationRequestComponent, {
      width: '850px',
      data: this.passwordRecovery
    });
    dialogRef.afterClosed().subscribe((data: PasswordRecovery) => {
      if(data != undefined) {
        this.pullPasswordRecoveryRequest(data);
      }
    });
  }

  pullPasswordRecoveryRequest(data: PasswordRecovery) {
    this.passwordRecovery.isError = false;
    this.partnerService.passwordRecovery(this.passwordRecovery).subscribe((data: any) => {
      if(data.ok != null && data.ok == false) {
        this.handlePasswordRecoveryError(data.error);
        return;
      }

      this.sessionStorage.remove('update_content__update_password');
      if(data.errors == undefined) {
        this.router.navigateByUrl('/login');
      }
    });
  }
}
