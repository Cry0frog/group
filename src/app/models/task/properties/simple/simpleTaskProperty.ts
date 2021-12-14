import { CategoryProperty } from 'src/app/models/category/constructor/simple/categoryProperty';
import { BaseTaskProperty } from './../baseTaskProperty';

export class SimpleTaskProperty extends BaseTaskProperty {
 
  value: string;

  getClassName() {
    return 'SimpleTaskProperty'; //(<any>this).constructor.name;
  }

  static convertToObj(obj: any): SimpleTaskProperty {
    if(obj == null) {
      return null;
    }

    const taskProp = new SimpleTaskProperty();
    Object.assign(taskProp, obj);
    if(obj.refProperty != null) {
      const catProp = new CategoryProperty();
      Object.assign(catProp, obj.refProperty);
      
      taskProp.refProperty = catProp;
    }

    return taskProp;
  }

}