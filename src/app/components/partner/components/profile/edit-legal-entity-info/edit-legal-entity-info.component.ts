import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PartnerService } from '../../../service/partner.service';
import { GeoService } from 'src/app/services/geo.service';
import { LegalEntityInfo } from 'src/app/models/legal-entity-info/legalEntityInfo';

@Component({
  selector: 'app-edit-legal-entity-info',
  templateUrl: './edit-legal-entity-info.component.html',
  styleUrls: ['./edit-legal-entity-info.component.css']
})
export class EditLegalEntityInfoComponent implements OnInit {
  oldPhoneNumber: string;

  constructor(public dialogRef: MatDialogRef<EditLegalEntityInfoComponent>,
    private partnerService: PartnerService,
    private geoService: GeoService,
    @Inject(MAT_DIALOG_DATA) public data: LegalEntityInfo) {
      this.oldPhoneNumber = data.phoneNumber;
     }

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog() {
    if(this.data.phoneNumber != this.oldPhoneNumber) {
      this.data.isEditPhoneNumber = true;
    }

    this.dialogRef.close(this.data);
  }

}
