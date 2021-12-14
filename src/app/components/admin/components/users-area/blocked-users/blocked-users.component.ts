import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ShortBlockedUsers } from 'src/app/models/partner/shortBlockedUsers';
import { AdminService } from '../../../service/admin.service';
import { AdminChatService } from '../../../service/admin-chat.service';
import { Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { ROLE } from 'src/app/auth/role';
import { BlockUsersComponent } from '../users/block-users/block-users.component';
import { ShortPartner } from 'src/app/models/partner/shortPartner';
import { Chat } from 'src/app/models/chat/common/chat';
import { LEVEL_BLOCKING } from '../../../common/admin.descriptions';


@Component({
  selector: 'app-blocked-users',
  templateUrl: './blocked-users.component.html',
  styleUrls: ['./blocked-users.component.css']
})
export class BlockedUsersComponent implements OnInit {
  displayedColumns: string[] = ['username', 'date_blocking', 'count_days_before_unlocking', 'level_blocking', 'description', 'operations'];
  dataSource: MatTableDataSource<ShortBlockedUsers>;
  shortBlockedUsers: ShortBlockedUsers[];
  level_blocking = LEVEL_BLOCKING;

  @Output() handleSwitchTaskEvent = new EventEmitter<number>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private adminService: AdminService,
    private chatService: AdminChatService,
    private router: Router,
    private sessionStorage: SessionStorageService,
    public dialog: MatDialog) {}

  ngOnInit() {
    this.loadAllShortBlockedUsers();
  }

  loadAllShortBlockedUsers() {
    this.adminService.getAllShortBlockedUsers().subscribe((data: ShortBlockedUsers[]) => {
      this.shortBlockedUsers = [];
      data.forEach((el: ShortBlockedUsers) => {
        this.shortBlockedUsers.push(ShortBlockedUsers.convertToObj(el));
      });

      this.dataSource = new MatTableDataSource(this.shortBlockedUsers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  isBlockPartner(user: ShortBlockedUsers): boolean {
    return user.roles.includes(ROLE.BAD_PARTNER);
  }

  isBlockPerformer(user: ShortBlockedUsers): boolean {
    return user.roles.includes(ROLE.BAD_PERFORMER);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  blockUser(shortBlockedUsers: ShortBlockedUsers, partnerMode: boolean) {
    const users: ShortPartner = new ShortPartner();
    users.roles = shortBlockedUsers.roles;
    users.id = shortBlockedUsers.id;
    const dialogRef = this.dialog.open(BlockUsersComponent, {
      width: '550px',
      data: {user: users, partnerMode: partnerMode}
    });
    dialogRef.afterClosed().subscribe((data: any) => {
      if(data != null) {
        this.adminService.blockUsers(data.user).subscribe(el => {
          this.loadAllShortBlockedUsers();
        });
      }
    });
  }

  goToChat(row: ShortBlockedUsers) {
    this.chatService.getChatByParticipantId(row.id).subscribe((chat: Chat) => {
      this.sessionStorage.set('back_chat_url', this.router.url);
      this.router.navigate([`admin/chats/${chat.id}`]);
    });
  }

}
