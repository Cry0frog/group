import { JobStatisticsComponent } from './job-statistics/job-statistics.component';
import { UserStatisticsComponent } from './user-statistics/user-statistics.component';
import { GeoService } from 'src/app/services/geo.service';
import { AdminService } from './../../service/admin.service';
import { CommonStatisticsComponent } from './common-statistics/common-statistics.component';
import { UrlResolver } from './../../../partner/common/urlResolver';
import { Router } from '@angular/router';
import { ActiveUrls } from './../../../../auth/activeUrls';
import { Component, OnInit } from '@angular/core';
import { GeoCityResponse } from 'src/app/models/map/geo/city/geoCityResponse';
import { SelectItem } from 'primeng/api';
import { GeoCityProperty } from 'src/app/models/map/geo/city/geoCityProperty';
import { RU_CALENDAR } from 'src/app/common/localization';
import { StatisticSettings } from 'src/app/models/statistics/statisticSettings';
import { FormControl } from '@angular/forms';
import { CategoryTree } from 'src/app/models/category/categoryTree';
import { GeoCityFeature } from 'src/app/models/map/geo/city/geoCityFeature';
import { StatisticMode } from './statisticMode';
import { FieldActivity } from 'src/app/models/field-activity/fileldActivity';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  commonStatisticsComponent: CommonStatisticsComponent;
  userStatisticsComponent: UserStatisticsComponent;
  jobStatisticsComponent: JobStatisticsComponent;

  allCategories: CategoryTree[];

  partCityName: string;
  geoCityResponse: GeoCityResponse;

  cities: SelectItem[];
  selectedCity: GeoCityProperty;
  ru_calendar = RU_CALENDAR;
  settings: StatisticSettings;

  dateRange: Date[];

  toppings = new FormControl();

  oldSelectedCategories: number[];
  isDisabledSelect: boolean;
  displaySelectCategories: CategoryTree[];

  fieldsActivity: FieldActivity[];

  statisticMode: StatisticMode;

  constructor(private router: Router,
    private adminService: AdminService,
    private geoService: GeoService) {
      this.fieldsActivity = [];
      this.resetFilter();
  }

  ngOnInit() {
    const url = UrlResolver.getMainSectionFromUrl(this.router.url);
    // @ts-ignore
    document.querySelectorAll(`.partner-panel .${url}`)[0].checked = true;
    this.reloadAllFieldsActivity();
    this.reloadAllCategories();
    this.reloadAllUsedCities();
  }

  resetFilter() {
    this.cities = [];
    this.settings = new StatisticSettings();
    this.dateRange = [this.settings.dateStart, this.settings.dateEnd];
    this.oldSelectedCategories = [-1];
    this.toppings.setValue([-1]);
  }

  onRouterOutletActivate(event) {
    if(event instanceof CommonStatisticsComponent) {
      this.commonStatisticsComponent = event;
      this.statisticMode = StatisticMode.COMMON;
      this.resetFilter();
      this.commonStatisticsComponent.reloadAllCharts(this.settings);
    }
    else {
      this.commonStatisticsComponent = null;
    }

    if(event instanceof UserStatisticsComponent) {
      this.userStatisticsComponent = event;
      this.statisticMode = StatisticMode.USER;
      this.resetFilter();
      this.userStatisticsComponent.reloadMap(this.settings);
    }
    else {
      this.userStatisticsComponent = null;
    }

    if(event instanceof JobStatisticsComponent) {
      this.jobStatisticsComponent = event;
      this.statisticMode = StatisticMode.JOB;
      this.resetFilter();
      this.jobStatisticsComponent.reloadAllCharts(this.settings);
    }
    else {
      this.jobStatisticsComponent = null;
    }
  }

  get isUserStatistic() {
    return this.statisticMode == StatisticMode.USER;
  }

  get isJobStatistic() {
    return this.statisticMode == StatisticMode.JOB;
  }

  get isCommonStatistic() {
    return this.statisticMode == StatisticMode.COMMON;
  }

  getCommonStatistics() {
    return ActiveUrls.ADMIN_COMMON_STATISTICS;
  }

  getUserStatistics() {
    return ActiveUrls.ADMIN_USER_STATISTICS;
  }

  getJobStatistics() {
    return ActiveUrls.ADMIN_JOB_STATISTICS;
  }

  applyStatisticSettings() {
    if(this.dateRange != null) {
      if(this.dateRange.length == 0) {
        this.dateRange.push(new Date());
      }
      if(this.dateRange.length == 1) {
        this.dateRange.push(new Date());
      }

      if(this.dateRange[0] == null) {
        this.dateRange[0] = new Date();
      }
      if(this.dateRange[1] == null) {
        this.dateRange[1] = new Date();
      }
      this.settings.dateStart = this.dateRange[0];
      this.settings.dateEnd = this.dateRange[1];
    }

    if(this.selectedCity != null) {
      this.settings.osm_id = this.selectedCity.osm_id;
    }

    if(this.commonStatisticsComponent != null) {
      this.commonStatisticsComponent.settings = this.settings;
      this.commonStatisticsComponent.applyStatisticSettings();
    }
    else if(this.userStatisticsComponent != null) {
      this.userStatisticsComponent.reloadMap(this.settings);
    }
    else if(this.jobStatisticsComponent != null) {
      this.jobStatisticsComponent.settings = this.settings;
      this.jobStatisticsComponent.applyStatisticSettings();
    }

  }

  reloadAllUsedCities() {
    this.adminService.getUsedSities().subscribe((data: GeoCityProperty[]) => {
      this.cities = data.map((city: GeoCityProperty) => {
        return {
          label: city.getDisplayName(),
          value: city
        }
      });
    });
  }

  reloadAllFieldsActivity() {
    this.adminService.getAllFieldsActivity().subscribe((data: FieldActivity[]) => {
      this.fieldsActivity = FieldActivity.sortedArray(data);
    });
  }

  reloadAllCategories() {
    this.adminService.getAllCategories().subscribe((data: CategoryTree[]) => {
      this.allCategories = CategoryTree.getCategoriesInRows(data);
      this.displaySelectCategories = this.allCategories.filter(category => category.folder == true);
    });
  }

  selectCatigories(event) {

    if(this.isDisabledSelect) {
      this.isDisabledSelect = false;
      this.toppings.setValue(this.oldSelectedCategories);
      return;
    }

    let tops: number[] = [];

    if(event.includes(-1) && this.oldSelectedCategories.length == 0) {
      event = event.filter(value => value != -1);
      this.toppings.setValue(event);
    }
    else if(event.includes(-1) && this.oldSelectedCategories.length != 0) {
      return this.setAllCategories();
    }

    if(this.oldSelectedCategories.length > this.toppings.value.length) {
      const rootCategory = this.findRoot(this.oldSelectedCategories, this.toppings.value);
      const childCategory = this.findChild(this.oldSelectedCategories, this.toppings.value);
      if(rootCategory != null && rootCategory.children != null) {
        //remove root
        tops = rootCategory.children.map(el => el.id);
        tops = tops.concat(rootCategory.id);
      }
      else if(childCategory == null) {
        tops = this.oldSelectedCategories.filter(a => !this.toppings.value.find(b => a===b))
      }
      else{
        //remove child
        if(this.toppings.value.some(el => el===childCategory.root.id)){
          tops = this.oldSelectedCategories.filter(el => el===childCategory.id);
          tops = tops.concat(childCategory.root.id);
        }
        else{
          tops = this.oldSelectedCategories.filter(el => el===childCategory.id);
        }
      }

      this.settings.categoryIds = this.settings.categoryIds.filter(id => !tops.find(removeId => id===removeId));
      tops = this.oldSelectedCategories.filter(a => !tops.find(b => a===b));
      this.toppings.setValue(tops);
    }
    else {
      //added root
      const rootCategory = this.findRoot(this.toppings.value, this.oldSelectedCategories);
      const childCategory = this.findChild(this.toppings.value, this.oldSelectedCategories);
      if(rootCategory != null && rootCategory.children != null) {
        if(rootCategory.children.map(a => a.id).some(b => this.oldSelectedCategories.find(c => b===c))){
          tops = this.toppings.value.filter(a => !this.oldSelectedCategories.find(b => a===b));
          tops = tops.concat(rootCategory.children.map(el => el.id).filter(a => !this.oldSelectedCategories.find(b => a===b)));
        }
        else{
          tops = this.toppings.value.filter(a => !this.oldSelectedCategories.find(b => a===b));
          tops = tops.concat(rootCategory.children.map(el => el.id));
        }
        this.settings.categoryIds = this.settings.categoryIds.concat(tops);
        tops = tops.concat(this.toppings.value.filter(a => !tops.find(b => a==b)));
        this.toppings.setValue(tops);
      }
      else if(childCategory == null) {
        tops = this.toppings.value.filter(a => !this.oldSelectedCategories.find(b => a===b));
        this.settings.categoryIds.push(tops[0]);
      }
      else{
        //added child
        this.settings.categoryIds.push(childCategory.id);
      }
    }

    if(this.toppings.value == 0) {
      return this.setAllCategories();
    }

    this.oldSelectedCategories = this.toppings.value;
  }

  toggleCategory(isExpanded, root: CategoryTree) {
    this.isDisabledSelect = true;
    root.isExpanded = isExpanded;
    let newDisplayCategories = [];
    const children = this.allCategories.filter(category => root.children.find(child => child.id===category.id));
    if(isExpanded) {
      this.displaySelectCategories.forEach(category => {
        newDisplayCategories.push(category);
        if(category.id == root.id) {
          newDisplayCategories = newDisplayCategories.concat(children);
        }
      });
      this.displaySelectCategories = newDisplayCategories;
      const categoryIds = children.filter(child => this.settings.categoryIds.some(cat => child.id === cat)).map(el => el.id);
      this.oldSelectedCategories = this.oldSelectedCategories.concat(categoryIds);
      this.toppings.setValue(this.oldSelectedCategories);
    }
    else {
      this.displaySelectCategories = this.displaySelectCategories.filter(category => !children.some(child => category.id === child.id));
      this.oldSelectedCategories = this.oldSelectedCategories.filter(catId => !children.some(child => catId === child.id));
      this.toppings.setValue(this.oldSelectedCategories);
    }
  }

  selectFieldsActivity(event) {
    if(event.includes(-1) && this.settings.fieldsActivityIds.length == 0) {
      event = event.filter(value => value != -1);
      this.toppings.setValue(event);
    }
    else if(event.includes(-1) && this.settings.fieldsActivityIds.length != 0) {
      return this.setAllFieldsActivity();
    }

    if(this.toppings.value == 0) {
      return this.setAllFieldsActivity();
    }

    this.settings.fieldsActivityIds = this.toppings.value;
  }


  private setAllCategories() {
    this.settings.categoryIds = [];
    this.oldSelectedCategories = [];
    this.toppings.setValue([-1]);
  }

  private setAllFieldsActivity() {
    this.settings.fieldsActivityIds = [];
    this.toppings.setValue([-1]);
  }

  private findChild(old: number[], cur: number[]): CategoryTree {
    const id = old.filter((el: number) => !cur.includes(el))[0];
    const childCategories = this.allCategories.filter((category: CategoryTree) => category.isChild() && category.id == id);

    if(childCategories.length == 0) {
      return null;
    }
    return childCategories[0];
  }

  private findRoot(old: number[], cur: number[]): CategoryTree {
    const id = old.filter((el: number) => !cur.includes(el))[0];
    const rootCategories = this.allCategories.filter((category: CategoryTree) => category.isRootDirectory() && category.id == id);

    if(rootCategories.length == 0) {
      return null;
    }
    return rootCategories[0];
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

}
