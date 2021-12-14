import { BaseCategoryProperty } from './../baseCategoryProperty';
import { TypeCategoryProperty } from './../typeCategoryProperty';

export class DateCategoryProperty extends BaseCategoryProperty {

  allowChooseModeTaskPerform: boolean;

  get firstTitle() {
    return this.title;
  }

  get secondTitle() {
    return this.exampleText;
  }

  getClassName() {
    return 'DateCategoryProperty'; //(<any>this).constructor.name;
  }

  isFirstTitleEmpty(): boolean {
    return this.title != null && this.title != '';
  }

  isSecondTitleEmpty(): boolean {
    return this.exampleText != null && this.exampleText != '';
  }

  static createEmptyDateProperty(orderCounter: number): DateCategoryProperty {
    const prop = new DateCategoryProperty();
    prop.type = TypeCategoryProperty.DATE;
    prop.allowChooseModeTaskPerform = true;
    prop.order = orderCounter;
    return prop;
  }
}