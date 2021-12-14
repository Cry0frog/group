import { Resume } from 'src/app/models/resume/resume';
import { ShortResume } from 'src/app/models/resume/shortResume';
import { MatDialog } from '@angular/material';
import { SessionStorageService } from 'angular-web-storage';
import { PLACE_WORK_TYPE_TRANSLATE } from './../../common/jobModule.discription';
import { AuthService } from './../../../../auth/auth.service';
import { VacancyComponentMode } from './vacancyComponentMode';
import { Vacancy } from './../../../../models/vacancy/vacancy';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EDUCATION_TYPE_TRANSLATE, WORK_EXPERIENCE_TYPE_TRANSLATE,
  SCHEDULE_TYPE_TRANSLATE, EMPLOYMENT_TYPE_TRANSLATE, VACANCY_STATUS_TRANSLATE} from '../../common/jobModule.discription';
import { WorkExperienceType } from 'src/app/models/vacancy/workExperienceType';
import { MapMode } from '../../map-handler/mapMode';
import { ActiveUrls } from 'src/app/auth/activeUrls';
import { Router } from '@angular/router';
import { UrlResolver } from 'src/app/components/partner/common/urlResolver';
import { VacancyStatus } from 'src/app/models/vacancy/vacancyStatus';
import { Observable } from 'rxjs';
import { CommonDialogNotificationComponent } from '../../common/common-dialog-notification/common-dialog-notification.component';
import { MapVacancyHandlerComponent } from '../../map-handler/map-vacancy-handler/map-vacancy-handler.component';
import { SubmitResumeWrapperComponent } from '../submit-resume-wrapper/submit-resume-wrapper.component';
import { PartnerService } from 'src/app/components/partner/service/partner.service';

@Component({
  selector: 'app-vacancy',
  templateUrl: './vacancy.component.html',
  styleUrls: ['./vacancy.component.css']
})
export class VacancyComponent implements OnInit {

  @Input() vacancy: Vacancy;
  @Input() submittedResumes: Resume[];
  @Input() mode: VacancyComponentMode;
  @Output() markVacancyEvent = new EventEmitter<Vacancy>();
  @Output() switchStatusEvent = new EventEmitter<Vacancy>();
  @Output() eventRefrashResumeVacancy = new EventEmitter();
  @Output() eventDeleteResume = new EventEmitter<number>();

  @ViewChild(MapVacancyHandlerComponent, {static: false}) mapComponent: MapVacancyHandlerComponent;

  educationTypeTranslate = EDUCATION_TYPE_TRANSLATE;
  experienceTypeTranslafe = WORK_EXPERIENCE_TYPE_TRANSLATE;
  placeWorkTypeTranslate = PLACE_WORK_TYPE_TRANSLATE;
  scheduleTypeTranslate = SCHEDULE_TYPE_TRANSLATE;
  employmentTypeTranslate = EMPLOYMENT_TYPE_TRANSLATE;

  vacancyStatusTranslates = VACANCY_STATUS_TRANSLATE;

  vacancyStatus = VacancyStatus;

  currentUrl: string;

  constructor(private authService: AuthService,
    private partnerService: PartnerService,
    private sessionStorage: SessionStorageService,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit() {
    let savedResume = this.sessionStorage.get("saved_resume");
    if(savedResume != null && savedResume != '') {
      this.sessionStorage.remove("saved_resume");
      savedResume = ShortResume.convertToObj(JSON.parse(savedResume));
      setTimeout(() => {
        this.partnerService.offerVacancy(this.vacancy.id, savedResume.creatorId).subscribe(_ => {
          this.notifyAboutSuccessfullyOfferVacancy(this.vacancy.name, savedResume.creatorName)
        });
      }, 200);
    }

    if(!this.isYourVacancy()) {
      this.addCountShoringByTimer(5);
    }

    this.currentUrl = UrlResolver.getMainSectionFromUrl(this.router.url);
  }

  addCountShoringByTimer(i) {
    setTimeout(() => {
      if(this.vacancy.id != null) {
        this.partnerService.addCountShowing(this.vacancy.id).subscribe(data => {});
      }
      else if(i != 0) {
        this.addCountShoringByTimer(--i);
      }
    }, 300);
  }

  deleteResume(vacancy: Vacancy) {
    this.eventDeleteResume.emit(vacancy.id);
    location.reload();
  }

  private notifyAboutSuccessfullyOfferVacancy(vacancyName: string, fio: string) {
    this.openDialogNotific(`Вы уведомили пользователя '${fio}',
      ожидайте ответа по вакансии '${vacancyName}'`);
  }

  private openDialogNotific(message: string) {
    this.dialog.open(CommonDialogNotificationComponent, {
      width: '850px',
      data: message
    });
  }

  submitResume() {
    const resume = new Resume(this.vacancy.id);
    const dialogRef = this.dialog.open(SubmitResumeWrapperComponent, {
      width: '950px',
      data: resume
    });
    dialogRef.afterClosed().subscribe(data => {
      if(data != null) {
        this.eventRefrashResumeVacancy.emit();
        location.reload();
      }
    });
  }

  viewResume(resume: Resume) {
    const copyResume = Resume.convertToObj(resume);
    const dialogRef = this.dialog.open(SubmitResumeWrapperComponent, {
      width: '950px',
      data: copyResume,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(data => {
      if(data != null) {
        this.eventRefrashResumeVacancy.emit();
      }
    });
  }

  switchToStatus(vacancyStatus) {
    let copyVacancy = new Vacancy();
    Object.assign(copyVacancy, this.vacancy);

    copyVacancy.status = vacancyStatus;
    this.switchStatusEvent.emit(copyVacancy);
  }

  offerVacancy() {
    this.sessionStorage.set(AuthService.CHOOSEN_VACANCY, JSON.stringify(this.vacancy));
    this.router.navigateByUrl(ActiveUrls.FIND_RESUME);
  }

  getMapMode() {
    return MapMode.ADD_POINT;
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isLogged(): Observable<boolean> {
    return this.authService.isLoggedIn;
  }

  isYourVacancy(): boolean {
    return this.vacancy != null && this.authService.LoggedUser != null && this.authService.getCurrentId == this.vacancy.creatorId;
  }

  isCommonMode(): boolean {
    return this.mode == VacancyComponentMode.COMMON;
  }

  isPartnerMode(): boolean {
    return this.mode == VacancyComponentMode.PARTNER;
  }

  isRequiredWorkExperience(): boolean {
    return this.vacancy.experienceType == WorkExperienceType.REQUIRED;
  }

  isAuthenticated(): boolean {
    return this.authService.LoggedUser != null && this.authService.LoggedUser.authenticated;
  }

  editVacancy(){
    if(this.currentUrl == ActiveUrls.PARTNER_VACANCY) {
      this.router.navigateByUrl(`user/${this.authService.getCurrentId}/${ActiveUrls.PARTNER_VACANCY}/update/${this.vacancy.id}`);
    }
    if(this.currentUrl == ActiveUrls.PARTNER_RESUME) {
      this.router.navigateByUrl(`user/${this.authService.getCurrentId}/${ActiveUrls.PARTNER_RESUME}/update/${this.vacancy.id}`);
    }
    else {
      this.router.navigateByUrl(`${ActiveUrls.FIND_VACANCIES}/update/${this.vacancy.id}`);
    }
  }

  isCreatorResume(resume: Resume) {
    return resume.creatorId == this.authService.getCurrentId;
  }

  isResumeSubmitted(): boolean {
    return this.submittedResumes != null && this.authService.LoggedUser.authenticated &&
      this.submittedResumes.some(resume => resume.creatorId === this.authService.getCurrentId);
  }

  isShowMarkVacancy(): boolean {
    return this.vacancy != null && this.vacancy.status == VacancyStatus.PUBLISHED;
  }

  markVacancy() {
    this.markVacancyEvent.emit(this.vacancy);
  }

  onLoadVacancyEvent(vacancy: Vacancy) {
    if(vacancy == null ){
      return;
    }

    const mapVacancy = vacancy.setMapToCenterOfPoints();
    if(this.mapComponent != null) {
      this.mapComponent.setMapCenter(mapVacancy[0], mapVacancy[1]);
    }
    setTimeout(() => {
      if(this.mapComponent != null) {
        this.mapComponent.setMapCenter(mapVacancy[0], mapVacancy[1]);
      }
    }, 300);
  }

}
