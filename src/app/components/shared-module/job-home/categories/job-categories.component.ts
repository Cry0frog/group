import { ShortFieldActivity } from '../../../../models/field-activity/category/shortJobFieldActivity';
import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonService } from 'src/app/common/services/common.service';
import { FilterVacancy } from 'src/app/models/filter/filterVacancy';
import { PageableParams } from 'src/app/models/pageable/PageableParams';

@Component({
  selector: 'app-job-categories',
  templateUrl: './job-categories.component.html',
  styleUrls: ['./job-categories.component.css']
})
export class JobCategoriesComponent implements OnInit {

  shortFieldActivitys: ShortFieldActivity[];
  filterVacancy: FilterVacancy;
  staticPageMode: boolean;
  isAllCategoriesMode: boolean;
  pageable: PageableParams;

  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private sessionStorage: SessionStorageService,
  ) {
    this.staticPageMode = true;

    this.pageable = new PageableParams();
    this.pageable.size = 6;
    this.isAllCategoriesMode = false;
    this.shortFieldActivitys = [];
   }

  ngOnInit() {
    this.getCategories();
  }

  routerFindVacancy(shortFieldActivity: ShortFieldActivity) {
    console.log(shortFieldActivity.fieldActivityId);
    this.sessionStorage.set(AuthService.FIELD_ACTIVITY_ID, JSON.stringify(shortFieldActivity.fieldActivityId));
    this.authService.navigateToFindVacancy();
  }

  loadAllCategories() {
    this.isAllCategoriesMode = true;
    this.pageable.size = 100;
    this.getCategories();
  }

  getCategories() {
    this.commonService.getAllNameCategoryForJob(this.pageable).subscribe((data: ShortFieldActivity[]) => {
      this.staticPageMode = false;
      this.shortFieldActivitys = data;
    });
  }

  get sortedArray(): ShortFieldActivity[] {
    return this.shortFieldActivitys.sort((a, b) => {
       return a.fieldActivityId - b.fieldActivityId;
    });
  }

}
