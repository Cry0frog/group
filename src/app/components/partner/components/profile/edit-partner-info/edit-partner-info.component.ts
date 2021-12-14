import { SessionStorageService } from 'angular-web-storage';
import { PartnerInfoWithCity } from './../../../../../models/partnerInfo/partnerInfoWithCity';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PartnerService } from '../../../service/partner.service';

@Component({
  selector: 'app-edit-partner-info',
  templateUrl: './edit-partner-info.component.html',
  styleUrls: ['./edit-partner-info.component.css']
})
export class EditPartnerInfoComponent implements OnInit {
  oldPhoneNumber: string;

  constructor(public dialogRef: MatDialogRef<EditPartnerInfoComponent>,
    private sessionStorage: SessionStorageService,
    private partnerService: PartnerService,
    @Inject(MAT_DIALOG_DATA) public data: PartnerInfoWithCity
  ) {
    this.oldPhoneNumber = data.phoneNumber;
  }

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleUpdatePartnerInfoError(error: any) {
    this.data.isError = true;
    this.data.errors = error.errors;
  }

  updatePartneInfo() {
    this.data.isError = false;
    this.partnerService.checkValidateByUpdatePartnerInfo(this.data).subscribe((el: any) => {
      if(el.ok != null && el.ok == false) {
        this.handleUpdatePartnerInfoError(el.error);
        return;
      }

      this.sessionStorage.remove('update_content__update_partner_info');
      if(this.oldPhoneNumber != this.data.phoneNumber) {
        this.data.isEditPhoneNumber = true;
      }

      if(el.errors == undefined) {
        this.dialogRef.close(this.data);
        return;
      }
    });
  }
}
