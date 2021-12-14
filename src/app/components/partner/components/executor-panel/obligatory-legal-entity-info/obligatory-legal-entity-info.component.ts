import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SessionStorageService } from 'angular-web-storage';
import { LegalEntityInfo } from 'src/app/models/legal-entity-info/legalEntityInfo';
import { ObligatoryPerformerInfo } from 'src/app/models/partnerInfo/obligatoryPerformerInfo';
import { PartnerService } from '../../../service/partner.service';

@Component({
  selector: 'app-obligatory-legal-entity-info',
  templateUrl: './obligatory-legal-entity-info.component.html',
  styleUrls: ['./obligatory-legal-entity-info.component.css']
})
export class ObligatoryLegalEntityInfoComponent implements OnInit {
  oldPhoneNumber: string;
  obligatoryPerformerInfo: ObligatoryPerformerInfo;

  constructor(public dialogRef: MatDialogRef<ObligatoryLegalEntityInfoComponent>,
    private partnerService: PartnerService,
    private sessionStorage: SessionStorageService,
    @Inject(MAT_DIALOG_DATA) public data: LegalEntityInfo
  ) {
    this.obligatoryPerformerInfo = new ObligatoryPerformerInfo();
    this.oldPhoneNumber = data.phoneNumber;
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleUpdateLegalInfoError(error: any) {
    this.obligatoryPerformerInfo.isError = true;
    this.obligatoryPerformerInfo.errors = error.errors;
  }

  addAllNewShortCategories(shortCategories) {
    this.obligatoryPerformerInfo.shortCategories = shortCategories;
  }

  updateLegalInfo() {
    this.obligatoryPerformerInfo.cityProperty = this.data.city;
    this.obligatoryPerformerInfo.email = this.data.email;
    this.obligatoryPerformerInfo.phoneNumber = this.data.phoneNumber;
    this.obligatoryPerformerInfo.aboutMe = this.data.aboutCompany;

    this.obligatoryPerformerInfo.isError = false;
    this.partnerService.checkValidateByFillingInfo(this.obligatoryPerformerInfo).subscribe((el: any) => {
      if(el.ok != null && el.ok == false) {
        return this.handleUpdateLegalInfoError(el.error);
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
