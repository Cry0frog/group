import { ActiveUrls } from 'src/app/auth/activeUrls';
import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { BreadCrumbDescription } from './../../../../common/breadCrumbDescription';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Category } from 'src/app/models/category/category';
import { FindTaskComponent } from './find-task/find-task.component';
import { CommonService } from '../../../../common/services/common.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PlaceAdvertising } from 'src/app/models/advertising/common/placeAdvertising';
import { SessionStorageService } from 'angular-web-storage';
import { DisplayAdvertisingComponent } from '../../display-advertising/display-advertising.component';
import { FilterTask } from 'src/app/models/filter/filterTask';
import { CustomerInfo } from 'src/app/models/task/customerInfo';

@Component({
  selector: 'app-find-task-page',
  templateUrl: './find-task-page.component.html',
  styleUrls: ['./find-task-page.component.css']
})

export class FindTaskPageComponent implements OnInit {

  @ViewChild(DisplayAdvertisingComponent, {static: false}) displayAdvertising: DisplayAdvertisingComponent;

  findTaskComponent: FindTaskComponent;

  categories: Category[];
  choosenCategories: Category[];
  rootCategoriesBreadCrumb: Category[];
  choosenCategoryIds: number[];
  place: PlaceAdvertising;
  selectedCity: string;
  taskSelectionName: string;
  pageURLId: number;
  customerInfo: CustomerInfo;

  constructor(private commonService: CommonService,
    private partnerService: PartnerService,
    private sessionStorage: SessionStorageService,
    private activeRoute: ActivatedRoute,
    private router: Router) {
      this.choosenCategories = [];
      this.categories = [];
      this.choosenCategoryIds = [];
      this.place = PlaceAdvertising.FIND_TASK;
      this.rootCategoriesBreadCrumb = [];
      this.selectedCity = "Все города";
      this.taskSelectionName = "";
      this.customerInfo = new CustomerInfo();
  }

  ngOnInit() {
    this.pageURLId = this.parseTaskIdFromCurrentUrl(window.location.pathname);
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd && event.url == `/${ActiveUrls.FIND_TASK}`) {
        this.pageURLId = this.parseTaskIdFromCurrentUrl(event.url);
        if(this.sessionStorage.get(BreadCrumbDescription.SEL_SELECTED_CITY_TASKS) != null) {
          this.selectedCity = this.sessionStorage.get(BreadCrumbDescription.SEL_SELECTED_CITY_TASKS);
        } else {
          this.selectedCity = "Все города"
        }
        const activeCategories = this.sessionStorage.get(BreadCrumbDescription.SEL_ACTIVE_CATEGORIES_TASKS);
        if (activeCategories != null && activeCategories != "") {
          this.rootCategoriesBreadCrumb = JSON.parse(activeCategories);
        } else {
          this.rootCategoriesBreadCrumb = [];
        }
        if(this.sessionStorage.get(BreadCrumbDescription.SEL_SELECTED_TASKS) != null) {
          this.sessionStorage.remove(BreadCrumbDescription.SEL_SELECTED_TASKS);
        }
        this.taskSelectionName = "";
      }
    });

    if(!this.isNanTaskId()) {
      this.loadCustomerInfo();
    }

    this.commonService.getAllCategories().subscribe((data: Category[]) => {
      this.categories = data;

      Promise.resolve(null).then(_ => this.displayChoosenCategories(this.choosenCategoryIds));
      this.initinalFindTaskComponent(data, 5);

      const params = this.activeRoute.snapshot.queryParams.name;
      if(params) {
        const cat = this.categories.filter(cat => cat.name == params)[0];
        if(cat) {
          this.toggleCategory(cat);
        }
      }
    });
    this.initialBreadCrumb();
  }

  isNanTaskId(): boolean {
    return isNaN(this.pageURLId);
  }

  parseTaskIdFromCurrentUrl(url) {
    return parseInt(url.substring(url.lastIndexOf('/') + 1))
  }

  loadCustomerInfo() {
    this.partnerService.getMyPerformTaskCreatorInfo(this.pageURLId).subscribe((customerInfo: CustomerInfo) => {
      this.customerInfo = customerInfo;
    });
  }

  initialBreadCrumb() {
    if(this.sessionStorage.get(BreadCrumbDescription.SEL_SELECTED_CITY_TASKS) != null) {
      this.selectedCity = this.sessionStorage.get(BreadCrumbDescription.SEL_SELECTED_CITY_TASKS);
      if (this.isNanTaskId()) {
        this.sessionStorage.remove(BreadCrumbDescription.SEL_SELECTED_CITY_TASKS);
      }
    }
    const activeCategories = this.sessionStorage.get(BreadCrumbDescription.SEL_ACTIVE_CATEGORIES_TASKS);
    if (activeCategories != null && activeCategories != "") {
      this.rootCategoriesBreadCrumb = JSON.parse(activeCategories);
    }
    if(this.sessionStorage.get(BreadCrumbDescription.SEL_SELECTED_TASKS) != null) {
      this.taskSelectionName = this.sessionStorage.get(BreadCrumbDescription.SEL_SELECTED_TASKS);
      if (this.isNanTaskId()) {
        this.sessionStorage.remove(BreadCrumbDescription.SEL_SELECTED_TASKS);
        this.taskSelectionName = "";
      }
    }
  }

  initinalFindTaskComponent(data, i) {
    if(this.findTaskComponent) {
      this.findTaskComponent.categories = data;
      this.findTaskComponent.filterTask = this.restoreFilterTask();
      this.handleRefreshCategories(this.findTaskComponent.filterTask.choosenCategoryIds);
      if(this.findTaskComponent.filterTask.selectedCity != null) {
        this.findTaskComponent.partCityName = this.findTaskComponent.filterTask.selectedCity.name;
        this.findTaskComponent.refreshCitiesCandidates();
      }
    }
    else {
      setTimeout(() => this.initinalFindTaskComponent(data, --i), 200);
    }
  }

  restoreFilterTask(): FilterTask {
    const savedFilterTask = this.sessionStorage.get(FilterTask.FILTER_TASK_PROP);
    let filterTask: FilterTask;
    if(savedFilterTask != null && savedFilterTask != '') {
      this.sessionStorage.remove(FilterTask.FILTER_TASK_PROP);
      filterTask = FilterTask.convertToObj(JSON.parse(savedFilterTask));
    }
    else {
      filterTask = FilterTask.createFilterBasedOnChoosenCategory(this.choosenCategories, new FilterTask());
    }

    filterTask.pageable.page = 0;
    return filterTask;
  }

  onRouterOutletActivate(event) {

    if(event instanceof FindTaskComponent) {
      this.findTaskComponent = event;

      this.findTaskComponent.eventRefreshCategories.subscribe(
        (ids: number[]) => this.handleRefreshCategories(ids)
      );

      this.findTaskComponent.eventChooseCategory.subscribe(
        (choosenCategoryId: number) => this.displayAdvertising.chooseCategoryHandler(choosenCategoryId)
      );

      this.findTaskComponent.eventTransferCity.subscribe(
        (selectedСity: string) => {
          this.selectedCity = selectedСity;
          this.sessionStorage.set(BreadCrumbDescription.SEL_SELECTED_CITY_TASKS, this.selectedCity);
      });

      this.findTaskComponent.eventTransferActiveCategories.subscribe(
        (activeCategories: Category[]) => {
          this.rootCategoriesBreadCrumb = activeCategories;
          this.sessionStorage.set(BreadCrumbDescription.SEL_ACTIVE_CATEGORIES_TASKS, JSON.stringify(this.rootCategoriesBreadCrumb));
      });

      this.findTaskComponent.eventTaskSelectionName.subscribe(
        (taskSelectionName: string) => {
          this.sessionStorage.set(BreadCrumbDescription.SEL_SELECTED_TASKS, taskSelectionName);
      });
    }
    else {
      this.findTaskComponent = null;
    }
  }

  getSortedById(categories: Category[]): Category[] {
    return Category.getSortedById(categories);
  }

  handleRefreshCategories(ids: number[]) {
    this.choosenCategoryIds = ids;
    this.displayChoosenCategories(ids);
    this.refreshChoosenCategories(true);
  }

  displayChoosenCategories(ids: number[]) {
    if(ids.length == 0) {
      this.choosenCategories = [];
    }

    this.categories.forEach(cat => {
      if(ids.includes(cat.id)) {
        this.choosenCategories.push(cat);
      }

      if(cat.children != null && cat.children.length != 0) {
        this.choosenCategories = this.choosenCategories.concat(cat.children.filter(child => ids.includes(child.id)));
      }
    });
  }

  toggleCategory(category: Category) {
    if(this.findTaskComponent == null) {
      return;
    }

    this.findTaskComponent.toggleCategory(category, true, false);
    this.choosenCategories = this.findTaskComponent.choosenCategories;
    this.choosenCategoryIds = this.findTaskComponent.choosenCategoryIds;
  }

  refreshChoosenCategories(isReload: boolean) {
    if(this.findTaskComponent != null) {
      this.findTaskComponent.refreshChoosenCategories(this.choosenCategories, isReload);
    }
  }

  deleteCategories() {
    if (isNaN(this.pageURLId)) {
      this.rootCategoriesBreadCrumb = [];
      this.findTaskComponent.clearIconActiveCategory();
    }
    else {
      this.sessionStorage.remove(BreadCrumbDescription.SEL_ACTIVE_CATEGORIES_TASKS);
      const savedFilterTask = this.sessionStorage.get(FilterTask.FILTER_TASK_PROP);
      let filterTask: FilterTask;
      if(savedFilterTask != null && savedFilterTask != '') {
        filterTask = FilterTask.convertToObj(JSON.parse(savedFilterTask));
        filterTask.choosenCategoryIds = [];
        this.sessionStorage.set(FilterTask.FILTER_TASK_PROP, JSON.stringify(filterTask));
      }
      this.goToPageFindTask();
    }
  }

  removeAllFilters() {
    if (this.isNanTaskId()) {
      this.findTaskComponent.clearFilter();
    }
    else {
      this.sessionStorage.remove(BreadCrumbDescription.SEL_SELECTED_CITY_TASKS);
      this.sessionStorage.remove(BreadCrumbDescription.SEL_ACTIVE_CATEGORIES_TASKS);
      this.sessionStorage.remove(BreadCrumbDescription.SEL_SELECTED_TASKS);
      this.sessionStorage.remove(FilterTask.FILTER_TASK_PROP);
      this.goToPageFindTask();
    }
  }

  isEmptyRootCategoriesBreadCrumb(): boolean {
    return this.rootCategoriesBreadCrumb.length == 0;
  }

  getCategoriesNames(): string {
    let categoriesNames: string = '';
    this.rootCategoriesBreadCrumb.forEach(el => {
      categoriesNames = this.rootCategoriesBreadCrumb[this.rootCategoriesBreadCrumb.length - 1].id != el.id ?
        categoriesNames + " " + el.name + "," :
        categoriesNames + " " + el.name;
        if (categoriesNames.length > 65) {
          categoriesNames = categoriesNames.substr(0, 65) + '...';
        }
    });
    if (!this.isNanTaskId()) {
      categoriesNames += "/";
    }
    return categoriesNames;
  }

  taskActiveWhenClickedByUser() : boolean {
    return this.taskSelectionName == "" || this.taskSelectionName == null;
  }

  goToPageFindTask() {
    this.router.navigateByUrl(ActiveUrls.FIND_TASK);
  }

  isNotEmptyCategoriesNames(): boolean {
    return this.getCategoriesNames().length != 0
  }

}
