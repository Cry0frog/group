import { GeoCityProperty } from './../map/geo/city/geoCityProperty';
import { LocationType } from './../task/properties/map/locationType';
import { Offset } from './../../common/offset';
import { MapCategoryProperty } from './../category/constructor/map/mapCategoryProperty';
import { DateCategoryProperty } from './../category/constructor/date/dateCategoryProperty';
import { BaseCategoryProperty } from './../category/constructor/baseCategoryProperty';
import { Category } from './../category/category';
import { PageableParams } from '../pageable/PageableParams';
import { CategoryPropertyPayoutTypes } from '../category/constructor/categoryPropertyPayoutTypes';
import { SortType } from '../common/sortType';
import { SortTask } from '../task/sortTask';

export class FilterTask {
  public static FILTER_TASK_PROP = 'backup_filter_task';

  constructor() {
    this.choosenCategoryIds = [];
    this.pageable = new PageableParams();
    this.sortType = SortType.DECK;
    this.nameSort = SortTask.DATE;
  }

  filterName: string;
  byCostMore: number;
  byCreatedAtMore: Date;
  byStartDateMore: Date;
  selectedCity: GeoCityProperty;

  onlySafetyPay: boolean;
  onlyFastCategory: boolean;
  onlyStandardPay: boolean;

  onlyMyCity: boolean;
  locationType: LocationType;
  payoutType: CategoryPropertyPayoutTypes;

  pageable: PageableParams;
  sortType: SortType;
  nameSort: string;

  choosenCategoryIds: number[];
  offset: string;

  onlyUsualCategory: boolean;

  //only ui
  isShowDateProp: boolean;
  //isShowOnlyRemote: boolean;
  isShowLocationType: boolean;

  isEmpty() {
    return FilterTask.isEmptyStr(this.filterName)
      && (this.selectedCity == null || this.selectedCity.osm_id == null)
      && this.byCostMore == null
      && this.byCreatedAtMore == null
      && this.byStartDateMore == null
      && this.locationType == null
      && this.payoutType == null
      && !this.onlySafetyPay && !this.onlyFastCategory && !this.onlyStandardPay && !this.onlyUsualCategory
      && (this.choosenCategoryIds == null || this.choosenCategoryIds.length == 0);
  }

  private static isEmptyStr(str): boolean {
    return str == null || str == "";
  }

  prepareBeforeSend() {
    this.offset = Offset.getCurTimeZone();
  }

  static convertToObj(obj: any): FilterTask {
    if(obj == null) {
      return null;
    }
    const filterTask: FilterTask = new FilterTask();
    Object.assign(filterTask, obj);
    if(obj.byCreatedAtMore != null) {
      filterTask.byCreatedAtMore = new Date(Date.parse(obj.byCreatedAtMore));
    }
    if(obj.byStartDateMore != null) {
      filterTask.byStartDateMore = new Date(Date.parse(obj.byStartDateMore));
    }
    return filterTask;
  }

  static createFilterBasedOnChoosenCategory(choosenCategories: Category[], filterTask: FilterTask): FilterTask {
    filterTask.choosenCategoryIds = [];
    choosenCategories.forEach((category: Category) => {
      if(!filterTask.isShowDateProp) {
        filterTask.isShowDateProp = category.properties.some(
          (prop: BaseCategoryProperty) => prop instanceof DateCategoryProperty
        );
      }
      if(!filterTask.isShowLocationType) {
        filterTask.isShowLocationType = category.properties
          .filter((prop: BaseCategoryProperty) => prop instanceof MapCategoryProperty)
          .some((prop: MapCategoryProperty) => prop.showSelectPlaceForService
        );
      }
      filterTask.choosenCategoryIds.push(category.id);
    });
    return filterTask;
  }

}
