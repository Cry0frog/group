import { AdminStatisticsService } from './../../../service/admin-statistics.service';
import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatTableDataSource } from '@angular/material';
import { AdminService } from '../../../service/admin.service';
import { AdminChatService } from '../../../service/admin-chat.service';
import { Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { Chat } from 'src/app/models/chat/common/chat';
import { ShortLegalEntity } from 'src/app/models/legal-entity-info/shortLegalEntity';
import { ROLE_DISPLAY, ROLE_TITILE_DISPLAY, FILTER_LEGAL_ENTITY_MAPPER} from '../../../common/admin.descriptions';
import { UpdateStatusComponent } from '../users/update-status/update-status.component';
import { ChangeStatusComponent } from './change-status/change-status.component';
import { BlockUsersComponent } from '../users/block-users/block-users.component';
import { ROLE } from 'src/app/auth/role';
import { ShortLegalEntityWithCountedPages } from 'src/app/models/legal-entity-info/shortLegalEntityWithCountedPages';
import { PageableParams } from 'src/app/models/pageable/PageableParams';
import { BaseLazyLoadingService } from 'src/app/services/base-lazy-loading.service';
import { SortParams } from 'src/app/models/sort/sortParams';

@Component({
  selector: 'app-legal-entities',
  templateUrl: './legal-entities.component.html',
  styleUrls: ['./legal-entities.component.css']
})
export class LegalEntitiesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'username', 'nameOrganization', 'roles', 'phoneNumber', 'city', 'dateReg', 'operations'];
  dataSource: MatTableDataSource<ShortLegalEntity>;
  shortLegalEnties: ShortLegalEntity[];

  roleDisplay = ROLE_DISPLAY;
  roleTitleDisplay = ROLE_TITILE_DISPLAY;
  filterLegalEntityMapper = FILTER_LEGAL_ENTITY_MAPPER;

  selectedUsers: ShortLegalEntity[];
  sendNotifMode: boolean;
  replenishmentBonusesMode: boolean;

  shortLegalEntityWithCountedPages: ShortLegalEntityWithCountedPages;

  @Output() handleSwitchTaskEvent = new EventEmitter<number>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private adminService: AdminService,
    private chatService: AdminChatService,
    private router: Router,
    private sessionStorage: SessionStorageService,
    private adminStatisticsService: AdminStatisticsService,
    public dialog: MatDialog,
    private baseLazyLoadingService: BaseLazyLoadingService
  ) {
    this.shortLegalEntityWithCountedPages = new ShortLegalEntityWithCountedPages();
    this.selectedUsers = [];
  }

  ngOnInit() {
    this.loadAllShortLegalEntities();
  }

  addCandUser(checked: boolean, row: ShortLegalEntity) {
    if(checked) {
      this.selectedUsers.push(row);
    }
    else {
      this.selectedUsers = this.selectedUsers.filter(el => el != row);
    }
  }

  checkSelectedUsers() {
    if(this.selectedUsers.length != 0) {
      this.shortLegalEnties.filter(a => this.selectedUsers.find(b => a.id===b.id)).forEach(el => el.isSelectUser = true);
    }
    else {
      this.shortLegalEnties.forEach(el => el.isSelectUser = false);
    }
  }

  cancelOperationHandler() {
    this.selectedUsers = [];
    this.sendNotifMode = false;
    this.replenishmentBonusesMode = false;
    this.shortLegalEnties.forEach(el => el.isSelectUser = false);
  }

  updateSelectedUsersHandler(selectedUsers) {
    this.selectedUsers = selectedUsers;
    this.checkSelectedUsers();
  }

  getTooltip(enabled) {
    if(enabled == true) {
      return "Отключить пользователя"
    }
    else {return "Подключить пользователя";}
  }

  getTooltipForBlockPartner(user: ShortLegalEntity) {
    if(user.roles.includes(ROLE.BAD_PARTNER)) {
      return "Разблокировать заказчика"
    }
    else {return "Заблокировать заказчика";}
  }

  getTooltipForBlockPerformer(user: ShortLegalEntity) {
    if(user.roles.includes(ROLE.BAD_PERFORMER)) {
      return "Разблокировать исполнителя"
    }
    else {return "Заблокировать исполнителя";}
  }

  isBlockPartner(user: ShortLegalEntity): boolean {
    return user.roles.includes(ROLE.BAD_PARTNER);
  }

  isBlockPerformer(user: ShortLegalEntity): boolean {
    return user.roles.includes(ROLE.BAD_PERFORMER);
  }

  selectFilter(event) {
    this.loadAllShortLegalEntities();
  }

  applyFilter(filterValue: string) {
    filterValue === "" ? this.shortLegalEntityWithCountedPages.search = null : this.shortLegalEntityWithCountedPages.search = filterValue;
    this.shortLegalEntityWithCountedPages.search = filterValue;
    this.shortLegalEntityWithCountedPages.pageableParams = new PageableParams();
    this.shortLegalEntityWithCountedPages.sortParams = new SortParams();
    this.loadAllShortLegalEntities();
  }

  sortChange(event) {
    this.shortLegalEntityWithCountedPages.sortParams = this.baseLazyLoadingService.sortChange(event, this.shortLegalEntityWithCountedPages.sortParams);
    this.shortLegalEntityWithCountedPages.pageableParams = new PageableParams();
    this.loadAllShortLegalEntities();
  }

  handlePage(event: any) {
    this.shortLegalEntityWithCountedPages.pageableParams = this.baseLazyLoadingService.handlePage(event, this.shortLegalEntityWithCountedPages.pageableParams);
    this.loadAllShortLegalEntities();
  }

  loadAllShortLegalEntities() {
    this.adminService.getAllShortLegalEntity(this.shortLegalEntityWithCountedPages).subscribe((data: ShortLegalEntityWithCountedPages) => {
      if(data != null) {
        this.shortLegalEnties = data.shortLegalEntities;
        this.shortLegalEntityWithCountedPages.pageableParams.countedPages = data.pageableParams.countedPages;
        this.dataSource = new MatTableDataSource(this.shortLegalEnties);
        this.dataSource.sort = this.sort;

        this.checkSelectedUsers();
      }
    });
  }

  updateStatus(row: ShortLegalEntity) {
    const shortLegalEntity: ShortLegalEntity = new ShortLegalEntity();
    Object.assign(shortLegalEntity, row);
    const dialogRef = this.dialog.open(ChangeStatusComponent, {
      width: '750px',
      data: shortLegalEntity
    });
    dialogRef.afterClosed().subscribe((shortLegalEntity: ShortLegalEntity) => {
      if(shortLegalEntity != null) {
        this.adminService.changeStatusLegalEntity(shortLegalEntity).subscribe(el => {
          this.loadAllShortLegalEntities();
        });
      }
    });
  }

  changeEnable(row: ShortLegalEntity) {
    const dialogRef = this.dialog.open(UpdateStatusComponent, {
      width: '550px',
      data: row
    });
    dialogRef.afterClosed().subscribe((shortLegalEntity: ShortLegalEntity) => {
      if(shortLegalEntity != null) {
        this.adminService.changeEnableLegalEntity(shortLegalEntity).subscribe(el => {
          this.loadAllShortLegalEntities();
        });
      }
    });
  }

  blockLegalEntity(shortLegalEntity, partnerMode: boolean) {
    const legalEntity: ShortLegalEntity = new ShortLegalEntity();
    Object.assign(legalEntity, shortLegalEntity);
    const dialogRef = this.dialog.open(BlockUsersComponent, {
      width: '550px',
      data: {user: legalEntity, partnerMode: partnerMode}
    });
    dialogRef.afterClosed().subscribe((data: any) => {
      if(data != null) {
        this.adminService.blockLegalEntity(data.user).subscribe(el => {
          this.loadAllShortLegalEntities();
        });
      }
    });
  }

  goToChat(row: ShortLegalEntity) {
    this.chatService.getChatByParticipantId(row.id).subscribe((chat: Chat) => {
      this.sessionStorage.set('back_chat_url', this.router.url);
      this.router.navigate([`admin/chats/${chat.id}`]);
    });
  }

  getPartershipRequestsReport() {
    this.adminStatisticsService.getStatisticReportPartnershipRequests()
  }

}
