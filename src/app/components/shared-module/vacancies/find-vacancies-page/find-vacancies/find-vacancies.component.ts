import { IScheduleType, IEmploymentType, IEducationType, IPlaceWorkType, IWorkExperienceType } from './../../../common/jobModule.discription';
import { VacancyComponentMode } from './../../vacancy/vacancyComponentMode';
import { AuthService } from './../../../../../auth/auth.service';
import { ShortVacancy } from 'src/app/models/vacancy/shortVacancy';
import { FilterVacancy } from '../../../../../models/filter/filterVacancy';
import { CommonService } from 'src/app/common/services/common.service';
import { Component, EventEmitter, HostListener, OnInit, ViewChild } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';
import { FieldActivity } from 'src/app/models/field-activity/fileldActivity';
import { RU_CALENDAR } from './../../../../../common/localization';
import { ListVacanciesComponent } from '../../list-vacancies/list-vacancies.component';
import { GeoService } from 'src/app/services/geo.service';
import { GeoCityResponse } from 'src/app/models/map/geo/city/geoCityResponse';
import { GeoCityFeature } from 'src/app/models/map/geo/city/geoCityFeature';
import { SelectItem } from 'primeng/api';
import { EDUCATION_TYPE, WORK_EXPERIENCE_TYPE, PLACE_WORK_TYPE,
  SCHEDULE_TYPE, EMPLOYMENT_TYPE } from '../../../common/jobModule.discription';
import { WorkExperienceType } from 'src/app/models/vacancy/workExperienceType';

@Component({
  selector: 'app-find-vacancies',
  templateUrl: './find-vacancies.component.html',
  styleUrls: ['./find-vacancies.component.css']
})
export class FindVacanciesComponent implements OnInit {
  @ViewChild(ListVacanciesComponent, {static: false}) listVacancies: ListVacanciesComponent;

  ru_calendar = RU_CALENDAR;

  educationTypes = EDUCATION_TYPE;
  workExperienceTypes = WORK_EXPERIENCE_TYPE;
  placeWorkTypes = PLACE_WORK_TYPE;
  scheduleTypes = SCHEDULE_TYPE;
  employmentTypes = EMPLOYMENT_TYPE;

  shortVacancies: ShortVacancy[];
  fieldsActivity: FieldActivity[];
  filterVacancy: FilterVacancy;
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
  workExperienceItems: SelectItem[];

  eventRefreshFieldsActivity = new EventEmitter<number[]>();

  constructor(private authService: AuthService,
    private geoService: GeoService,
    private sessionStorage: SessionStorageService,
    private commonService: CommonService) {
    this.shortVacancies = [];
    this.fieldsActivity = [];
    this.choosenFieldsActivityIds = [];
    this.choosenFieldsActivity = [];
    this.filterVacancy = new FilterVacancy();

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

    this.workExperienceItems = this.workExperienceTypes.map((el: IWorkExperienceType) => {
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
    this.getFilteredShortVacancies();
  }

  get getVacancyMode() {
    return VacancyComponentMode.COMMON;
  }

  getFilteredShortVacancies() {
    this.commonService.getAllShortVacancy(this.filterVacancy).subscribe(data => {
      this.shortVacancies = ShortVacancy.sortByCreatedAt(data);
    });
  }

  isRequiredWorkExperience(): boolean {
    return this.filterVacancy.workExperience == WorkExperienceType.REQUIRED;
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
    this.filterVacancy.pageable.page++;
    this.commonService.getAllShortVacancy(this.filterVacancy).subscribe((data: ShortVacancy[]) => {
      if(data.length == 0) {
        this.isLoadAll = true;
        return;
      }

      this.shortVacancies = this.shortVacancies.concat(ShortVacancy.sortByCreatedAt(data));

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
    this.filterVacancy = FilterVacancy.createFilterBasedOnChoosenFiledActivity(fieldsActivity, this.filterVacancy);
    if(isReload) {
      this.search();
    }
  }

  backupFilterVacancy(filterTask: FilterVacancy) {
    this.sessionStorage.set(FilterVacancy.FILTER_VACANCY_PROP, JSON.stringify(filterTask));
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
    this.sessionStorage.remove(FilterVacancy.FILTER_VACANCY_PROP);
    this.filterVacancy = new FilterVacancy();
    this.choosenFieldsActivityIds = [];
    this.choosenFieldsActivity = [];
    this.eventRefreshFieldsActivity.emit([]);
  }

  search() {
    if(this.filterVacancy != null) {
      this.filterVacancy.pageable.page = 0;
    }

    this.backupFilterVacancy(this.filterVacancy);
    this.getFilteredShortVacancies();
  }


}
