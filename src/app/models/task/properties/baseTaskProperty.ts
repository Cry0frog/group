import { BaseCategoryProperty } from './../../category/constructor/baseCategoryProperty';

export class BaseTaskProperty {
  id: number;
  refProperty: BaseCategoryProperty;

  getClassName() {
    return 'base';
  } 

  static convertToObj(obj: any): BaseTaskProperty {
    if(obj == null) {
      return null;
    }

    const taskProp = new BaseTaskProperty();
    Object.assign(taskProp, obj);
    if(obj.refProperty != null) {
      taskProp.refProperty = BaseCategoryProperty.convertToObj(obj.refProperty);
    }
  
    return taskProp;
  }
}