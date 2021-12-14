import { Component, Input, OnInit } from '@angular/core';
import { RequestSupport } from 'src/app/models/support/requestSupport';
import { CommonService } from 'src/app/common/services/common.service';
import { SessionStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {
  requestSupport: RequestSupport;
  isVisible: boolean;

  @Input() isOnlineConsultant: boolean;

  constructor(private commonService: CommonService,
    private sessionStorage: SessionStorageService) {
    this.requestSupport = new RequestSupport();
    this.isVisible = false;
   }

  ngOnInit() {}

  handlesendRequestSupportError(error: any) {
    this.requestSupport.isError = true;
    this.requestSupport.errors = error.errors;
  }

  sendRequestSupport() {
    this.requestSupport.isError = false;
    this.commonService.sendRequestSupport(this.requestSupport).subscribe((el: any) => {
      if(el.ok != null && el.ok == false) {
        this.handlesendRequestSupportError(el.error);
        return;
      }

      this.sessionStorage.remove('send_request_support');
      this.isVisible = true;
    });
  }

}
