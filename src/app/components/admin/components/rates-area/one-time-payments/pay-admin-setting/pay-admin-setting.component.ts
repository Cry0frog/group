import { AdminSetting } from 'src/app/models/auth/adminSetting';
import { Component, Input, OnInit } from '@angular/core';
import { SWITCH_TUMBLER_ADMIN_SETTING } from 'src/app/components/admin/common/admin.descriptions';
import { AdminService } from 'src/app/components/admin/service/admin.service';

@Component({
  selector: 'app-pay-admin-setting',
  templateUrl: './pay-admin-setting.component.html',
  styleUrls: ['./pay-admin-setting.component.css']
})
export class PayAdminSettingComponent implements OnInit {

  adminSetting: AdminSetting;
  switchTumbler = SWITCH_TUMBLER_ADMIN_SETTING;

  @Input() isOneTimePayments: boolean;

  isChange: boolean;

  constructor(private adminService: AdminService) {
    this.adminSetting = new AdminSetting();
  }

  ngOnInit() {
    this.getAdminSetting();
  }

  getAdminSetting() {
    this.adminService.getAdminSetting().subscribe((data: AdminSetting) => {
      if(data != null) {
        this.adminSetting = data;
      }
    });
  }

  editSetting() {
    this.adminService.editSetting(this.adminSetting).subscribe(data => {
      this.getAdminSetting();
      this.isChange = false;
    })
  }

  changeShowButton() {
    this.isChange = true;
  }
}
