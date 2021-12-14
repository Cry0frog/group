import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';
import { CommonService } from 'src/app/common/services/common.service';
import { RequestSupport } from 'src/app/models/support/requestSupport';

@Component({
  selector: 'app-request-member',
  templateUrl: './request-member.component.html',
  styleUrls: ['./request-member.component.css']
})
export class RequestMemberComponent implements OnInit {
  isOpenWindowRequest: boolean;
  requestSuport: RequestSupport;
  isSendSuccess: boolean;

  constructor(private commonService: CommonService,
    private sessionStorage: SessionStorageService) {
    this.requestSuport = new RequestSupport();
   }

  ngOnInit() {
  }


  handleSendRequestError(error: any) {
    this.requestSuport.isError = true;
    this.requestSuport.errors = error.errors;
  }

  sendRequest() {
    this.commonService.sendRequestMember(this.requestSuport).subscribe((data: any) => {
      if(data.ok != null && data.ok == false) {
        this.handleSendRequestError(data.error);
        return;
      }

      this.sessionStorage.remove('send_partnership_request');

      this.isSendSuccess = true;
    });
  }

}
