import { Task } from './../../../../../models/task/task';
import { BreadCrumbDescription } from './../../../../../common/breadCrumbDescription';
import { HINTS } from 'src/app/common/hints.description';
import { ListPerformersComponent } from './../list-performers/list-performers.component';
import { PartnerInfoWithCity } from './../../../../../models/partnerInfo/partnerInfoWithCity';
import { GeoCityFeature } from './../../../../../models/map/geo/city/geoCityFeature';
import { FilterPerformer } from './../../../../../models/filter/filterPerformer';
import { CommonService } from './../../../../../common/services/common.service';
import { AuthService } from 'src/app/auth/auth.service';
import { SessionStorageService } from 'angular-web-storage';
import { GeoService } from './../../../../../services/geo.service';
import { GeoCityResponse } from './../../../../../models/map/geo/city/geoCityResponse';
import { LOCATION_TYPE_MAPPER } from './../../../../../common/category.description';
import { RU_CALENDAR } from './../../../../../common/localization';
import { Category } from './../../../../../models/category/category';
import { Component, OnInit, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { MatDialog } from '@angular/material';
import { MobileTooltipComponent } from '../../../mobile-tooltip/mobile-tooltip.component';
import { SortPerformers } from 'src/app/models/partnerInfo/sortPerformers';
import { SortType } from 'src/app/models/common/sortType';
import { ROLE } from 'src/app/auth/role';

@Component({
  selector: 'app-find-performer',
  templateUrl: './find-performer.component.html',
  styleUrls: ['./find-performer.component.css']
})
export class FindPerformerComponent implements OnInit{
  @ViewChild(ListPerformersComponent, {static: false}) listPerformers: ListPerformersComponent;

  eventRefreshCategories = new EventEmitter<number[]>();
  eventChooseCategoryByTaskCategory = new EventEmitter<number>();
  eventChooseCategory = new EventEmitter<number>();
  eventTransferCity = new EventEmitter<string>();
  eventTransferActiveCategories = new EventEmitter<Category[]>();

  sortMode: SortPerformers;
  sortType: SortType;

  shortPerformers: PartnerInfoWithCity[];
  creatorId: number;
  isLoaded: boolean;
  choosenCategories: Category[];
  rootCategoriesBreadCrumb: Category[];

  isLoadAll: boolean;

  filterPerformer: FilterPerformer;
  ru_calendar = RU_CALENDAR;
  locationTypeMapper = LOCATION_TYPE_MAPPER;

  partCityName: string;
  cities: SelectItem[];
  geoCityResponse: GeoCityResponse;
  categories: Category[];
  choosenCategoryIds: number[];

  taskId: number;
  hintGdRecommends = HINTS.gdRecommends;

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
    this.filterPerformer = new FilterPerformer();
    this.categories = [];
    this.choosenCategoryIds = [];
    this.rootCategoriesBreadCrumb = [];
    this.shortPerformers = [];
  }

  ngOnInit() {
    this.getTaskIdOfCurrentUrl();

    this.creatorId = this.authService.getCurrentId;
    this.getFilteredShortPartnerInfos();
    this.initSort();
  }

  get isMobileMode() {
    return this.authService.isMobileMode();
  }

  getTaskIdOfCurrentUrl() {
    location.pathname.split('/').some(el => {
      if(!isNaN(parseInt(el))) {
        this.taskId = parseInt(el);
      }
    });
  }

  initSort() {
    this.sortMode = this.filterPerformer.nameSort == SortPerformers.AVERAGE_RATING ? SortPerformers.AVERAGE_RATING : SortPerformers.COMPLETED_TASKS;
    this.sortType = this.filterPerformer.sortType;
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


  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = !this.isMobileMode ? document.documentElement.scrollHeight - 1 : document.documentElement.scrollHeight - 100;
    if(pos >= max && !this.isLoadAll) {
      this.handleLoadMorePerformers();
    }
    this.isLoadAll = false;
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

  backupFilterPerformer(filterPerformer: FilterPerformer) {
    this.sessionStorage.set(FilterPerformer.FILTER_PERFORMER_PROP,
      JSON.stringify(filterPerformer)
    );
  }

  clearFilter() {
    this.sessionStorage.remove(BreadCrumbDescription.SEL_SELECTED_CITY_PERFORMERS);
    this.sessionStorage.remove(BreadCrumbDescription.SEL_ACTIVE_CATEGORIES_PERFORMERS);
    this.sessionStorage.remove(FilterPerformer.FILTER_PERFORMER_PROP);
    this.filterPerformer.pageable.page = 0;
    this.filterPerformer = new FilterPerformer();
    this.choosenCategoryIds = [];
    this.choosenCategories = [];
    this.rootCategoriesBreadCrumb = [];
    this.eventRefreshCategories.emit([]);
    this.eventTransferCity.emit("Все города");
    this.eventTransferActiveCategories.emit(this.rootCategoriesBreadCrumb);
  }

  clearIconActiveCategory() {
    this.choosenCategoryIds = [];
    this.rootCategoriesBreadCrumb = [];
    this.eventRefreshCategories.emit([]);
  }

  search() {
    if(this.filterPerformer != null) {
      if (this.filterPerformer.selectedCity != null) {
        this.eventTransferCity.emit(this.filterPerformer.selectedCity.name);
      }
      else {
        this.eventTransferCity.emit("Все города");
      }
      this.filterPerformer.pageable.page = 0;
      this.filterPerformer.sortType = SortType.DECK;
      this.filterPerformer.nameSort = SortPerformers.AVERAGE_RATING;
    }
    this.backupFilterPerformer(this.filterPerformer);
    this.getFilteredShortPartnerInfos();
  }

  getFilteredShortPartnerInfos() {
    this.commonService.getAllShortInfoPerformers(this.filterPerformer, this.taskId).subscribe((data: PartnerInfoWithCity[]) => {
      if(data == null) {
        return;
      }

      this.initSort();
      const members = data.filter(member => member.roles.includes(ROLE.MEMBER_ANOTHER) || member.roles.includes(ROLE.MEMBER_PERFORMER) || member.roles.includes(ROLE.MEMBER_STORE));
      const performers = data.filter(performer => !members.find(member => member.idPartner===performer.idPartner));

      this.shortPerformers = [];

      if(members.length != 0) {
        this.shortPerformers = this.shortPerformers.concat(this.applyFilter(members))
      }

      this.shortPerformers = this.shortPerformers.concat(this.applyFilter(performers));
    });
  }

  handleLoadMorePerformers() {
    this.filterPerformer.pageable.page++;
    this.commonService.getAllShortInfoPerformers(this.filterPerformer, this.taskId).subscribe((data: PartnerInfoWithCity[]) => {
      if(data.length == 0) {
        this.isLoadAll = true;
        return;
      }

      data = this.applyFilter(data);
      this.listPerformers.addLoadedMoreShortPerformers(data);
    });
  }

  handleChooseCategoryByTaskCategory(task: Task) {
    this.filterPerformer.choosenCategoryIds = [task.category.id];
    this.filterPerformer.selectedCity = task.city;
    this.eventChooseCategoryByTaskCategory.emit(task.category.id);
  }

  public refreshChoosenCategories(categories: Category[], isReload: boolean) {
    this.choosenCategories = categories;
    this.filterPerformer = FilterPerformer.createFilterBasedOnChoosenCategory(this.choosenCategories, this.filterPerformer);
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

  applyFilter(data): PartnerInfoWithCity[] {
    if(this.sortMode == SortPerformers.AVERAGE_RATING && this.sortType == SortType.DECK) {
      return PartnerInfoWithCity.sortByRatingDesc(data);
    }
    else if(this.sortMode == SortPerformers.AVERAGE_RATING && this.sortType == SortType.ASK) {
      return PartnerInfoWithCity.sortByRatingAsc(data);
    }
    else if(this.sortMode == SortPerformers.COMPLETED_TASKS && this.sortType == SortType.DECK) {
      return PartnerInfoWithCity.sortByNumberOfTasksdDesc(data);
    }
    else if(this.sortMode == SortPerformers.COMPLETED_TASKS && this.sortType == SortType.ASK) {
      return PartnerInfoWithCity.sortByNumberOfTasksdAsc(data);
    }
  }

  isDescType(): boolean {
    return this.sortType == SortType.DECK;
  }

  isRatingSortMode(): boolean {
    return this.sortMode == SortPerformers.AVERAGE_RATING;
  }

  isNumberOfTasksSortMode(): boolean {
    return this.sortMode == SortPerformers.COMPLETED_TASKS;
  }

  changeSort(sortBy) {
    this.filterPerformer.pageable.page = 0;
    if(sortBy == SortPerformers.AVERAGE_RATING) {
      if(this.sortMode == SortPerformers.AVERAGE_RATING) {
        this.applyTypeSort();
      }
      else {
        this.filterPerformer.sortType = SortType.DECK;
        this.filterPerformer.nameSort = SortPerformers.AVERAGE_RATING;
      }
    }
    else if(sortBy == SortPerformers.COMPLETED_TASKS) {
      if(this.sortMode == SortPerformers.COMPLETED_TASKS) {
        this.applyTypeSort();
      }
      else {
        this.filterPerformer.sortType = SortType.DECK;
        this.filterPerformer.nameSort = SortPerformers.COMPLETED_TASKS;
      }
    }

    this.getFilteredShortPartnerInfos();
  }

  applyTypeSort() {
    this.filterPerformer.sortType = this.sortType == SortType.ASK ? SortType.DECK : SortType.ASK;
  }
}
