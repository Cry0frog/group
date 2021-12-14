import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PartnerInfoWithCity } from 'src/app/models/partnerInfo/partnerInfoWithCity';
import { RequestSupport } from 'src/app/models/support/requestSupport';
import { PartnerService } from '../../../service/partner.service';
import { SessionStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-become-member',
  templateUrl: './become-member.component.html',
  styleUrls: ['./become-member.component.css']
})
export class BecomeMemberComponent implements OnInit {

  request: RequestSupport;

  constructor(public dialogRef: MatDialogRef<BecomeMemberComponent>,
    private partnerService: PartnerService,
    private sessionStorage: SessionStorageService,
    @Inject(MAT_DIALOG_DATA) public data: PartnerInfoWithCity) { 
      this.request = new RequestSupport();
      this.request.email = data.email;
      this.request.fio = data.fio;
      this.request.phoneNumber = data.phoneNumber;
    }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  } 

  handleSendRequestError(error: any) {
    this.request.isError = true;
    this.request.errors = error.errors;
  }
  
  sendRequest() {
    this.partnerService.sendRequestMember(this.request).subscribe((data: any) => {
      if(data.ok != null && data.ok == false) {
        this.handleSendRequestError(data.error);
        return;
      }

      this.sessionStorage.remove('send_request_member_content');
      if(data.errors == undefined) {
        this.dialogRef.close();
      }
    });
  }
}