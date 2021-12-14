import { AuthService } from './../../../../../auth/auth.service';
import { SessionStorageService } from 'angular-web-storage';
import { PartnerService } from './../../../../partner/service/partner.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PartnerInfoWithCity } from 'src/app/models/partnerInfo/partnerInfoWithCity';
import { CategoryConstructionService } from './category-construction.service';
import { Category } from 'src/app/models/category/category';
import { isUndefined } from 'util';

@Component({
  selector: 'app-category-construction',
  templateUrl: './category-construction.component.html',
  styleUrls: ['./category-construction.component.css']
})
export class CategoryConstructionComponent implements OnInit {
  isShowButton: boolean;
  categories: Category[];
  partnersInfo: PartnerInfoWithCity[];
  categoriesChildren: Category[];

  constructor(public router: Router,
    private partnerService: PartnerService,
    private sessionStorage: SessionStorageService,
    private authService: AuthService,
    private categoryConstructionService: CategoryConstructionService) {
    this.categories = [];
    this.partnersInfo = [];
    this.categoriesChildren = [];
   }

  ngOnInit() {
    this.getRootCategoriesWithChildren();
    this.partnerService.getThreePartnerInfoForTheCategoryConstruction().subscribe((partnersInfo: PartnerInfoWithCity[]) => {
      if (!isUndefined(partnersInfo)){
        this.partnersInfo = partnersInfo;
      }
    });
  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    const buttonElement = document.querySelector('#create_task');
    let scrollTop = document.documentElement.scrollTop;
    //@ts-ignore
    let buttonTop = buttonElement.offsetTop + buttonElement.offsetHeight + 150;
    if(scrollTop > buttonTop) {
      this.isShowButton = true;
    }
    else if(scrollTop < buttonTop) {
      this.isShowButton = false;
    }
  }

  getRootCategoriesWithChildren() {
    this.partnerService.getAllRootCategoriesWithChildren().subscribe((data: Category[]) => {
      this.categories = data;
      this.categories.forEach(category => {
        this.categoriesChildren = this.categoriesChildren.concat(category.children);
      });
    });
  }

  routerCreateTask(nameCategory: string) {
    this.categoryConstructionService.routerCreateTask(this.categoriesChildren, nameCategory);
    this.authService.navigateToCreateNewTask();
  }

  loadAllPerformers() {
    this.categoryConstructionService.loadAllPerformers(this.categories, null);
  }

  routerProfile(partnerInfo: PartnerInfoWithCity) {
    window.open(this.router.serializeUrl(this.router.createUrlTree([`/user/${partnerInfo.idPartner}`])), '_self');
  }

  linkToNewTaskForSelectedPerformer(partnerInfo: PartnerInfoWithCity) {
    const categoryId = this.categories.filter(category => category.name === "Ремонт, строительство")[0].id;
    this.categoryConstructionService.linkToNewTaskForSelectedPerformer(partnerInfo, categoryId);
  }

  checkForThreePartnerInfoForTheCategoryConstruction(): boolean {
    return (this.partnersInfo.length == 0) ? true : false;
  }
}
