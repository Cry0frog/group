import { PartnerInfoWithCity } from './../../../../../../models/partnerInfo/partnerInfoWithCity';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonDialogNotificationComponent } from 'src/app/components/shared-module/common/common-dialog-notification/common-dialog-notification.component';
import { AuthService } from 'src/app/auth/auth.service';
import { OfferingTaskWrapperComponent } from '../offering-task-wrapper/offering-task-wrapper.component';
import { MobileTooltipComponent } from 'src/app/components/shared-module/mobile-tooltip/mobile-tooltip.component';
import { Observable } from 'rxjs';
import { ROLE } from 'src/app/auth/role';
import { Task } from 'src/app/models/task/task';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { SessionStorageService } from 'angular-web-storage';
import { CommonDialogUserAuthorizationComponent } from '../common/common-dialog-user-authorization/common-dialog-user-authorization.component';

@Component({
  selector: 'app-display-performers',
  templateUrl: './display-performers.component.html',
  styleUrls: ['./display-performers.component.css']
})
export class DisplayPerformersComponent implements OnInit {

  @Input() performers: PartnerInfoWithCity[];
  @Input() choosenTask: Task;
  @Output() eventChooseCategoryByTaskCategory = new EventEmitter<number>();

  constructor(private authService: AuthService,
    public dialog: MatDialog,
    private partnerService: PartnerService,
    public router: Router,
    public sessionStorage: SessionStorageService
  ) {
  }

  ngOnInit() {}

  get isMobileMode() {
    return this.authService.isMobileMode();
  }

  isLegalEntity(performer: PartnerInfoWithCity): boolean {
    return performer.roles.includes(ROLE.LEGAL_ENTITY_FULL);
  }

  isShowRaiting(performer): boolean {
    return performer.averageRating != 0 && !isNaN(performer.averageRating);
  }

  isLogged(): Observable<boolean> {
    return this.authService.isLoggedIn;
  }

  isBadPartner(): boolean {
    return this.authService.isBadPartner();
  }

  isAuthenticated(): boolean {
    return this.authService.LoggedUser.authenticated;
  }

  isNotYour(performer: PartnerInfoWithCity): boolean {
    return performer.idPartner != this.authService.getCurrentId;
  }

  isAdmin(): boolean {
    return this.authService.LoggedUser.authenticated && this.authService.isAdmin();
  }

  getTooltipMobile(text: string) {

    if(!this.isMobileMode) {
      return;
    }

    this.dialog.open(MobileTooltipComponent, {
      width: '250px',
      data: text,
      backdropClass: 'backdropBackground',
      panelClass: 'panel_class_mob_tooltip'
    });
  }

  offerTask(performer: PartnerInfoWithCity) {
    if (this.isAuthenticated()) {
      if(this.isBadPartner()) {
        this.openDialogNotific("Уважаемый пользователь, Вы не можете предлагать задания, так как Вы заблокированы.")
      }
      else {
        this.partnerService.checkBlockingPartner().subscribe(data => {
          if(data != null && data != -1) {
            this.authService.updateRolesForBlocking([ROLE.BAD_PARTNER]);
            return this.openDialogNotific("Уважаемый пользователь, Вы не можете предлагать задания, так как Вы заблокированы.");
          }

          if(this.choosenTask == null) {
            const dialogRef = this.dialog.open(OfferingTaskWrapperComponent, {
              panelClass: 'custom-dialog-container',
              width: '850px',
              data: performer
            });
            dialogRef.afterClosed().subscribe((choosenTask: Task) => {
              if(choosenTask != null) {
                this.notifyAboutSuccessfullyOfferTask(choosenTask.name, performer.fio);
              }
            });
          }
          else {
            this.partnerService.offerTaskToPerformer(this.choosenTask.id, performer.idPartner).subscribe(_ => {
              this.notifyAboutSuccessfullyOfferTask(this.choosenTask.name, performer.fio);
            });
          }
        });
      }
    }
    else {
      this.dialog.open(CommonDialogUserAuthorizationComponent, {
        width: '550px',
        data: performer
      });
    }
  }

  private notifyAboutSuccessfullyOfferTask(taskName: string, performerFio: string) {
    this.openDialogNotific(`Вы уведомили пользователя '${performerFio}',
      ожидайте ответа по задаче '${taskName}'`);
  }

  private openDialogNotific(message: string) {
    this.dialog.open(CommonDialogNotificationComponent, {
      width: '850px',
      data: message
    });
  }

  controlString(parameter) {
    if(parameter) {
      return false;
    }
    else {
      return true;
    }

  }

  getCategoriesNames(names: string[]): string {
    let categoriesNames: string = '';
    names.forEach(el => {
      categoriesNames = categoriesNames + " " + el + ";";
    });

    return categoriesNames;
  }

  routerProfile(performer) {
    if(!this.authService.LoggedUser.authenticated) {
      this.sessionStorage.set(AuthService.backUrlName, `/user/${performer.idPartner}`);
    }

    window.open(this.router.serializeUrl(this.router.createUrlTree([`/user/${performer.idPartner}`])), '_blank');
  }
}
