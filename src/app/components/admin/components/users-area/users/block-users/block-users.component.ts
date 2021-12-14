import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ROLE } from 'src/app/auth/role';
import { CHOOSE_TYPE_BLOCKING, CHOOSE_REASONS_BLOCKING_PERFORMER, CHOOSE_REASONS_BLOCKING_PARTNER } from '../../../../common/admin.descriptions';

@Component({
  selector: 'app-block-users',
  templateUrl: './block-users.component.html',
  styleUrls: ['./block-users.component.css']
})
export class BlockUsersComponent implements OnInit {
  chooseTypeBlocking = CHOOSE_TYPE_BLOCKING;
  chooseReasonsBlockingPerformer = CHOOSE_REASONS_BLOCKING_PERFORMER;
  chooseReasonsBlockingPartner = CHOOSE_REASONS_BLOCKING_PARTNER;

  constructor(public dialogRef: MatDialogRef<BlockUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isBlockPartner(): boolean {
    return this.data.user.roles.includes(ROLE.BAD_PARTNER);
  }

  isBlockPerformer(): boolean {
    return this.data.user.roles.includes(ROLE.BAD_PERFORMER);
  }

  blockUser() {
    if(this.data.partnerMode) {
      this.data.user.roles.push(ROLE.BAD_PARTNER);
    }
    else {
      this.data.user.roles.push(ROLE.BAD_PERFORMER);
    }
    this.data.user.blocked = true;
  }

  unlockUser() {
    if(this.data.partnerMode) {
      this.data.user.roles = this.data.user.roles.filter((role: ROLE) => role != ROLE.BAD_PARTNER);
    }
    else {
      this.data.user.roles = this.data.user.roles.filter((role: ROLE) => role != ROLE.BAD_PERFORMER);
    }
  }
}
