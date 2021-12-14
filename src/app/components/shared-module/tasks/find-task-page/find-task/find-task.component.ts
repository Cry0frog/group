import { BreadCrumbDescription } from './../../../../../common/breadCrumbDescription';
import { FilterTask } from 'src/app/models/filter/filterTask';
import { GeoCityFeature } from './../../../../../models/map/geo/city/geoCityFeature';
import { GeoService } from './../../../../../services/geo.service';
import { GeoCityResponse } from './../../../../../models/map/geo/city/geoCityResponse';
import { SessionStorageService } from 'angular-web-storage';
import { ILocationTypeMapper, LOCATION_TYPE_MAPPER } from './../../../../../common/category.description';
import { Category } from './../../../../../models/category/category';
import { RU_CALENDAR } from './../../../../../common/localization';
import { TaskComponentMode } from './../../task/taskComponentMode';
import { AuthService } from '../../../../../auth/auth.service';
import { CommonService } from '../../../../../common/services/common.service';
import { ShortTask } from '../../../../../models/task/shortTask';
import { Component, OnInit, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { ListTasksComponent } from 'src/app/components/partner/components/common/list-tasks/list-tasks.component';
import { REGULAR_CATEGORY_PROPERTY_PAYOUT_TYPES_MAPPER } from '../../../../../common/category.description';
import { SortTask } from 'src/app/models/task/sortTask';
import { SortType } from 'src/app/models/common/sortType';
import { HINTS } from 'src/app/common/hints.description';
import { MobileTooltipComponent } from '../../../mobile-tooltip/mobile-tooltip.component';
import { MatDialog } from '@angular/material';
import { HistoryTasksComponent } from '../../history-tasks/history-tasks.component';

@Component({
  selector: 'app-find-task',
  templateUrl: './find-task.component.html',
  styleUrls: ['./find-task.component.css']
})
export class FindTaskComponent implements OnInit {
  @ViewChild(ListTasksComponent, {static: false}) listTasks: ListTasksComponent;

  taskSelectionName: string;

  eventRefreshCategories = new EventEmitter<number[]>();
  eventChooseCategory = new EventEmitter<number>();
  eventTransferCity = new EventEmitter<string>();
  eventTransferActiveCategories = new EventEmitter<Category[]>();
  eventTaskSelectionName = new EventEmitter<string>();

  categories: Category[];

  hintSecurePay = HINTS.securePay;
  hintUsualPay = HINTS.usualPay;

  usualCategory = HINTS.usualCategory;
  fastCategory = HINTS.fastCategory;

  taskInfos: ShortTask[];
  creatorId: number;
  isLoaded: boolean;
  choosenCategories: Category[];

  rootCategoriesBreadCrumb: Category[];

  sortMode: SortTask;
  sortType: SortType;

  filterTask: FilterTask;
  ru_calendar = RU_CALENDAR;
  locationTypeMapper = LOCATION_TYPE_MAPPER;
  regularCategoryPropertyPayoutTypes = REGULAR_CATEGORY_PROPERTY_PAYOUT_TYPES_MAPPER;

  isLoadAll: boolean;

  partCityName: string;
  cities: SelectItem[];
  geoCityResponse: GeoCityResponse;

  choosenCategoryIds: number[];
  locations: SelectItem[];


  constructor(private commonService: CommonService,
    private authService: AuthService,
    private sessionStorage: SessionStorageService,
    private geoService: GeoService,
    public dialog: MatDialog
  ) {
    this.isLoaded = true;
    this.choosenCategories = [];
    this.isLoadAll = false;
    this.cities = [];
    this.geoCityResponse = null;
    this.categories = [];
    this.choosenCategoryIds = [];
    this.rootCategoriesBreadCrumb = [];
    this.filterTask = new FilterTask();
    this.locations = [];
  }

  ngOnInit() {
    this.creatorId = this.authService.getCurrentId;
    this.initSort();
    this.getFilteredShortTasks();

    this.locations = this.locationTypeMapper.map((el: ILocationTypeMapper) => {
      return {
        label: el.viewValue,
        value: el.value
      }
    });

  }

  get isMobileMode() {
    return this.authService.isMobileMode();
  }


  initSort() {
    this.sortMode = this.filterTask.nameSort == SortTask.DATE ? SortTask.DATE : SortTask.PRICE;
    this.sortType = this.filterTask.sortType;
  }

  getTooltipMobile(text: string) {
    if(!this.isMobileMode) {
      return;
    }

    this.dialog.open(MobileTooltipComponent, {
      width: '250px',
      maxHeight: '500px',
      data: text,
      backdropClass: 'backdropBackground',
      panelClass: 'panel_class_mob_tooltip'
    });
  }

  applyFilter(data): ShortTask[] {
    if(this.sortMode == SortTask.DATE && this.sortType == SortType.DECK) {
      return ShortTask.sortByDateDesc(data);
    }
    else if(this.sortMode == SortTask.DATE && this.sortType == SortType.ASK) {
      return ShortTask.sortByDateAsc(data);
    }
    else if(this.sortMode == SortTask.PRICE && this.sortType == SortType.DECK) {
      return ShortTask.sortByMoneyTopBorderdDesc(data);
    }
    else if(this.sortMode == SortTask.PRICE && this.sortType == SortType.ASK) {
      return ShortTask.sortByMoneyTopBorderdAsc(data);
    }
  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = !this.isMobileMode ? document.documentElement.scrollHeight - 1 : document.documentElement.scrollHeight - 100;
    if(pos >= max && !this.isLoadAll) {
      this.handleLoadMoreTasks();
    }
    this.isLoadAll = false;
  }

  handleLoadMoreTasks() {
    this.filterTask.pageable.page++;
    this.commonService.getAllShortInfoTasks(this.filterTask).subscribe((data: ShortTask[]) => {
      if(data.length == 0) {
        this.isLoadAll = true;
        return;
      }

      data = this.applyFilter(data);
      this.listTasks.addLoadedMoreShortTasks(data, this.filterTask.pageable.size);
    });
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

  dischargePayoutTypes() {
    if(!this.filterTask.onlyStandardPay) {
      this.filterTask.payoutType = null;
    }
  }

  backupFilterTask(filterTask: FilterTask) {
    this.sessionStorage.set(FilterTask.FILTER_TASK_PROP, JSON.stringify(filterTask));
  }

  getFilteredShortTasks() {

    this.commonService.getAllShortInfoTasks(this.filterTask).subscribe((data: ShortTask[]) => {
      if(data == null) {
        return;
      }

      this.initSort();
      this.taskInfos = this.applyFilter(data);
    });
  }

  isAutorizedUser(): boolean {
    return this.authService.LoggedUser.authorities != null;
  }

  clearFilter() {
    this.rootCategoriesBreadCrumb = [];
    this.sessionStorage.remove(BreadCrumbDescription.SEL_SELECTED_CITY_TASKS);
    this.sessionStorage.remove(BreadCrumbDescription.SEL_ACTIVE_CATEGORIES_TASKS);
    this.sessionStorage.remove(BreadCrumbDescription.SEL_SELECTED_TASKS);
    this.sessionStorage.remove(FilterTask.FILTER_TASK_PROP);
    this.filterTask = new FilterTask();
    this.choosenCategoryIds = [];
    this.choosenCategories = [];
    this.eventRefreshCategories.emit([]);
    this.eventTransferCity.emit("Все города");
    this.eventTransferActiveCategories.emit(this.rootCategoriesBreadCrumb);
    this.eventTaskSelectionName.emit("");
  }

  clearIconActiveCategory() {
    this.choosenCategoryIds = [];
    this.choosenCategories = [];
    this.rootCategoriesBreadCrumb = [];
    this.eventRefreshCategories.emit([]);
  }

  search() {
    if(this.filterTask != null) {
      if (this.filterTask.selectedCity != null) {
        this.eventTransferCity.emit(this.filterTask.selectedCity.name);
      }
      else {
        this.eventTransferCity.emit("Все города");
      }

      this.filterTask.pageable.page = 0;
      this.filterTask.sortType = SortType.DECK;
      this.filterTask.nameSort = SortTask.DATE;
    }

    this.backupFilterTask(this.filterTask);
    this.getFilteredShortTasks();
  }

  getTaskMode() {
    return TaskComponentMode.COMMON;
  }

  isDateSortMode(): boolean {
    return this.sortMode == SortTask.DATE;
  }

  isPriceSortMode(): boolean {
    return this.sortMode == SortTask.PRICE;
  }

  isDescType(): boolean {
    return this.sortType == SortType.DECK;
  }

  changeSort(sortBy) {
    this.filterTask.pageable.page = 0;
    if(sortBy == SortTask.DATE) {
      if(this.sortMode == SortTask.DATE) {
        this.applyTypeSort();
      }
      else {
        this.filterTask.sortType = SortType.DECK;
        this.filterTask.nameSort = SortTask.DATE;
      }
    }
    else if(sortBy == SortTask.PRICE) {
      if(this.sortMode == SortTask.PRICE) {
        this.applyTypeSort();
      }
      else {
        this.filterTask.sortType = SortType.DECK;
        this.filterTask.nameSort = SortTask.PRICE;
      }
    }

    this.getFilteredShortTasks();
  }

  applyTypeSort() {
    this.filterTask.sortType = this.sortType == SortType.ASK ? SortType.DECK : SortType.ASK;
  }

  public refreshChoosenCategories(categories: Category[], isReload: boolean) {
    this.choosenCategories = categories;
    this.filterTask = FilterTask.createFilterBasedOnChoosenCategory(this.choosenCategories, this.filterTask);
    if(isReload) {
      this.search();
    }
  }

  toggleCategoryHandler(category) {
    this.toggleCategory(category, true, false);
  }

  toggleCategory(category: Category, isNotRoot: boolean, isRemove: boolean) {
    const choosen = this.choosenCategories.filter(el => el.id != category.id);

    if(isRemove || choosen.length != this.choosenCategories.length) {

      if (isNotRoot) {
        this.rootCategoriesBreadCrumb = this.rootCategoriesBreadCrumb.filter(el => el.id != category.id);
      }

      this.choosenCategories = choosen;
      this.choosenCategoryIds = this.choosenCategoryIds.filter(id => id != category.id);
      isRemove = true;
    }
    else {
      this.choosenCategories.push(category);
      this.choosenCategoryIds.push(category.id);
      if (isNotRoot) {
        this.rootCategoriesBreadCrumb.push(category);
      }
      isRemove = false;
    }

    this.eventTransferActiveCategories.emit(this.rootCategoriesBreadCrumb);

    if(category.children != null) {
      this.eventChooseCategory.emit(category.id);
      category.children.forEach(child => this.toggleCategory(child, false, isRemove));
    }
    else {
      this.isChooseAllChild(category);
      this.eventChooseCategory.emit(category.root.id);
    }

    if(isNotRoot) {
      this.refreshChoosenCategories(this.choosenCategories, true);
    }
  }

  isChooseAllChild(category: Category) {
    const root =  this.categories.find(el => el.id == category.root.id);

    if(root == null) {
      return;
    }

    let result = true;
    const childrenIds: number[] = root.children.map(el => el.id);
    childrenIds.forEach(el => {
      if(!this.choosenCategoryIds.includes(el)) {
        result = false;
      }
    });
    if(result) {
      this.choosenCategories.push(root);
      this.choosenCategoryIds.push(root.id);
    }
    else {
      if(this.choosenCategoryIds.includes(root.id)) {
        this.choosenCategoryIds = this.choosenCategoryIds.filter(el => el != root.id);
      }
      if(this.choosenCategories.includes(root)) {
        this.choosenCategories = this.choosenCategories.filter(el => el.id != root.id);
      }
    }
  }

  taskSelectionEvent(taskSelectionName: string) {
    this.eventTaskSelectionName.emit(taskSelectionName);
  }

  openHistoryTasks() {
    const newFilter = new FilterTask();
    Object.assign(newFilter, this.filterTask);
    this.dialog.open( HistoryTasksComponent, {
      width: '700px',
      data: newFilter
    });
  }
}
