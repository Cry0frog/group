import { Category } from './../category/category';
import { Offset } from './../../common/offset';
import { GeoCityProperty } from './../map/geo/city/geoCityProperty';
import { PageableParams } from '../pageable/PageableParams';
import { SortType } from '../common/sortType';
import { SortPerformers } from '../partnerInfo/sortPerformers';

export class FilterPerformer {
  public static FILTER_PERFORMER_PROP = 'backup_filter_performer';

  constructor() {
    this.pageable = new PageableParams();
    this.choosenCategoryIds = [];
    this.minRating = 0;
    this.minCompletedTask = 0;
    this.sortType = SortType.DECK;
    this.nameSort = SortPerformers.AVERAGE_RATING;
  }

  filterName: string;
  choosenCategoryIds: number[];
  selectedCity: GeoCityProperty;
  minRating: number;
  minCompletedTask: number;

  onlyLegalEntity: boolean;
  onlyIndividuals: boolean;
  onlyRecommendedPerformer: boolean;

  pageable: PageableParams;

  offset: string;

  taskId: number;

  sortType: SortType;
  nameSort: string;

  isEmpty() {
    return FilterPerformer.isEmptyStr(this.filterName)
      && (this.selectedCity == null || this.selectedCity.osm_id == null)
      && (this.minRating == null || this.minRating == 0)
      && (this.minCompletedTask == null || this.minCompletedTask == 0)
      && (this.choosenCategoryIds == null || this.choosenCategoryIds.length == 0)
      && (!this.onlyLegalEntity) && (!this.onlyIndividuals) && (!this.onlyRecommendedPerformer);
  }

  private static isEmptyStr(str): boolean {
    return str == null || str == "";
  }

  prepareBeforeSend() {
    this.offset = Offset.getCurTimeZone();
  }

  static convertToObj(obj: any): FilterPerformer {
    if(obj == null) {
      return null;
    }
    const filterPerformer: FilterPerformer = new FilterPerformer();
    Object.assign(filterPerformer, obj);

    return filterPerformer;
  }

  static createFilterBasedOnChoosenCategory(choosenCategories: Category[], filterPerformer: FilterPerformer): FilterPerformer {
    filterPerformer.choosenCategoryIds = [];
    filterPerformer.choosenCategoryIds = choosenCategories.map(el => el.id);

    return filterPerformer;
  }

}
