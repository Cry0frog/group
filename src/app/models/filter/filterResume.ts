import { ScheduleType } from './../vacancy/scheduleType';
import { Offset } from "src/app/common/offset";
import { SortType } from "../common/sortType";
import { FieldActivity } from "../field-activity/fileldActivity";
import { GeoCityProperty } from "../map/geo/city/geoCityProperty";
import { PageableParams } from "../pageable/PageableParams";
import { EmploymentType } from '../vacancy/employmentType';
import { EducationType } from '../vacancy/educationType';
import { PlaceWorkType } from '../vacancy/placeWorkType';

export class FilterResume {
  public static FILTER_RESUME_PROP = 'backup_filter_resume';

  constructor() {
    this.choosenFieldActivityIds = [];
    this.schedules = [];
    this.employments = [];
    this.placeWorks = [];
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

  offset: string;

  schedules: ScheduleType[];
  employments: EmploymentType[];
  placeWorks: PlaceWorkType[];
  education: EducationType;
  businessTrips: boolean;
  moving: boolean;

  choosenFieldActivityIds: number[];

  isEmpty() {
    return FilterResume.isEmptyStr(this.filterName)
      && (this.selectedCity == null || this.selectedCity.osm_id == null)
      && this.byCostMore == null && this.byCreatedAtMore == null
      && this.education == null
      && !this.businessTrips && !this.moving
      && (this.placeWorks == null || this.placeWorks.length == 0)
      && (this.employments == null || this.employments.length == 0)
      && (this.schedules == null || this.schedules.length == 0)
      && (this.choosenFieldActivityIds == null || this.choosenFieldActivityIds.length == 0);
  }

  prepareBeforeSend() {
    this.offset = Offset.getCurTimeZone();
  }

  private static isEmptyStr(str): boolean {
    return str == null || str == "";
  }

  static convertToObj(obj: any): FilterResume {
    if(obj == null) {
      return null;
    }
    const filter: FilterResume = new FilterResume();
    Object.assign(filter, obj);
    return filter;
  }

  static createFilterBasedOnChoosenFiledActivity(choosenFieldActivities: FieldActivity[], filterResume: FilterResume): FilterResume {
    filterResume.choosenFieldActivityIds = [];
    filterResume.choosenFieldActivityIds = choosenFieldActivities.map(filed => filed.id);
    return filterResume;
  }
}
