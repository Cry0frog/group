import { BaseCategoryProperty } from './../baseCategoryProperty';
import { TypeCategoryProperty } from '../typeCategoryProperty';

export class CategoryProperty extends BaseCategoryProperty {
  placeholder: string;

  getClassName() {
    return 'CategoryProperty'; //(<any>this).constructor.name;
  }

  static createEmptyProperty(orderCounter: number): CategoryProperty {
    const prop = new CategoryProperty();
    prop.type = TypeCategoryProperty.STRING;
    prop.order = orderCounter;
    return prop;
  }
}
