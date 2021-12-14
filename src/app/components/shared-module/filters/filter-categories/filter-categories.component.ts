import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Category } from 'src/app/models/category/category';

@Component({
  selector: 'app-filter-categories',
  templateUrl: './filter-categories.component.html',
  styleUrls: ['./filter-categories.component.css']
})
export class FilterCategoriesComponent implements OnInit {

  @Input() categories: Category[];
  @Input() choosenCategories: Category[];
  @Input() choosenCategoryIds: number[];
  @Input() isMobileMode: boolean;
  @Output() toggleCategoryEvents = new EventEmitter<Category>();

  constructor() { }

  ngOnInit() { }

  getSortedById(categories: Category[]): Category[] {
    return Category.sortedArrayByOrder(categories);
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

  isChooseCategory(category: Category): boolean {
    return this.choosenCategoryIds.includes(category.id);
  }

  toggleCategory(category) {
    this.toggleCategoryEvents.emit(category);
  }

}
