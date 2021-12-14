import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SessionStorageService } from 'angular-web-storage';
import { PartnerService } from '../../../service/partner.service';
import { PasswordValidationProperty } from 'src/app/models/partnerInfo/passwordValidationProperty';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {

  constructor(private sessionStorage: SessionStorageService,
    private partnerService: PartnerService,
    public dialogRef: MatDialogRef<UpdatePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PasswordValidationProperty) {}

  ngOnInit() {
  }

  handleUpdatePasswordError(error: any) {
    this.data.isError = true;
    this.data.errors = error.errors;
  }

  updatePassword() {
    this.data.isError = false;
    this.partnerService.updatePassword(this.data).subscribe((el: any) => {
      if(el.ok != null && el.ok == false) {
        this.handleUpdatePasswordError(el.error);
        return;
      }
      
      this.sessionStorage.remove('update_content__update_password');
      if(el.errors==undefined) {
        this.dialogRef.close();
        return;
      }
    });
  }

  onNoClick(): void {
    return this.dialogRef.close();
  }

}