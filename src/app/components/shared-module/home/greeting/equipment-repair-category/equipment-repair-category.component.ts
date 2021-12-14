import { Component, HostListener, OnInit } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';
import { AuthService } from 'src/app/auth/auth.service';
import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { Category } from 'src/app/models/category/category';
import { CategoryConstructionService } from '../category-construction/category-construction.service';

@Component({
  selector: 'app-equipment-repair-category',
  templateUrl: './equipment-repair-category.component.html',
  styleUrls: ['./equipment-repair-category.component.css']
})
export class EquipmentRepairCategoryComponent implements OnInit {
  isShowButton: boolean;
  categories: Category[];
  categoriesChildren: Category[];

  constructor(private partnerService: PartnerService,
    private sessionStorage: SessionStorageService,
    private authService: AuthService,
    private categoryConstructionService: CategoryConstructionService) {
      this.categories = [];
      this.categoriesChildren = [];
   }

  ngOnInit() {
    this.getRootCategoriesWithChildren();
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

}
