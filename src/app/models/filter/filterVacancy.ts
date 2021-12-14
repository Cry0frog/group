import { SortType } from './../common/sortType';
import { FieldActivity } from "../field-activity/fileldActivity";
import { GeoCityProperty } from "../map/geo/city/geoCityProperty";
import { PageableParams } from "../pageable/PageableParams";
import { Offset } from 'src/app/common/offset';
import { ScheduleType } from '../vacancy/scheduleType';
import { EmploymentType } from '../vacancy/employmentType';
import { EducationType } from '../vacancy/educationType';
import { PlaceWorkType } from '../vacancy/placeWorkType';
import { WorkExperienceType } from '../vacancy/workExperienceType';

export class FilterVacancy {
  public static FILTER_VACANCY_PROP = 'backup_filter_vacancy';


  constructor() {
    this.choosenFieldActivityIds = [];
    this.pageable = new PageableParams();
  }

  filterName: string;
  byCostMore: number;
  byCreatedAtMore: Date;
  selectedCity: GeoCityProperty;

  onlyMyCity: boolean;
  pageable: PageableParams;

  sortType: SortType;
  nameSort: string;

  schedule: ScheduleType;
  employment: EmploymentType;
  education: EducationType;
  placeWork: PlaceWorkType;
  workExperience: WorkExperienceType;
  workExperienceValue: number;

  offset: string;

  choosenFieldActivityIds: number[];

  isEmpty() {
    return FilterVacancy.isEmptyStr(this.filterName)
      && (this.selectedCity == null || this.selectedCity.osm_id == null)
      && this.byCostMore == null
      && this.byCreatedAtMore == null
      && this.schedule == null && this.employment == null && this.education == null
      && this.placeWork == null && this.workExperience == null
      && (this.choosenFieldActivityIds == null || this.choosenFieldActivityIds.length == 0);
  }

  prepareBeforeSend() {
    this.offset = Offset.getCurTimeZone();
  }

  private static isEmptyStr(str): boolean {
    return str == null || str == "";
  }

  static convertToObj(obj: any): FilterVacancy {
    if(obj == null) {
      return null;
    }
    const filterVacancy: FilterVacancy = new FilterVacancy();
    Object.assign(filterVacancy, obj);
    return filterVacancy;
  }

  static createFilterBasedOnChoosenFiledActivity(choosenFieldActivities: FieldActivity[], filterVacancy: FilterVacancy): FilterVacancy {
    filterVacancy.choosenFieldActivityIds = [];
    filterVacancy.choosenFieldActivityIds = choosenFieldActivities.map(filed => filed.id);
    return filterVacancy;
  }

}
