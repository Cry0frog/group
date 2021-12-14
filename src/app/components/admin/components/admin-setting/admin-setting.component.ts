import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { AdminSetting } from 'src/app/models/auth/adminSetting';

@Component({
  selector: 'app-admin-setting',
  templateUrl: './admin-setting.component.html',
  styleUrls: ['./admin-setting.component.css']
})
export class AdminSettingComponent implements OnInit {
  setting: AdminSetting;
  isChangeSetting: boolean;

  constructor(private adminService: AdminService) {
    this.setting = new AdminSetting();
  }

  ngOnInit() {
    this.getAdminSetting();
  }

  getAdminSetting() {
    this.adminService.getAdminSetting().subscribe((data: AdminSetting) => {
      this.isChangeSetting = false;
      if(data != null) {
        this.setting = data;
      }
    });
  }

  changeSetting() {
    this.isChangeSetting = true;
  }

  editSetting() {
    this.adminService.editSetting(this.setting).subscribe(data => {
      this.getAdminSetting();
    })
  }

}
