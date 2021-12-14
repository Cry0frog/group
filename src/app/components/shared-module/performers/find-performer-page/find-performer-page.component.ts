import { BreadCrumbDescription } from './../../../../common/breadCrumbDescription';
import { CommonService } from './../../../../common/services/common.service';
import { Category } from './../../../../models/category/category';
import { FindPerformerComponent } from './find-performer/find-performer.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DisplayAdvertisingComponent } from '../../display-advertising/display-advertising.component';
import { PlaceAdvertising } from 'src/app/models/advertising/common/placeAdvertising';
import { SessionStorageService } from 'angular-web-storage';
import { FilterPerformer } from 'src/app/models/filter/filterPerformer';

@Component({
  selector: 'app-find-performer-page',
  templateUrl: './find-performer-page.component.html',
  styleUrls: ['./find-performer-page.component.css']
})
//TODO merge with FindTaskPage
export class FindPerformerPageComponent implements OnInit {

  @ViewChild(DisplayAdvertisingComponent, {static: false}) displayAdvertising: DisplayAdvertisingComponent;

  findPerformerComponent: FindPerformerComponent;
  categories: Category[];
  choosenCategories: Category[];
  rootCategoriesBreadCrumb: Category[];
  choosenCategoryIds: number[];
  place: PlaceAdvertising;
  selectedCity: string;
  categoryRootConstruction: Category;

  constructor(private commonService: CommonService,
    private sessionStorage: SessionStorageService) {
    this.choosenCategories = [];
    this.categories = [];
    this.choosenCategoryIds = [];
    this.place = PlaceAdvertising.FIND_PERFORMER;
    this.rootCategoriesBreadCrumb = [];
    this.selectedCity = "Все города";
    this.categoryRootConstruction = null;
  }

  ngOnInit() {
    this.commonService.getAllCategories().subscribe((data: Category[]) => {
      this.categories = data;
      Promise.resolve(null).then(_ => this.displayChoosenCategories(this.choosenCategoryIds));

      this.initinalFindTaskComponent(data, 5);

      if(this.sessionStorage.get('category_construction') != null) {
        this.categoryRootConstruction = JSON.parse(this.sessionStorage.get('category_construction'));
        this.choosenCategories = this.categoryRootConstruction.children;
        this.sessionStorage.remove('category_construction')
      }

      if(this.sessionStorage.get('category_construction_ids') != null) {
        this.choosenCategoryIds = JSON.parse(this.sessionStorage.get('category_construction_ids'));
        this.sessionStorage.remove('category_construction_ids')
      }
    });

    if(this.sessionStorage.get(BreadCrumbDescription.SEL_SELECTED_CITY_PERFORMERS) != null) {
      this.selectedCity = this.sessionStorage.get(BreadCrumbDescription.SEL_SELECTED_CITY_PERFORMERS);
      this.sessionStorage.remove(BreadCrumbDescription.SEL_SELECTED_CITY_PERFORMERS);
    }

     const activeCategories = this.sessionStorage.get(BreadCrumbDescription.SEL_ACTIVE_CATEGORIES_PERFORMERS);
     if(activeCategories != null && activeCategories != "") {
       this.rootCategoriesBreadCrumb = JSON.parse(activeCategories);
     }
  }


  initinalFindTaskComponent(data, i) {
    if(this.findPerformerComponent) {
      this.findPerformerComponent.categories = data;
      this.findPerformerComponent.filterPerformer = this.restoreFilterPerformer();
      this.handleRefreshCategories(this.findPerformerComponent.filterPerformer.choosenCategoryIds);
      if(this.findPerformerComponent.filterPerformer.selectedCity != null) {
        this.findPerformerComponent.partCityName = this.findPerformerComponent.filterPerformer.selectedCity.name;
        this.findPerformerComponent.refreshCitiesCandidates();
      }
    }
    else {
      setTimeout(() => this.initinalFindTaskComponent(data, --i), 200);
    }
  }

  onRouterOutletActivate(event) {
    if(event instanceof FindPerformerComponent) {
      this.findPerformerComponent = event;
      this.findPerformerComponent.eventRefreshCategories.subscribe(
        (ids: number[]) => this.handleRefreshCategories(ids)
      );
      this.findPerformerComponent.eventChooseCategoryByTaskCategory.subscribe(
        (choosenCategoryId: number) => this.handleRefreshCategories([choosenCategoryId])
      );
      this.findPerformerComponent.eventChooseCategory.subscribe(
        (choosenCategoryId: number) => this.displayAdvertising.chooseCategoryHandler(choosenCategoryId)
      );
      this.findPerformerComponent.eventTransferCity.subscribe(
        (selectedСity: string) => {
          this.selectedCity = selectedСity;
          this.sessionStorage.set(BreadCrumbDescription.SEL_SELECTED_CITY_PERFORMERS, this.selectedCity);
      });
      this.findPerformerComponent.eventTransferActiveCategories.subscribe(
        (activeCategories: Category[]) => {
          this.rootCategoriesBreadCrumb = activeCategories;
          this.sessionStorage.set(BreadCrumbDescription.SEL_ACTIVE_CATEGORIES_PERFORMERS, JSON.stringify(this.rootCategoriesBreadCrumb));
      });
    }
    else {
      this.findPerformerComponent = null;
    }

  }

  restoreFilterPerformer(): FilterPerformer {
    const savedFilterPerformer = this.sessionStorage.get(FilterPerformer.FILTER_PERFORMER_PROP);
    let filterPerformer: FilterPerformer;
    if(savedFilterPerformer != null && savedFilterPerformer != '') {
      this.sessionStorage.remove(FilterPerformer.FILTER_PERFORMER_PROP);
      filterPerformer = FilterPerformer.convertToObj(JSON.parse(savedFilterPerformer));
    }
    else {
      filterPerformer = FilterPerformer.createFilterBasedOnChoosenCategory(this.choosenCategories, new FilterPerformer());
    }

    filterPerformer.pageable.page = 0;
    return filterPerformer;
  }

  isChoosenChild(category: Category): boolean {
    let result = false;
    if(!category.isChild()) {
      this.choosenCategories.forEach(choose => {
        if(category.children.includes(choose)) {
          result = true;
          return;
        }
     });
    }

    return result;
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
    if(this.findPerformerComponent == null) {
      return;
    }

    this.findPerformerComponent.toggleCategory(category, true, false);
    this.choosenCategories = this.findPerformerComponent.choosenCategories;
    this.choosenCategoryIds = this.findPerformerComponent.choosenCategoryIds;
  }

  refreshChoosenCategories(isReload: boolean) {
    if(this.findPerformerComponent != null) {
      this.findPerformerComponent.refreshChoosenCategories(this.choosenCategories, isReload);
    }
  }

  deleteCategories() {
    if(this.rootCategoriesBreadCrumb.length != 0) {
      this.rootCategoriesBreadCrumb = [];
    }
    this.findPerformerComponent.clearIconActiveCategory();
    this.sessionStorage.remove(BreadCrumbDescription.SEL_ACTIVE_CATEGORIES_PERFORMERS);
  }

  removeAllFilters() {
    this.findPerformerComponent.clearFilter();
  }

  checkForMissingCategories(): boolean {
    return (this.rootCategoriesBreadCrumb.length == 0) ? true : false;
  }

  getCategoriesNames(): string {
    let categoriesNames: string = '';
    this.rootCategoriesBreadCrumb.forEach(el => {
      categoriesNames = this.rootCategoriesBreadCrumb[this.rootCategoriesBreadCrumb.length - 1].id != el.id ?
        categoriesNames + " " + el.name + "," :
        categoriesNames + " " + el.name;
    });

    return categoriesNames;
  }

}
