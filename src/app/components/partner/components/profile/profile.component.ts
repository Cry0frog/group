import { ShortResume } from './../../../../models/resume/shortResume';
import { SessionStorageService } from 'angular-web-storage';
import { EditPhotoProfileComponent } from './edit-photo-profile/edit-photo-profile.component';
import { PartnerInfoWithCity } from './../../../../models/partnerInfo/partnerInfoWithCity';
import { AuthService } from 'src/app/auth/auth.service';
import { Component, OnInit} from '@angular/core';
import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { MatDialog } from '@angular/material';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { EditPartnerInfoComponent } from './edit-partner-info/edit-partner-info.component';
import { PasswordValidationProperty } from 'src/app/models/partnerInfo/passwordValidationProperty';
import { VerificationRequestComponent } from 'src/app/components/shared-module/auth/registration/verification-request/verification-request.component';
import { MobileTooltipComponent } from 'src/app/components/shared-module/mobile-tooltip/mobile-tooltip.component';
import { LegalEntityInfo } from 'src/app/models/legal-entity-info/legalEntityInfo';
import { EditLegalEntityInfoComponent } from './edit-legal-entity-info/edit-legal-entity-info.component';
import { BecomeMemberComponent } from './become-member/become-member.component';
import { OfferingTaskWrapperComponent } from 'src/app/components/shared-module/performers/find-performer-page/list-performers/offering-task-wrapper/offering-task-wrapper.component';
import { Task } from 'src/app/models/task/task';
import { CommonDialogNotificationComponent } from 'src/app/components/shared-module/common/common-dialog-notification/common-dialog-notification.component';
import { ROLE } from 'src/app/auth/role';
import { CommonDialogUserAuthorizationComponent } from 'src/app/components/shared-module/performers/find-performer-page/list-performers/common/common-dialog-user-authorization/common-dialog-user-authorization.component';
import { Router } from '@angular/router';
import { CommonDialogResumeComponent } from 'src/app/components/shared-module/resume/common-dialog-resume/common-dialog-resume.component';
import { Resume } from 'src/app/models/resume/resume';
import { VacancyUserAuthorizationComponent } from 'src/app/components/shared-module/resume/find-resume-page/vacancy-user-authorization/vacancy-user-authorization.component';
import { OfferingVacancyWrapperComponent } from 'src/app/components/shared-module/resume/find-resume-page/offering-vacancy-wrapper/offering-vacancy-wrapper.component';
import { Vacancy } from 'src/app/models/vacancy/vacancy';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  partnerId: number;
  partnerInfo: PartnerInfoWithCity;
  password: PasswordValidationProperty;
  isVisibleActOpenly: boolean;
  legalEntityInfo: LegalEntityInfo;
  isLegalEntityMode: boolean;

  constructor(private partnerService: PartnerService,
    private authService: AuthService,
    private sessionStorage: SessionStorageService,
    private router: Router,
    public dialog: MatDialog) {
      this.legalEntityInfo = new LegalEntityInfo();
      this.partnerInfo = new PartnerInfoWithCity();
      this.password = new PasswordValidationProperty;
    }

  ngOnInit() {
    if(this.sessionStorage.get(AuthService.SCROLL_VALUE)) {
      this.sessionStorage.remove(AuthService.SCROLL_VALUE);
      setTimeout(() => {
        window.scrollTo(0, document.getElementById('work_examples').offsetTop)
      }, 500);
    }

    this.getCurrentPartnerInfo();
  }

  get isMobileMode() {
    return this.authService.isMobileMode();
  }

  isNotNullResume(): boolean {
    return this.partnerInfo.resume != null && this.partnerInfo.resume.id != null;
  }

  isAuthenticated(): boolean {
    return this.authService.LoggedUser.authenticated;
  }

  isYourProfile(): boolean {
    return this.isAuthenticated() && this.partnerId == this.authService.getCurrentId;
  }

  isAdmin(): boolean {
    return this.isAuthenticated() && this.authService.isAdmin();
  }

  isPerformer(): boolean {
    return this.isAuthenticated() && this.authService.isPerformer();
  }

  getMatTooltip(): string {
    if(this.isVisibleActOpenly) {
      return "Пользователь указал свои данные и действует открыто";
    }
    else if(this.partnerInfo.isLegalEntityFull()) {
      return "Проверенная организация";
    }
  }

  getCurrentPartnerInfo() {
    this.partnerService.getCurrentPartnerInfo(this.partnerId).subscribe(data =>{
      this.partnerInfo = data;
      this.isVisibleActOpenly = (!data.emptyPassport && !this.authService.isStatusNotVerify()) || this.partnerInfo.isLegalEntityFull();
      if(this.partnerInfo.isLegalEntityFull()) {
        this.getCurrentLegalEntityInfo();
      }
      if(this.sessionStorage.get(AuthService.CREATE_RESUME)) {
        this.sessionStorage.remove(AuthService.CREATE_RESUME);
        document.getElementById('my-resume').click();
      }
    });
  }

  getCurrentLegalEntityInfoHendler(event) {
    this.getCurrentLegalEntityInfo();
  }

  getCurrentLegalEntityInfo() {
    this.partnerService.getCurrentLegalEntityInfo(this.partnerId).subscribe((data: LegalEntityInfo) => {
      if(data != null) {
        this.legalEntityInfo = data;
        this.isLegalEntityMode = true;
      }
    });
  }

  isGoodRating(): boolean {
    return this.partnerInfo.averageRating >= 4.0;
  }

  isAverageRating(): boolean {
    return this.partnerInfo.averageRating >= 2.5;
  }

  isBadPartner(): boolean {
    return this.authService.isBadPartner();
  }

  get tooltipActsOpenly(): string {
    return "Пользователь указал свои данные и действует открыто";
  }

  get tooltipGDRecommended(): string {
    return "GoodDeal рекомендует. Добросовестный пользователь";
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

  changeNotificationConf(cheked) {
    this.partnerService.changeNotificationConf(this.partnerInfo).subscribe(data => {
      if(data != null) {
        this.partnerInfo.getNotificationsAboutNewTaskMyCity = data.getNotificationsAboutNewTaskMyCity;
      }
    });
  }

  editPartnerInfo(partnerInfo) {
    const partner: PartnerInfoWithCity = new PartnerInfoWithCity();
    Object.assign(partner, partnerInfo);
    const dialogRef = this.dialog.open(EditPartnerInfoComponent, {
      width: '850px',
      data: partner
    });
    dialogRef.afterClosed().subscribe((partnerInfo: PartnerInfoWithCity) => {
      if(partnerInfo != null) {
        if(partnerInfo.isEditPhoneNumber) {
          const dialogRef = this.dialog.open(VerificationRequestComponent, {
            width: '850px',
            data: partnerInfo
          });
          dialogRef.afterClosed().subscribe((data: PartnerInfoWithCity) => {
            if(data != undefined && data.verificationToken != null) {
              this.partnerService.updatePartnerInfo(data).subscribe(el => {
                if(el != null) {
                  this.authService.updateStatus(el.statusUser);
                  this.getCurrentPartnerInfo();
                }
              });
            }
          });
        }
        else {
          this.partnerService.updatePartnerInfo(partnerInfo).subscribe(el => {
            if(el != null) {
              this.getCurrentPartnerInfo();
            }
          });
        }
      }
    });
  }

  editLegalEntityInfo() {
    const legalEntity: LegalEntityInfo = new LegalEntityInfo();
    Object.assign(legalEntity, this.legalEntityInfo);
    const dialogRef = this.dialog.open(EditLegalEntityInfoComponent, {
      width: '850px',
      data: legalEntity
    });
    dialogRef.afterClosed().subscribe((data: LegalEntityInfo) => {
      if(data != null) {
        if(data.isEditPhoneNumber) {
          const dialogRef = this.dialog.open(VerificationRequestComponent, {
            width: '850px',
            data: data
          });
          dialogRef.afterClosed().subscribe((data: LegalEntityInfo) => {
            if(data != undefined && data.verificationToken != null) {
              this.partnerService.updateLegalEntityInfo(data).subscribe(el => {
                if(el != null) {
                  this.authService.updateStatus(el.statusUser);
                  this.getCurrentLegalEntityInfo();
                }
              });
            }
          });
        }
        else {
          this.partnerService.updateLegalEntityInfo(data).subscribe(el => {
            this.getCurrentLegalEntityInfo();
          });
        }
      }
    });
  }

  changePassword(passwordPartner) {
    const password: PasswordValidationProperty = new PasswordValidationProperty();
    Object.assign(password, passwordPartner);
    this.dialog.open(UpdatePasswordComponent, {
      width: '550px',
      data: password
    });
  }

  changeUserPhoto() {
    this.dialog.open(EditPhotoProfileComponent, {
      width: "800px",
      data: this.partnerInfo
    });
  }

  becomeMember() {
    this.dialog.open(BecomeMemberComponent, {
      width: "800px",
      data: this.partnerInfo
    });
  }

  linkToMyChats() {
    this.router.navigateByUrl(`/user/${this.partnerId}/chat`)
  }

  offerTask() {
    if(!this.isAuthenticated()) {
      return this.dialog.open(CommonDialogUserAuthorizationComponent, {
        width: '550px',
        data: this.partnerInfo
      });
    }

    if(this.isBadPartner()) {
      this.openDialogNotific("Уважаемый пользователь, Вы не можете предлагать задания, так как Вы заблокированы.")
    }
    else {
      this.partnerService.checkBlockingPartner().subscribe(data => {
        if(data != null && data != -1) {
          this.authService.updateRolesForBlocking([ROLE.BAD_PARTNER]);
          return this.openDialogNotific("Уважаемый пользователь, Вы не можете предлагать задания, так как Вы заблокированы.");
        }
        const dialogRef = this.dialog.open(OfferingTaskWrapperComponent, {
          width: '850px',
          data: this.partnerInfo
        });
        dialogRef.afterClosed().subscribe((choosenTask: Task) => {
          if(choosenTask != null) {
            this.notifyAboutSuccessfullyOfferTask(choosenTask.name);
          }
        });

      });
    }
  }

  offerVacancy() {
    const shortResume = new ShortResume();
    shortResume.id = this.partnerInfo.resume.id;
    shortResume.creatorName = this.partnerInfo.resume.fio;
    shortResume.creatorId = this.partnerInfo.idPartner;

    if(this.authService.LoggedUser.authenticated) {
      const dialogRef = this.dialog.open(OfferingVacancyWrapperComponent, {
        width: '850px',
        data: shortResume
      });
      dialogRef.afterClosed().subscribe((data: Vacancy) => {
        if(data != null) {
          this.notifyAboutSuccessfullyOfferVacancy(data.name, this.partnerInfo.fio);
        }
      });
    }
    else {
      this.dialog.open( VacancyUserAuthorizationComponent, {
        width: '550px',
        data: shortResume
      });
    }
  }

  private notifyAboutSuccessfullyOfferVacancy(vacancyName: string, performerFio: string) {
    this.openDialogNotific(`Вы уведомили пользователя '${performerFio}',
      ожидайте ответа по вакансии '${vacancyName}'`);
  }

  private notifyAboutSuccessfullyOfferTask(taskName: string) {
    this.openDialogNotific(`Вы уведомили пользователя, ожидайте ответа по задаче '${taskName}'`);
  }

  private openDialogNotific(message: string) {
    this.dialog.open(CommonDialogNotificationComponent, {
      width: '650px',
      data: message
    });
  }

  openMyResume() {
    const resume: Resume = Resume.convertToObj(this.partnerInfo.resume);
    const dialogRef = this.dialog.open(CommonDialogResumeComponent, {
      width: '950px',
      autoFocus: false,
      data: resume,
      panelClass: 'profile_resume_window'
    });
    dialogRef.afterClosed().subscribe((data: Resume) => {
      if(data != null) {
        if(this.authService.LoggedUser.authenticated && this.authService.getCurrentId == data.creatorId) {
          this.getCurrentPartnerInfo();
        }
        else {
          this.partnerInfo.resume = data;
        }
      }
    });
  }

}
