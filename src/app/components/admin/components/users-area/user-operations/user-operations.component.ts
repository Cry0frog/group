import { ShortLegalEntity } from 'src/app/models/legal-entity-info/shortLegalEntity';
import { AdminService } from './../../../service/admin.service';
import { ShortPartner } from './../../../../../models/partner/shortPartner';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ReplenishmentBonusesOfAdmin } from 'src/app/models/admin/replenishmentBonusesOfAdmin';
import { SendingNotificationOfAdmin } from 'src/app/models/admin/sendingNotificationOfAdmin';
import { FilterRole } from 'src/app/auth/filterRole';
import { FILTER_ROLES } from 'src/app/components/admin/common/admin.descriptions';

@Component({
  selector: 'app-user-operations',
  templateUrl: './user-operations.component.html',
  styleUrls: ['./user-operations.component.css']
})
export class UserOperationsComponent implements OnInit {

  @Input() selectedUsers: any[];
  @Input() sendNotifMode: boolean;
  @Input() replenishmentBonusesMode: boolean;
  @Input() isLegalEntities: boolean;
  @Output() checkSelectedUsersEvent = new EventEmitter();
  @Output() cancelOperationEvent = new EventEmitter();
  @Output() updateSelectedUsers = new EventEmitter<any[]>();

  isDisabledMessageOperation: boolean;
  isDisabledAmountOperation: boolean;
  eventProgress: number;
  counterProgress: number;

  sendingNotificationOfAdmin: SendingNotificationOfAdmin;
  replenishmentBonusesOfAdmin: ReplenishmentBonusesOfAdmin;

  selectedUser: FilterRole;
  filterRoles = FILTER_ROLES;

  config: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      link: [
        ['link', ['linkDialogShow', 'unlink']]
      ],
      air: [
        [
          'font',
          [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'superscript',
            'subscript',
            'clear'
          ]
        ],
      ]
    },
    height: '600px',
    toolbar: [
      ['misc', ['undo', 'redo']],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['link']],
      ['customButtons', ['testBtn']]
    ]
  };


  constructor(private adminService: AdminService) {
    this.counterProgress = 0;
    this.replenishmentBonusesOfAdmin = new ReplenishmentBonusesOfAdmin();
    this.sendingNotificationOfAdmin = new SendingNotificationOfAdmin();
    this.selectedUser = FilterRole.ALL;
   }

  ngOnInit() {
  }

  isDisableRole(filterRole): boolean {
    return this.isLegalEntities && filterRole == FilterRole.SUPER_USER;
  }

  sendAllMessagesOrder(index) {
    if(index == null) {
      index = 0;
      this.isDisabledMessageOperation = true;
      this.sendingNotificationOfAdmin.message.prepareBeforeSave();
    }

    if(this.selectedUsers[index] != null) {
      this.sendingNotificationOfAdmin.selectedUsername = this.selectedUsers[index].username;
      this.sendMessage(index);
    }

  }

  sendMessage(index) {
    this.adminService.sendMessages(this.sendingNotificationOfAdmin).subscribe(data => {
      if(data != null) {
        this.counterProgress = this.counterProgress + 1;
        this.eventProgress = Math.round((this.counterProgress / this.selectedUsers.length) * 100);
        if(this.eventProgress == 100) {
          this.isDisabledMessageOperation = false;
          this.cancelOperation();
        }
        else{
          return this.sendAllMessagesOrder(++index);
        }
      }
    });
  }

  accrualBonusesOrder(index) {
    if(index == null) {
      index = 0;
      this.isDisabledAmountOperation = true;
    }

    if(this.selectedUsers[index] != null) {
      this.replenishmentBonusesOfAdmin.selectedUsername = this.selectedUsers[index].username;
      this.accrueBonuse(index);
    }
  }

  accrueBonuse(index) {
    this.adminService.replenishmentBonuses(this.replenishmentBonusesOfAdmin).subscribe(data => {
      if(data != null) {
        this.counterProgress = this.counterProgress + 1;
        this.eventProgress = Math.round((this.counterProgress / this.selectedUsers.length) * 100);
        if(this.eventProgress == 100) {
          this.isDisabledAmountOperation = false;
          this.cancelOperation();
        }
        else {
          return this.accrualBonusesOrder(++index);
        }
      }
    });
  }

  cancelOperation() {
    this.cancelOperationEvent.emit();
    this.eventProgress = 0;
    this.counterProgress = 0;
    this.replenishmentBonusesOfAdmin = new ReplenishmentBonusesOfAdmin();
    this.sendingNotificationOfAdmin = new SendingNotificationOfAdmin();
  }

  selectAllUsers() {
    this.isDisabledAmountOperation = true;
    this.isDisabledMessageOperation = true;
    this.updateSelectedUsers.emit([]);

    if(this.isLegalEntities) {
      this.adminService.getAllLegalEntities(this.selectedUser).subscribe((data: ShortLegalEntity[]) => {
        this.finalySelectAllOperations(data);
      });
    }
    else {
      this.adminService.getAllUsers(this.selectedUser).subscribe((data: ShortPartner[]) => {
        this.finalySelectAllOperations(data);
      });
    }
  }

  private finalySelectAllOperations(data) {
    this.isDisabledAmountOperation = false;
    this.isDisabledMessageOperation = false;
    this.selectedUser = FilterRole.ALL;
    this.updateSelectedUsers.emit(data)
    this.checkSelectedUsersEvent.emit();
  }

}
