import { LegalEntityInfo } from 'src/app/models/legal-entity-info/legalEntityInfo';
import { Router } from '@angular/router';
import { ObligatoryPerformerInfoComponent } from './obligatory-performer-info/obligatory-performer-info.component';
import { PartnerInfoWithCity } from './../../../../models/partnerInfo/partnerInfoWithCity';
import { AuthService } from './../../../../auth/auth.service';
import { PartnerService } from './../../service/partner.service';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { TASK_REQUEST_TRANSLATE } from 'src/app/common/taskRequest.description';
import { ShortTaskRequest } from 'src/app/models/task/shortTaskRequest';
import { FilterStatusRequest } from 'src/app/models/task/filterStatusRequest';
import { ROLE } from 'src/app/auth/role';
import { MatDialog } from '@angular/material';
import { VerificationRequestComponent } from 'src/app/components/shared-module/auth/registration/verification-request/verification-request.component';
import { ActiveUrls } from 'src/app/auth/activeUrls';
import { UrlResolver } from '../../common/urlResolver';
import { ObligatoryLegalEntityInfoComponent } from './obligatory-legal-entity-info/obligatory-legal-entity-info.component';
import { ObligatoryPerformerInfo } from 'src/app/models/partnerInfo/obligatoryPerformerInfo';

@Component({
  selector: 'app-executor-panel',
  templateUrl: './executor-panel.component.html',
  styleUrls: ['./executor-panel.component.css']
})
export class ExecutorPanelComponent implements OnInit {
  @Input() taskShortRequestInfos: ShortTaskRequest[];
  @Input() status: FilterStatusRequest;
  @Output() eventFilter = new EventEmitter<FilterStatusRequest>();

  taskRequetsStatus = TASK_REQUEST_TRANSLATE;
  partnerInfo: PartnerInfoWithCity;
  partnerId: number;
  isDisabled: boolean;
  legalEntityInfo: LegalEntityInfo;

  currentUrl: string;

  constructor(private service: PartnerService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog) {
      this.partnerId = authService.LoggedUser.creatorId;
     }

  ngOnInit() {
    this.currentUrl = UrlResolver.getMainSectionFromUrl(this.router.url);
    if(!this.isPerformer()) {
      this.getCurrentPartnerInfo();
    }
  }

  isLegalEnityFull(): boolean {
    return this.authService.isLegalEntityFull();
  }

  isPerformer(): boolean {
    return this.authService.isPerformer();
  }

  addPerformerRole() {
    this.isDisabled = true;
    this.service.addPerformerRole().subscribe((roles: ROLE[]) => {
      this.isDisabled = false;
      this.ngOnInit();
    });
  }

  get sortedArray(): ShortTaskRequest[] {
    return this.taskShortRequestInfos.sort((a, b) => {
       return b.id - a.id;
    });
  }

  isLegalEntityFull(): boolean {
    return this.partnerInfo.roles.includes(ROLE.LEGAL_ENTITY_FULL);
  }

  getCurrentPartnerInfo() {
    this.service.getCurrentPartnerInfo(this.partnerId).subscribe(data => {
      this.partnerInfo = data;
      if(this.isLegalEntityFull()) {
        this.getCurrentLegalEntityInfo();
      }
    });
  }

  getCurrentLegalEntityInfo() {
    this.service.getCurrentLegalEntityInfo(this.partnerId).subscribe((data: LegalEntityInfo) => {
      if(data != null) {
        this.legalEntityInfo = data;
      }
    });
  }

  isStatusNotVerify(): boolean {
    return this.authService.isStatusNotVerify();
  }

  isAllStatus(): boolean {
    return this.status == FilterStatusRequest.ALL;
  }

  isInProgressStatus(): boolean {
    return this.status == FilterStatusRequest.IN_PROGRESS;
  }

  isCustomerConfirmedStatus(): boolean {
    return this.status == FilterStatusRequest.CUSTOMER_CONFITMED;
  }

  isUnderConsiderationStatus(): boolean {
    return this.status == FilterStatusRequest.UNDER_CUNSIDERATION;
  }

  isCanceledStatus(): boolean {
    return this.status == FilterStatusRequest.CANCELED;
  }

  filterAll() {
    this.status = FilterStatusRequest.ALL;
    this.eventFilter.emit(this.status);
  }

  filterCustomerConfirmed() {
    this.status = FilterStatusRequest.CUSTOMER_CONFITMED;
    this.eventFilter.emit(this.status);
  }

  filterUnderConsideration() {
    this.status = FilterStatusRequest.UNDER_CUNSIDERATION;
    this.eventFilter.emit(this.status);
  }

  filterCanceled() {
    this.status = FilterStatusRequest.CANCELED;
    this.eventFilter.emit(this.status);
  }

  openTask(id) {
    let url = "";
    if(this.currentUrl == ActiveUrls.PARTNER_EXECUTOR_PANEL) {
      url = this.router.serializeUrl(this.router.createUrlTree([`user/${this.authService.getCurrentId}/executor-panel/${id}`]));
    }

    window.open(url, '_blank');
  }

  editPartnerInfo() {
    const dialogRef = this.dialog.open(ObligatoryPerformerInfoComponent, {
      width: '850px',
      data: this.partnerInfo
    });
    dialogRef.afterClosed().subscribe((info: ObligatoryPerformerInfo) => {
      if(info != null) {
        this.handlerAfterUpdateUserInfo(info);
      }
    });
  }

  editLegalEntityInfo() {
    const dialogRef = this.dialog.open(ObligatoryLegalEntityInfoComponent, {
      width: '850px',
      data: this.legalEntityInfo
    });
    dialogRef.afterClosed().subscribe((data: ObligatoryPerformerInfo) => {
      if(data != null) {
        this.handlerAfterUpdateUserInfo(data);
      }
    });
  }

  handlerAfterUpdateUserInfo(info) {
    if(info.isEditPhoneNumber) {
      const dialogRef = this.dialog.open(VerificationRequestComponent, {
        width: '850px',
        data: info
      });
      dialogRef.afterClosed().subscribe((data: ObligatoryPerformerInfo) => {
        if(data != undefined && data.verificationToken != null) {
          this.service.updateObligatoryInfoPermormer(data).subscribe(el => {
            if(el != null) {
              this.authService.updateStatus(el.statusUser);
              this.addPerformerRole();
            }
          });
        }
      });
    }
    else {
      this.service.updateObligatoryInfoPermormer(info).subscribe(el => {
        if(el != null) {
          this.addPerformerRole();
        }
      });
    }
  }

}
