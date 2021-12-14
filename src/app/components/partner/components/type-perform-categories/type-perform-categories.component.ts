import { CategoryTree } from 'src/app/models/category/categoryTree';
import { CommonService } from './../../../../common/services/common.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PartnerService } from '../../service/partner.service';
import { ShortCategory } from 'src/app/models/partner/shortCategory';
import { Category } from 'src/app/models/category/category';
import { FormControl } from '@angular/forms';
import { chown } from 'fs';

@Component({
  selector: 'app-type-perform-categories',
  templateUrl: './type-perform-categories.component.html',
  styleUrls: ['./type-perform-categories.component.css']
})
export class TypePerformCategoriesComponent implements OnInit {
  @Input() partnerId: number;
  @Input() newShortCategory: ShortCategory;
  @Input() isProfile: boolean;
  @Output() eventAddCategory = new EventEmitter<ShortCategory>();
  @Output() eventDeleteCategory = new EventEmitter<number>();
  @Output() eventAddAllNewShortCategories = new EventEmitter<ShortCategory[]>();

  shortCategories: ShortCategory[];
  selectedCatrgories: ShortCategory[];

  allCategories: CategoryTree[];
  newCategory: Category;

  displaySelectCategories: CategoryTree[];
  displayCategories: Category[];

  toppings = new FormControl();

  oldSelectedCategories: number[];
  isSelect: boolean;

  isDisabledSelect: boolean;
  isMobilePhoneApple: boolean;

  constructor(private partnerService: PartnerService,
    private authService: AuthService,
    private commonService: CommonService
  ) {
    this.newCategory = new Category();
    this.shortCategories = [];
    this.allCategories = [];
    this.displaySelectCategories = [];
    this.displayCategories = [];
    this.selectedCatrgories = [];
    this.isMobilePhoneApple = false;
  }

  ngOnInit() {
    this.oldSelectedCategories = [];
    this.loaderAllCategoriesNameAndShortCategories();
    let user = navigator.userAgent.toLowerCase();
    (user.indexOf("ipad") != -1 || user.indexOf("iphone") != -1) ? this.isMobilePhoneApple = true : this.isMobilePhoneApple = false;
  }

  private isAllChildrenSelected(child: Category): boolean {
    const notSelectedChildren = this.allCategories.find(cat => cat.id===child.root.id).children.filter(child => !this.toppings.value.find(top => child.id===top));
    return notSelectedChildren.length == 0;
  }

  public isSelectedChild(root: Category) {
    return root.children.filter(child => this.shortCategories.find(short => child.id===short.category.id)).length != 0;
  }

  selectCatigories(event) {
    if(this.isDisabledSelect) {
      this.isDisabledSelect = false;
      this.toppings.setValue(this.oldSelectedCategories);
      return;
    }

    this.isSelect = false;
    let tops: number[] = [];
    let selectItem: number;

    if(this.oldSelectedCategories.length > this.toppings.value.length) {
      this.isSelect = true;
      let selectShortCat: ShortCategory;
      selectItem = this.oldSelectedCategories.find(old => !this.toppings.value.some(top => old === top));
      selectShortCat = this.shortCategories.find(cat => cat.category.id == selectItem);

      if(!selectShortCat.category.isChild()) {
        tops = selectShortCat.category.children.map(child => child.id);
      }
      else {
        if(!this.isAllChildrenSelected(selectShortCat.category)) {
          tops.push(selectShortCat.category.root.id);
        }
      }

      tops.push(selectItem);
      tops.forEach(el => this.deleteUserCategory(el))
      tops = this.oldSelectedCategories.filter(old => !tops.find(top => top === old));
      this.toppings.setValue(tops);
    }
    else {
      let selectCat: Category;
      selectItem = this.toppings.value.find(old => !this.oldSelectedCategories.some(top => old === top));
      selectCat = this.allCategories.find(cat => cat.id == selectItem);

      if(!selectCat.isChild()) {
        tops = selectCat.children.map(child => child.id);
      }
      else {
        if(this.isAllChildrenSelected(selectCat)) {
          tops.push(selectCat.root.id);
        }
      }
      tops.push(selectItem);
      tops.forEach(el => this.addUserCategory(el))
      tops = this.oldSelectedCategories.concat(tops);
      this.toppings.setValue(tops);
    }

    this.oldSelectedCategories = this.toppings.value;
  }

  closeSelect(event) {
    if(!event){
      if(this.isProfile) {
        this.loaderAllCategoriesNameAndShortCategories();
        this.oldSelectedCategories = [];
      }
      else {
        this.shortCategories = this.selectedCatrgories;
        this.eventAddAllNewShortCategories.emit(this.shortCategories);
      }

      this.isSelect = false;
    }
  }

  refreshDisplaySelectedRootCategories(shortChilds) {
    shortChilds.forEach(cand => {
      if(!this.displayCategories.map(el => el.id).includes(cand.category.root.id) || this.displayCategories.length == 0) {
        this.displayCategories.push(cand.category.root)
      }
    })

    this.displayCategories.forEach(cat => {
      cat.children = shortChilds.filter(cand => cand.category.isChild() && cand.category.root.id === cat.id).map(el => el.category);
    });

    this.displayCategories = Category.sortedArrayByOrder(this.displayCategories);
  }

  loaderAllCategoriesNameAndShortCategories() {
    this.commonService.getAllCategories().subscribe((date: CategoryTree[]) => {
      this.allCategories = CategoryTree.getCategoriesInRows(date);
      this.displaySelectCategories = this.allCategories.filter(category => category.folder == true);

      this.partnerService.getAllUserCategories(this.partnerId).subscribe((shortCats: ShortCategory[]) => {
        this.displayCategories = [];
        const shortCatRoot = shortCats.filter(cat => !cat.category.isChild());
        const shortChilds = shortCats.filter(cat => cat.category.isChild());;
        this.newCategory = new Category();
        this.shortCategories = shortCats;
        this.toppings.setValue(shortCatRoot.map(cat => cat.category.id));
        this.oldSelectedCategories = this.toppings.value;
        this.refreshDisplaySelectedRootCategories(shortChilds);
      });
    });
  }

  isYourProfile(): boolean {
    return this.partnerId == this.authService.getCurrentId;
  }

  sortedArray(categories: Category[]): Category[] {
    return categories.sort((a, b) => a.order - b.order);
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
      const categoryIds = children.filter(child => this.shortCategories
        .some(short => child.id === short.idCategory || this.toppings.value.includes(root.id)))
        .map(el => el.id);
      this.oldSelectedCategories = this.oldSelectedCategories.concat(categoryIds);
      this.toppings.setValue(this.oldSelectedCategories);
    }
    else {
      this.displaySelectCategories = this.displaySelectCategories.filter(category => !children.some(child => category.id === child.id));
      this.oldSelectedCategories = this.oldSelectedCategories.filter(catId => !children.some(child => catId === child.id));
      this.toppings.setValue(this.oldSelectedCategories);
    }
  }

  addUserCategory(categorieId) {
    this.newShortCategory = new ShortCategory();
    this.newShortCategory.idCategory = categorieId;
    let categoriesById: CategoryTree[] = this.allCategories.filter(el=> el.id == this.newShortCategory.idCategory);
    let categoryById: Category = categoriesById[0];
    this.newShortCategory.nameCategory = categoryById.name;
    this.eventAddCategory.emit(this.newShortCategory);
    this.newShortCategory.category = categoriesById[0];
    this.shortCategories.push(this.newShortCategory);

    if(!this.isProfile) {
      this.selectedCatrgories.push(this.newShortCategory);
    }
  }

  deleteUserCategory(id) {
    this.eventDeleteCategory.emit(id);
    this.shortCategories = this.shortCategories.filter(short => short.category.id != id);
    if(!this.isProfile) {
      this.selectedCatrgories = this.selectedCatrgories.filter(el => el.idCategory != id);
    }

    if(!this.isSelect && this.isProfile) {
      this.loaderAllCategoriesNameAndShortCategories();
    }
  }
}
