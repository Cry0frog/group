import { FindResumeComponent } from './find-resume/find-resume.component';
import { Component, OnInit } from '@angular/core';
import { FieldActivity } from 'src/app/models/field-activity/fileldActivity';
import { CommonService } from 'src/app/common/services/common.service';
import { SessionStorageService } from 'angular-web-storage';
import { FilterResume } from 'src/app/models/filter/filterResume';
import { AuthService } from 'src/app/auth/auth.service';
import { Vacancy } from 'src/app/models/vacancy/vacancy';

@Component({
  selector: 'app-find-resume-page',
  templateUrl: './find-resume-page.component.html',
  styleUrls: ['./find-resume-page.component.css']
})
export class FindResumePageComponent implements OnInit {
  findResumeComponent: FindResumeComponent;

  fieldsActivity: FieldActivity[];
  choosenFieldsActivityIds: number[];
  choosenFieldsActivity: FieldActivity[];

  constructor(private commonService: CommonService,
    private sessionStorage: SessionStorageService) {
    this.fieldsActivity = [];
    this.choosenFieldsActivityIds = [];
    this.choosenFieldsActivity = [];
  }

  ngOnInit() {
    window.scrollTo(0,0);
    this.getAllRootFieldsActivity();
  }

  onRouterOutletActivate(event) {

    if(event instanceof FindResumeComponent) {
      this.findResumeComponent = event;

      this.findResumeComponent.eventRefreshFieldsActivity.subscribe(
        (choosenFieldsId: number[]) => this.handleRefreshFieldsActivity(choosenFieldsId));
    }

  }

  getAllRootFieldsActivity() {
    this.commonService.getAllRootFieldsActivity().subscribe(data => {
      if(data != null) {
        this.fieldsActivity = FieldActivity.sortedArray(data);

        Promise.resolve(null).then(_ => this.displayChoosenFieldsActivity(this.choosenFieldsActivityIds));
        this.initinalFindVacancyComponent(data, 5);

      }
    })
  }

  restoreFilterVacancy(): FilterResume {
    const savedFilterVacancy = this.sessionStorage.get(FilterResume.FILTER_RESUME_PROP);
    let filterResume: FilterResume;
    if(savedFilterVacancy != null && savedFilterVacancy != '') {
      this.sessionStorage.remove(FilterResume.FILTER_RESUME_PROP);
      filterResume = FilterResume.convertToObj(JSON.parse(savedFilterVacancy));
    }
    else {
      filterResume = FilterResume.createFilterBasedOnChoosenFiledActivity(this.choosenFieldsActivity, new FilterResume());
    }

    filterResume.pageable.page = 0;
    return filterResume;
  }

  initinalFindVacancyComponent(data, i) {
    if(this.findResumeComponent) {
      this.findResumeComponent.fieldsActivity = data;

      const vacancy = Vacancy.convertToObj(JSON.parse(this.sessionStorage.get(AuthService.CHOOSEN_VACANCY)));
      if(vacancy != null) {
        this.sessionStorage.remove(AuthService.CHOOSEN_VACANCY);
        const filterResume = new FilterResume();
        filterResume.selectedCity = vacancy.city;
        filterResume.choosenFieldActivityIds = [vacancy.fieldActivity.id];
        this.sessionStorage.set(FilterResume.FILTER_RESUME_PROP, JSON.stringify(filterResume));
        this.findResumeComponent.choosenVacancy = vacancy;
      }

      this.findResumeComponent.filterResume = this.restoreFilterVacancy();
      this.handleRefreshFieldsActivity(this.findResumeComponent.filterResume.choosenFieldActivityIds);
      if(this.findResumeComponent.filterResume.selectedCity != null) {
        this.findResumeComponent.partCityName = this.findResumeComponent.filterResume.selectedCity.name;
        this.findResumeComponent.refreshCitiesCandidates();
      }
    }
    else {
      setTimeout(() => this.initinalFindVacancyComponent(data, --i), 200);
    }
  }

  handleRefreshFieldsActivity(ids: number[]) {
    this.choosenFieldsActivityIds = ids;
    this.displayChoosenFieldsActivity(ids);
    this.refreshChoosenFieldsActivity(true);
  }

  displayChoosenFieldsActivity(ids: number[]) {
    if(ids.length == 0) {
      this.choosenFieldsActivity = [];
    }

    this.fieldsActivity.forEach(cat => {
      if(ids.includes(cat.id)) {
        this.choosenFieldsActivity.push(cat);
      }

      if(cat.children != null && cat.children.length != 0) {
        this.choosenFieldsActivity = this.choosenFieldsActivity.concat(cat.children.filter(child => ids.includes(child.id)));
      }
    });
  }

  refreshChoosenFieldsActivity(isReload: boolean) {
    if(this.findResumeComponent != null) {
      this.findResumeComponent.refreshChoosenFieldsActivity(this.choosenFieldsActivity, isReload);
    }
  }

  toggleFieldActivity(fieldAcivity: FieldActivity) {
    if(this.findResumeComponent == null) {
      return;
    }

    this.findResumeComponent.toggleFieldAcivity(fieldAcivity, true, false);
    this.choosenFieldsActivityIds = this.findResumeComponent.choosenFieldsActivityIds;
    this.choosenFieldsActivity = this.findResumeComponent.choosenFieldsActivity;
  }


}
