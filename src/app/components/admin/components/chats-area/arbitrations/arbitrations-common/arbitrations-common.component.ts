import { AdminChatService } from './../../../../service/admin-chat.service';
import { CHAT_ARBITRATION_DISPLAY } from './../../../../common/admin.descriptions';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ChatArbitration } from '../../../../../../models/chat/arbitration/chatArbitration';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ArbitrationsWithCountedPages } from 'src/app/models/chat/arbitrationsWithCountedPages';
import { PageableParams } from 'src/app/models/pageable/PageableParams';
import { SortParams } from 'src/app/models/sort/sortParams';
import { BaseLazyLoadingService } from 'src/app/services/base-lazy-loading.service';

@Component({
  selector: 'app-arbitrations-common',
  templateUrl: './arbitrations-common.component.html',
  styleUrls: ['./arbitrations-common.component.css']
})
export class ArbitrationsCommonComponent implements OnInit {
  @Input() isAll: boolean;
  @Output() reloadArbitrationsEvent = new EventEmitter<ArbitrationsWithCountedPages>();


  displayedColumns: string[] = ['id', 'initiator', 'participant', 'lastActiveInitiator', 'lastActiveParticipant', 'creationDate',
    'status', 'operations'];
  dataSource: MatTableDataSource<ChatArbitration>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  arbitrations: ChatArbitration[];
  chatArbitrationDisplay = CHAT_ARBITRATION_DISPLAY;
  arbitrationsWithCountedPages: ArbitrationsWithCountedPages;


  constructor(private router: Router,
    private adminChatService: AdminChatService,
    private baseLazyLoadingService: BaseLazyLoadingService
  ) {
    this.arbitrations = [];
    this.arbitrationsWithCountedPages = new ArbitrationsWithCountedPages();
  }

  ngOnInit() {
  }

  sortChange(event) {
    this.arbitrationsWithCountedPages.sortParams = this.baseLazyLoadingService.sortChange(event, this.arbitrationsWithCountedPages.sortParams);
    this.arbitrationsWithCountedPages.pageableParams = new PageableParams();
    this.reloadArbitrationsEvent.emit(this.arbitrationsWithCountedPages);
  }

  public handlePage(event: any) {
    this.arbitrationsWithCountedPages.pageableParams = this.baseLazyLoadingService.handlePage(event, this.arbitrationsWithCountedPages.pageableParams);
    this.reloadArbitrationsEvent.emit(this.arbitrationsWithCountedPages);
  }

  applyFilter(filterValue: string) {
    filterValue === "" ? this.arbitrationsWithCountedPages.search = null : this.arbitrationsWithCountedPages.search = filterValue;
    this.arbitrationsWithCountedPages.search = filterValue;
    this.arbitrationsWithCountedPages.pageableParams = new PageableParams();
    this.arbitrationsWithCountedPages.sortParams = new SortParams();
    this.reloadArbitrationsEvent.emit(this.arbitrationsWithCountedPages);
  }

  reloadArbitrations(arbitrations: ChatArbitration[]) {
    this.dataSource = new MatTableDataSource(arbitrations);
    this.dataSource.sort = this.sort;
  }

  adminJoinedToArbitration(arbitration: ChatArbitration) {
    this.adminChatService.adminJoinedToArbitration(arbitration.id).subscribe((arbitrationId: number) => {
      this.router.navigate(['/admin/arbitration/' + arbitrationId]);
    });
  }

  goToArbitration(chat: ChatArbitration) {
    this.router.navigate(['/admin/arbitration/' + chat.id]);
  }

}
