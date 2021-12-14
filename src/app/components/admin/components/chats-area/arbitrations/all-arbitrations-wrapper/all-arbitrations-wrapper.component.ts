import { ArbitrationsWithCountedPages } from './../../../../../../models/chat/arbitrationsWithCountedPages';
import { ArbitrationsCommonComponent } from '../arbitrations-common/arbitrations-common.component';
import { AdminChatService } from '../../../../service/admin-chat.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-all-arbitrations-wrapper',
  templateUrl: './all-arbitrations-wrapper.component.html',
  styleUrls: ['./all-arbitrations-wrapper.component.css']
})
export class AllArbitrationsWrapperComponent implements OnInit {
  @ViewChild(ArbitrationsCommonComponent, {static: false}) arbitrationsTemplate: ArbitrationsCommonComponent;

  arbitrationsWithCountedPages: ArbitrationsWithCountedPages;

  constructor(private adminChatService: AdminChatService) {
    this.arbitrationsWithCountedPages = new ArbitrationsWithCountedPages();
  }

  ngOnInit() {
    this.getAllArbitrations(this.arbitrationsWithCountedPages);
  }

  loadArbitrationsHandler(event: ArbitrationsWithCountedPages) {
    this.getAllArbitrations(event);
  }

  getAllArbitrations(arbitrationsWithCountedPages) {
    this.adminChatService.getAllArbitrations(arbitrationsWithCountedPages).subscribe((data: ArbitrationsWithCountedPages) => {
      this.arbitrationsTemplate.reloadArbitrations(data.arbitrations);
      this.arbitrationsTemplate.arbitrationsWithCountedPages.pageableParams.countedPages = data.pageableParams.countedPages;
    });
  }

}
