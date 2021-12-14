import { PageableParams } from './../../../../models/pageable/PageableParams';
import { Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { PartnerService } from './../../../partner/service/partner.service';
import { AuthService } from './../../../../auth/auth.service';
import { ShortHomeCategoty } from 'src/app/models/category/shortHomeCategory';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-categories',
  templateUrl: './home-categories.component.html',
  styleUrls: ['./home-categories.component.css']
})
export class HomeCategoriesComponent implements OnInit {

  categories: ShortHomeCategoty[];
  isAllCategoriesMode: boolean;
  pageable: PageableParams;
  staticPageMode: boolean;

  constructor(private authService: AuthService,
    private partnerService: PartnerService,
    private sessionStorage: SessionStorageService,
    public router: Router) {
      this.staticPageMode = true;

      this.pageable = new PageableParams();
      this.pageable.size = 6;
      this.isAllCategoriesMode = false;
      this.categories = [];
   }

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.partnerService.getAllNameCategoryForHome(this.pageable).subscribe((data: ShortHomeCategoty[]) => {
      this.staticPageMode = false;
      this.categories = data;
    });
  }

  loadAllCategories() {
    this.isAllCategoriesMode = true;
    this.pageable.size = 100;
    this.getCategories();
  }

  get sortedArray(): ShortHomeCategoty[] {
    return this.categories.sort((a, b) => {
       return a.categoryOrder - b.categoryOrder;
    });
  }

  routerCreateTask(category: ShortHomeCategoty) {
    this.sessionStorage.set("сategory_Id", JSON.stringify(category.categoryId));
    this.authService.navigateToCreateNewTask();
  }

}
