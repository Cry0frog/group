import { Resume } from 'src/app/models/resume/resume';
import { ShortVacancy } from './../../../../../models/vacancy/shortVacancy';
import { OfferingVacancyWrapperComponent } from './../offering-vacancy-wrapper/offering-vacancy-wrapper.component';
import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { MatDialog } from '@angular/material';
import { ShortResume } from 'src/app/models/resume/shortResume';
import { Vacancy } from './../../../../../models/vacancy/vacancy';
import { FilterResume } from './../../../../../models/filter/filterResume';
import { Component, EventEmitter, HostListener, OnInit } from '@angular/core';
import { FieldActivity } from 'src/app/models/field-activity/fileldActivity';
import { SelectItem } from 'primeng/api';
import { GeoCityResponse } from 'src/app/models/map/geo/city/geoCityResponse';
import { AuthService } from 'src/app/auth/auth.service';
import { GeoService } from 'src/app/services/geo.service';
import { SessionStorageService } from 'angular-web-storage';
import { CommonService } from 'src/app/common/services/common.service';
import { GeoCityFeature } from 'src/app/models/map/geo/city/geoCityFeature';
import { RU_CALENDAR } from './../../../../../common/localization';
import { EDUCATION_TYPE, WORK_EXPERIENCE_TYPE, PLACE_WORK_TYPE,
  SCHEDULE_TYPE, EMPLOYMENT_TYPE, IScheduleType, IEmploymentType, IEducationType, IPlaceWorkType } from '../../../common/jobModule.discription';
import { ResumeComponentMode } from '../resumeComponentMode';
import { CommonDialogNotificationComponent } from '../../../common/common-dialog-notification/common-dialog-notification.component';

@Component({
  selector: 'app-find-resume',
  templateUrl: './find-resume.component.html',
  styleUrls: ['./find-resume.component.css']
})
export class FindResumeComponent implements OnInit {

  ru_calendar = RU_CALENDAR;

  educationTypes = EDUCATION_TYPE;
  workExperienceTypes = WORK_EXPERIENCE_TYPE;
  placeWorkTypes = PLACE_WORK_TYPE;
  scheduleTypes = SCHEDULE_TYPE;
  employmentTypes = EMPLOYMENT_TYPE;

  listResume: ShortResume[];
  fieldsActivity: FieldActivity[];
  filterResume: FilterResume;
  isLoadAll: boolean;
  partCityName: string;
  cities: SelectItem[];
  geoCityResponse: GeoCityResponse;

  choosenFieldsActivityIds: number[];
  choosenFieldsActivity: FieldActivity[];

  scheduleItems: SelectItem[];
  employmentItems: SelectItem[];
  educationItems: SelectItem[];
  placeWorkItems: SelectItem[];

  eventRefreshFieldsActivity = new EventEmitter<number[]>();

  choosenVacancy: Vacancy;

  constructor(private authService: AuthService,
    private geoService: GeoService,
    private sessionStorage: SessionStorageService,
    private partnerService: PartnerService,
    private commonService: CommonService,
    public dialog: MatDialog) {
      this.listResume = [];
      this.fieldsActivity = [];
      this.choosenFieldsActivityIds = [];
      this.choosenFieldsActivity = [];
      this.filterResume = new FilterResume();

      this.scheduleItems = this.scheduleTypes.map((el: IScheduleType) => {
        return {
          label: el.viewValue,
          value: el.value
        }
      });

      this.employmentItems = this.employmentTypes.map((el: IEmploymentType) => {
        return {
          label: el.viewValue,
          value: el.value
        }
      });

      this.educationItems = this.educationTypes.map((el: IEducationType) => {
        return {
          label: el.viewValue,
          value: el.value
        }
      });

      this.placeWorkItems = this.placeWorkTypes.map((el: IPlaceWorkType) => {
        return {
          label: el.viewValue,
          value: el.value
        }
      });
  }

  get isMobileMode() {
    return this.authService.isMobileMode();
  }

  ngOnInit() {
    this.getFilteredShortResume();
  }

  get getResumeMode() {
    return ResumeComponentMode.COMMON;
  }

  getFilteredShortResume() {
    this.commonService.getAllResume(this.filterResume).subscribe(data => {
      this.listResume = ShortResume.sortByCreatedAt(data);
    });
  }

  offerResumeHandler(resume: ShortResume) {
    if(this.choosenVacancy != null) {
      this.partnerService.offerVacancy(this.choosenVacancy.id, resume.creatorId).subscribe(data => {});
      this.notifyAboutSuccessfullyOfferVacancy(this.choosenVacancy.name, resume.creatorName);
    }
    else {
      const dialogRef = this.dialog.open(OfferingVacancyWrapperComponent, {
        width: '850px',
        data: resume
      });
      dialogRef.afterClosed().subscribe((data: ShortVacancy) => {
        if(data != null) {
          this.notifyAboutSuccessfullyOfferVacancy(data.name, resume.creatorName);
        }
      });
    }
  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = !this.isMobileMode ? document.documentElement.scrollHeight - 1 : document.documentElement.scrollHeight - 100;
    if(pos >= max && !this.isLoadAll) {
      this.handleLoadMoreVocancies();
    }
    this.isLoadAll = false;
  }

  handleLoadMoreVocancies() {
    this.filterResume.pageable.page++;
    this.commonService.getAllResume(this.filterResume).subscribe((data: ShortResume[]) => {
      if(data.length == 0) {
        this.isLoadAll = true;
        return;
      }

      this.listResume = this.listResume.concat(ShortResume.sortByCreatedAt(data));

    });
  }

  toggleFieldActivityHandler(fieldActivity) {
    this.toggleFieldAcivity(fieldActivity, true, false);
  }

  toggleFieldAcivity(fieldAcivity: FieldActivity, isNotRoot: boolean, isRemove: boolean) {

    const choosen = this.choosenFieldsActivity.filter(el => el.id != fieldAcivity.id);

    if(isRemove || choosen.length != this.choosenFieldsActivity.length) {

      this.choosenFieldsActivity = choosen;
      this.choosenFieldsActivityIds = this.choosenFieldsActivityIds.filter(id => id != fieldAcivity.id);
      isRemove = true;
    }
    else {
      this.choosenFieldsActivity.push(fieldAcivity);
      this.choosenFieldsActivityIds.push(fieldAcivity.id);
      isRemove = false;
    }

    if(fieldAcivity.children != null) {
      fieldAcivity.children.forEach(child => this.toggleFieldAcivity(child, false, isRemove));
    }
    else {
      this.isChooseAllChild(fieldAcivity);
    }

    if(isNotRoot) {
      this.refreshChoosenFieldsActivity(this.choosenFieldsActivity, true);
    }
  }

  isChooseAllChild(fieldAcivity: FieldActivity) {
    const root =  this.fieldsActivity.find(el => el.id == fieldAcivity.root.id);

    if(root == null) {
      return;
    }

    let result = true;
    const childrenIds: number[] = root.children.map(el => el.id);
    childrenIds.forEach(el => {
      if(!this.choosenFieldsActivityIds.includes(el)) {
        result = false;
      }
    });
    if(result) {
      this.choosenFieldsActivity.push(root);
      this.choosenFieldsActivityIds.push(root.id);
    }
    else {
      if(this.choosenFieldsActivityIds.includes(root.id)) {
        this.choosenFieldsActivityIds = this.choosenFieldsActivityIds.filter(el => el != root.id);
      }
      if(this.choosenFieldsActivity.includes(root)) {
        this.choosenFieldsActivity = this.choosenFieldsActivity.filter(el => el.id != root.id);
      }
    }
  }

  public refreshChoosenFieldsActivity(fieldsActivity: FieldActivity[], isReload: boolean) {
    this.choosenFieldsActivity = fieldsActivity;
    this.filterResume = FilterResume.createFilterBasedOnChoosenFiledActivity(fieldsActivity, this.filterResume);
    if(isReload) {
      this.search();
    }
  }

  backupFilterResume(filterResume: FilterResume) {
    this.sessionStorage.set(FilterResume.FILTER_RESUME_PROP, JSON.stringify(filterResume));
  }

  onChangeCity(event) {
    if(this.partCityName != event.target.value) {
      this.partCityName = event.target.value;
      this.refreshCitiesCandidates();
    }
  }

  refreshCitiesCandidates() {
    if(this.partCityName != null && this.partCityName != '') {
      this.geoService.geocodeCitiesByPartOfName(this.partCityName).subscribe((resp: GeoCityResponse) => {
        this.geoCityResponse = resp;
        this.cities = this.geoCityResponse.features.map((feature: GeoCityFeature) => {
          return {
            label: feature.properties.getDisplayName(),
            value: feature.properties
          };
        });
      });
    }
  }

  isAutorizedUser(): boolean {
    return this.authService.LoggedUser.authorities != null;
  }

  clearFilter() {
    this.sessionStorage.remove(FilterResume.FILTER_RESUME_PROP);
    this.filterResume = new FilterResume();
    this.choosenFieldsActivityIds = [];
    this.choosenFieldsActivity = [];
    this.eventRefreshFieldsActivity.emit([]);
  }

  search() {
    if(this.filterResume != null) {
      this.filterResume.pageable.page = 0;
    }

    this.backupFilterResume(this.filterResume);
    this.getFilteredShortResume();
  }

  private notifyAboutSuccessfullyOfferVacancy(vacancyName: string, performerFio: string) {
    this.openDialogNotific(`Вы уведомили пользователя '${performerFio}',
      ожидайте ответа по вакансии '${vacancyName}'`);
  }

  private openDialogNotific(message: string) {
    this.dialog.open(CommonDialogNotificationComponent, {
      width: '850px',
      data: message
    });
  }
}
