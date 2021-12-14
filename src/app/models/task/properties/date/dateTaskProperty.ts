import { ModeTaskPerformer } from './modeTaskPerformer';
import { DateCategoryProperty } from './../../../category/constructor/date/dateCategoryProperty';
import { BaseTaskProperty } from '../baseTaskProperty';

export class DateTaskProperty extends BaseTaskProperty {

  getClassName() {
    return 'DateTaskProperty';//(<any>this).constructor.name;
  }

  modeTaskPerformer: ModeTaskPerformer;

  dateStart: Date;
  dateEnd: Date;

  offset: string;

  //only ui
  date1: Date;
  time1: Date;

  date2: Date;
  time2: Date;

  isDatable() {
    return this.modeTaskPerformer == ModeTaskPerformer.ON_DATE
      //|| this.modeTaskPerformer == ModeTaskPerformer.URGENTLY;
  }

  static convertToObj(obj: any): DateTaskProperty {
    if(obj == null) {
      return null;
    }
    const taskProp = new DateTaskProperty();
    Object.assign(taskProp, obj);
    if(obj.dateStart != null) {
      taskProp.dateStart = new Date(Date.parse(obj.dateStart));
      taskProp.date1 = taskProp.dateStart;
      taskProp.time1 = taskProp.dateStart;
    }
    if(obj.dateEnd != null) {
      taskProp.dateEnd = new Date(Date.parse(obj.dateEnd));
      taskProp.date2 = taskProp.dateEnd;
      taskProp.time2 = taskProp.dateEnd;
    }

    if(obj.refProperty != null) {
      const catProp = new DateCategoryProperty();
      Object.assign(catProp, obj.refProperty);
      
      taskProp.refProperty = catProp;
    }
    return taskProp;
  }
}