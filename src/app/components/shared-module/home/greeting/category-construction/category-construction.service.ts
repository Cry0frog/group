import { Injectable } from '@angular/core';
import { Category } from 'src/app/models/category/category';
import { FilterPerformer } from 'src/app/models/filter/filterPerformer';
import { Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { BreadCrumbDescription } from 'src/app/common/breadCrumbDescription';
import { PartnerInfoWithCity } from 'src/app/models/partnerInfo/partnerInfoWithCity';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryConstructionService {

  filterPerformer: FilterPerformer;
  categoryConstruction: Category;
  categoriesBreadCrumb: Category[];
  
  constructor(public router: Router,
    private authService: AuthService,
    private sessionStorage: SessionStorageService) {
      this.filterPerformer = new FilterPerformer();
      this.categoryConstruction = new Category();
      this.categoriesBreadCrumb = [];
  }

  routerCreateTask(categoriesChildren: Category[], nameCategory: string) {
    const category = categoriesChildren.filter(category => category.name === nameCategory)[0];
    if(category != null) {
      this.sessionStorage.set("сategory_Id", JSON.stringify(category.root.id));
      this.sessionStorage.set("child_сategory_Id", JSON.stringify(category.id));
    }
  }

  loadAllPerformers(categoriesRoot: Category[], partnerInfo: PartnerInfoWithCity) {

    if(partnerInfo != null) {
      this.filterPerformer.selectedCity = partnerInfo.cityProperty;
      this.sessionStorage.set(BreadCrumbDescription.SEL_SELECTED_CITY_PERFORMERS, partnerInfo.cityProperty.name);
    }

    this.categoryConstruction = categoriesRoot.filter(category => category.name === "Ремонт, строительство")[0];
    
    this.filterPerformer.choosenCategoryIds = this.categoryConstruction.children.map(category => category.id); 
    this.filterPerformer.choosenCategoryIds.push(this.categoryConstruction.id);

    this.sessionStorage.set(FilterPerformer.FILTER_PERFORMER_PROP, JSON.stringify(this.filterPerformer));
    this.categoriesBreadCrumb.push(this.categoryConstruction);
    this.sessionStorage.set(BreadCrumbDescription.SEL_ACTIVE_CATEGORIES_PERFORMERS, JSON.stringify(this.categoriesBreadCrumb));
    this.sessionStorage.set('category_construction', JSON.stringify(this.categoryConstruction));
    this.sessionStorage.set('category_construction_ids', JSON.stringify(this.filterPerformer.choosenCategoryIds));
    
    const url = this.router.serializeUrl(this.router.createUrlTree([`performers`]));
    window.open(url, '_self');
  }

  linkToNewTaskForSelectedPerformer(partnerInfo: PartnerInfoWithCity, categoryConstructionId) {
    this.sessionStorage.set('save_performer', partnerInfo);
    this.sessionStorage.set('save_partner_current_id', this.authService.getCurrentId);
    this.sessionStorage.set('save_performer_category', partnerInfo.categoriesName);
    this.sessionStorage.set("сategory_Id", JSON.stringify(categoryConstructionId));

    window.open(this.router.serializeUrl(this.router.createUrlTree([`/new_task`])));
  }

}
