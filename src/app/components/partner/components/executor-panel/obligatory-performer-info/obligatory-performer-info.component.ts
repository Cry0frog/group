import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
import { PartnerService } from '../../../service/partner.service';
import { SessionStorageService } from 'angular-web-storage';
import { PartnerInfoWithCity } from 'src/app/models/partnerInfo/partnerInfoWithCity';
import { ObligatoryPerformerInfo } from 'src/app/models/partnerInfo/obligatoryPerformerInfo';

@Component({
  selector: 'app-obligatory-performer-info',
  templateUrl: './obligatory-performer-info.component.html',
  styleUrls: ['./obligatory-performer-info.component.css']
})
export class ObligatoryPerformerInfoComponent implements OnInit {

  oldPhoneNumber: string;
  obligatoryPerformerInfo: ObligatoryPerformerInfo;

  constructor(public dialogRef: MatDialogRef<ObligatoryPerformerInfoComponent>,
    private sessionStorage: SessionStorageService,
    private partnerService: PartnerService,
    @Inject(MAT_DIALOG_DATA) public data: PartnerInfoWithCity
  ) {
    this.obligatoryPerformerInfo = new ObligatoryPerformerInfo();
    this.oldPhoneNumber = this.data.phoneNumber;
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleUpdatePartnerInfoError(error: any) {
    this.obligatoryPerformerInfo.isError = true;
    this.obligatoryPerformerInfo.errors = error.errors;
  }

  addAllNewShortCategories(shortCategories) {
    this.obligatoryPerformerInfo.shortCategories = shortCategories;
  }

  updatePartneInfo() {
    this.obligatoryPerformerInfo.cityProperty = this.data.cityProperty;
    this.obligatoryPerformerInfo.email = this.data.email;
    this.obligatoryPerformerInfo.phoneNumber = this.data.phoneNumber;
    this.obligatoryPerformerInfo.aboutMe = this.data.aboutMe;

    this.obligatoryPerformerInfo.isError = false;

    this.partnerService.checkValidateByFillingInfo(this.obligatoryPerformerInfo).subscribe((el: any) => {
      if(el.ok != null && el.ok == false) {
        return this.handleUpdatePartnerInfoError(el.error);
      }

      this.sessionStorage.remove('filling_obligatory_info_permormer');

      if(this.oldPhoneNumber != this.obligatoryPerformerInfo.phoneNumber) {
        this.obligatoryPerformerInfo.isEditPhoneNumber = true;
      }

      if(el.errors == undefined) {
        return this.dialogRef.close(this.obligatoryPerformerInfo);
      }
    });
  }

}
