import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ShortLegalEntity } from 'src/app/models/legal-entity-info/shortLegalEntity';
import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { ADD_ROLES_LEGAL_ENTITY } from '../../../../common/admin.descriptions'
import { ROLE } from 'src/app/auth/role';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-change-status',
  templateUrl: './change-status.component.html',
  styleUrls: ['./change-status.component.css']
})
export class ChangeStatusComponent implements OnInit {
  originNameFile: string;
  addRolesLegalEntity = ADD_ROLES_LEGAL_ENTITY;
  selectRoles: ROLE[]
  saveRole: ROLE[];

  toppings = new FormControl();
  isActivateMode: boolean;
  isChangeRole: boolean;
  isShowConf: boolean;
  isShowBtnDeact: boolean;

  constructor(public dialogRef: MatDialogRef<ChangeStatusComponent>,
    private partnerService: PartnerService,
    @Inject(MAT_DIALOG_DATA) public data: ShortLegalEntity) {
      this.selectRoles = [];
      this.saveRole = [];
      this.isActivateMode = false;
      this.isChangeRole = false;
      this.isShowConf = true;
      this.isShowBtnDeact = true;
    }

  ngOnInit() {
    this.data.roles.forEach(role => {
      if(role != ROLE.MEMBER_ANOTHER && role != ROLE.MEMBER_PERFORMER && role != ROLE.MEMBER_STORE) {
        this.selectRoles.push(role);
      }
    });
    this.saveRole = this.selectRoles;
  }

  isMember(): boolean {
    return this.data.roles.includes(ROLE.MEMBER_ANOTHER) || this.data.roles.includes(ROLE.MEMBER_PERFORMER) || this.data.roles.includes(ROLE.MEMBER_STORE);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  changePassword() {
    this.data.changedPassword = true;
  }

  selectRole(event) {
    if(this.toppings.value.length > this.saveRole.length) {
      this.toppings.value.filter(a => !this.saveRole.find(b => a==b)).length == 0 ? this.isChangeRole = false : this.isChangeRole = true;
    }
    else {
      this.saveRole.filter(a => !this.toppings.value.find(b => a==b)).length == 0 ? this.isChangeRole = false : this.isChangeRole = true;
    }
  }

  afterClose() {
    if(this.isChangeRole) {
      this.data.roles = this.data.roles.concat(this.selectRoles)
    }
    else if(this.isActivateMode) {
      this.data.roles = this.selectRoles;
    }

    this.dialogRef.close(this.data);
  }

}
