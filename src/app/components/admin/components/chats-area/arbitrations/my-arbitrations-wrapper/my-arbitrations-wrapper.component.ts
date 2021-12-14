import { ArbitrationsWithCountedPages } from './../../../../../../models/chat/arbitrationsWithCountedPages';
import { ChatArbitration } from '../../../../../../models/chat/arbitration/chatArbitration';
import { AdminChatService } from '../../../../service/admin-chat.service';
import { ArbitrationsCommonComponent } from '../arbitrations-common/arbitrations-common.component';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-my-arbitrations-wrapper',
  templateUrl: './my-arbitrations-wrapper.component.html',
  styleUrls: ['./my-arbitrations-wrapper.component.css']
})
export class MyArbitrationsWrapperComponent implements OnInit {
  @ViewChild(ArbitrationsCommonComponent, {static: false}) arbitrationsTemplate: ArbitrationsCommonComponent;

  arbitrationsWithCountedPages: ArbitrationsWithCountedPages;

  constructor(private adminChatService: AdminChatService) {
    this.arbitrationsWithCountedPages = new ArbitrationsWithCountedPages();
  }

  ngOnInit() {
    this.getMyArbitrations(this.arbitrationsWithCountedPages);
  }

  loadArbitrationsHandler(event: ArbitrationsWithCountedPages) {
    this.getMyArbitrations(event);
  }

  getMyArbitrations(arbitrationsWithCountedPages) {
    this.adminChatService.getAllMyArbitrations(arbitrationsWithCountedPages).subscribe((data: ArbitrationsWithCountedPages) => {
      this.arbitrationsTemplate.reloadArbitrations(data.arbitrations);
      this.arbitrationsTemplate.arbitrationsWithCountedPages.pageableParams.countedPages = data.pageableParams.countedPages;
    });
  }

}
