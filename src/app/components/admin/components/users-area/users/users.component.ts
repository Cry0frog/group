import { AuthService } from './../../../../../auth/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { AdminService } from '../../../service/admin.service';
import { ShortPartner } from 'src/app/models/partner/shortPartner';
import { ROLE_TITILE_DISPLAY, ROLE_DISPLAY, FILTER_ROLES, IFilterUserRoleMapper } from '../../../common/admin.descriptions';
import { MatDialog } from '@angular/material';
import { AddUserComponent } from './add-user/add-user.component';
import { UpdateStatusComponent } from './update-status/update-status.component';
import { ROLE } from 'src/app/auth/role';
import { BlockUsersComponent } from './block-users/block-users.component';
import { PageableParams } from 'src/app/models/pageable/PageableParams';
import { SortParams } from 'src/app/models/sort/sortParams';
import { ShortPartnersWitCountedPages } from 'src/app/models/partner/shortPartnersWitCountedPages';
import { BaseLazyLoadingService } from 'src/app/services/base-lazy-loading.service';
import { SessionStorageService } from 'angular-web-storage';
import { AdminChatService } from '../../../service/admin-chat.service';
import { Chat } from 'src/app/models/chat/common/chat';
import { DeleteUserComponent } from './delete-user/delete-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'dateReg', 'username', 'fio', 'roles', 'phoneNumber', 'city', 'operations'];
  dataSource: MatTableDataSource<ShortPartner>;
  shortPartners: ShortPartner[];
  roleTitleDisplay = ROLE_TITILE_DISPLAY;
  roleDisplay = ROLE_DISPLAY;

  filterRoles: IFilterUserRoleMapper[] = FILTER_ROLES;

  selectedUsers: ShortPartner[];
  sendNotifMode: boolean;
  replenishmentBonusesMode: boolean;

  shortPartnersWitCountedPages: ShortPartnersWitCountedPages;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private adminService: AdminService,
    private authService: AuthService,
    private chatService: AdminChatService,
    private router: Router,
    private sessionStorage: SessionStorageService,
    public dialog: MatDialog,
    private baseLazyLoadingService: BaseLazyLoadingService
  ) {
    this.shortPartners = [];
    this.selectedUsers = [];
    this.shortPartnersWitCountedPages = new ShortPartnersWitCountedPages();
  }

  ngOnInit() {
    this.loadAllShortPartnersOnPage();
  }

  addCandUser(checked: boolean, row: ShortPartner) {
    if(checked) {
      this.selectedUsers.push(row);
    }
    else {
      this.selectedUsers = this.selectedUsers.filter(el => el != row);
    }
  }

  checkSelectedUsers() {
    if(this.selectedUsers.length != 0) {
      this.shortPartners.filter(a => this.selectedUsers.find(b => a.id===b.id)).forEach(el => el.isSelectUser = true);
    }
    else {
      this.shortPartners.forEach(el => el.isSelectUser = false);
    }
  }

  cancelOperationHandler() {
    this.selectedUsers = [];
    this.sendNotifMode = false;
    this.replenishmentBonusesMode = false;
    this.shortPartners.forEach(el => el.isSelectUser = false);
  }

  updateSelectedUsersHandler(selectedUsers) {
    this.selectedUsers = selectedUsers;
    this.checkSelectedUsers();
  }

  selectFilterRole(role) {
    this.shortPartnersWitCountedPages.pageableParams = new PageableParams();
    this.shortPartnersWitCountedPages.sortParams = new SortParams();
    this.loadAllShortPartnersOnPage();
  }

  sortChange(event) {
    this.shortPartnersWitCountedPages.sortParams = this.baseLazyLoadingService.sortChange(event, this.shortPartnersWitCountedPages.sortParams);
    this.shortPartnersWitCountedPages.pageableParams = new PageableParams();
    this.loadAllShortPartnersOnPage();
  }

  handlePage(event: any) {
    this.shortPartnersWitCountedPages.pageableParams = this.baseLazyLoadingService.handlePage(event, this.shortPartnersWitCountedPages.pageableParams);
    this.loadAllShortPartnersOnPage();
  }

  getTooltipForEnabled(enabled) {
    if (enabled == true) {
      return "Отключить пользователя"
    }
    else {return "Подключить пользователя";}
  }

  getTooltipForBlockPartner(user: ShortPartner) {
    if(user.roles.includes(ROLE.BAD_PARTNER)) {
      return "Разблокировать заказчика"
    }
    else {return "Заблокировать заказчика";}
  }

  getTooltipForBlockPerformer(user: ShortPartner) {
    if(user.roles.includes(ROLE.BAD_PERFORMER)) {
      return "Разблокировать исполнителя"
    }
    else {return "Заблокировать исполнителя";}
  }

  isBlockPartner(user: ShortPartner): boolean {
    return user.roles.includes(ROLE.BAD_PARTNER);
  }

  isBlockPerformer(user: ShortPartner): boolean {
    return user.roles.includes(ROLE.BAD_PERFORMER);
  }

  isContainAdminRole(roles: ROLE[]) {
    if (!roles.includes(ROLE.SUPER_USER)) {
      return roles.filter((el:ROLE) => roles[el] == ROLE.SUPER_USER);
    }
  }

  isNotAdmin(roles: ROLE[]): boolean {
    return !roles.includes(ROLE.SUPER_USER);
  }

  isVisibleBtnDeleteAdmin(admin: ShortPartner): boolean {
    return !this.isNotAdmin(admin.roles) && this.authService.getUserId != admin.id && !admin.mainAdmin;
  }

  applyFilter(filterValue: string) {
    filterValue === "" ? this.shortPartnersWitCountedPages.search = null : this.shortPartnersWitCountedPages.search = filterValue;
    this.shortPartnersWitCountedPages.search = filterValue;
    this.shortPartnersWitCountedPages.pageableParams = new PageableParams();
    this.shortPartnersWitCountedPages.sortParams = new SortParams();
    this.loadAllShortPartnersOnPage();
  }

  loadAllShortPartnersOnPage() {
    this.adminService.getAllShortPartners(this.shortPartnersWitCountedPages).subscribe((data: ShortPartnersWitCountedPages) => {
      this.shortPartners = data.shortPartners;
      this.shortPartnersWitCountedPages.pageableParams.countedPages = data.pageableParams.countedPages;
      this.dataSource = new MatTableDataSource(this.shortPartners);
      this.dataSource.sort = this.sort;

      this.checkSelectedUsers();
    });
  }

  addShortPartner(){
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '550px',
      data: new ShortPartner()
    });
    dialogRef.afterClosed().subscribe((shortPartner: ShortPartner) => {
      if(shortPartner != null) {
        this.adminService.addShortPartner(shortPartner).subscribe(el => {
          this.loadAllShortPartnersOnPage();
        });
      }
    });
  }

  deleteAdmin(id) {
    const dialogRef = this.dialog.open(DeleteUserComponent, {
      width: '550px',
      data: id
    });
    dialogRef.afterClosed().subscribe((id: number) => {
      if(id != null) {
        this.adminService.deleteShortPartner(id).subscribe(el => {
          this.loadAllShortPartnersOnPage();
        });
      }
    });
  }

  updateStatus(shortPartner) {
    const partner: ShortPartner = new ShortPartner();
    Object.assign(partner, shortPartner);
    const dialogRef = this.dialog.open(UpdateStatusComponent, {
      width: '550px',
      data: partner
    });
    dialogRef.afterClosed().subscribe((shortPartner: ShortPartner) => {
      if(shortPartner != null) {
        this.adminService.updateStatus(shortPartner).subscribe(el => {
          this.loadAllShortPartnersOnPage();
        });
      }
    });
  }

  blockUser(shortPartner, partnerMode: boolean) {
    const partner: ShortPartner = new ShortPartner();
    Object.assign(partner, shortPartner);
    const dialogRef = this.dialog.open(BlockUsersComponent, {
      width: '550px',
      data: {user: partner, partnerMode: partnerMode}
    });
    dialogRef.afterClosed().subscribe((data: any) => {
      if(data != null) {
        this.adminService.blockUsers(data.user).subscribe(el => {
          this.loadAllShortPartnersOnPage();
        });
      }
    });
  }


  updateShortPartner(shortPartner) {
    const partner: ShortPartner = new ShortPartner();
    Object.assign(partner, shortPartner);
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '550px',
      data: partner
    });
    dialogRef.afterClosed().subscribe((shortPartner: ShortPartner) => {
      console.log('updateShortPartner handler');
      if(shortPartner != null) {
        this.adminService.updateShortPartner(shortPartner).subscribe(el => {
          this.loadAllShortPartnersOnPage();
        });
      }
    });
  }

  goToChat(row: ShortPartner) {
    this.chatService.getChatByParticipantId(row.id).subscribe((chat: Chat) => {
      this.sessionStorage.set('back_chat_url', this.router.url);
      this.router.navigate([`admin/chats/${chat.id}`]);
    });
  }

}
