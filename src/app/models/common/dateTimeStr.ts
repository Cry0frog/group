import { Offset } from './../../common/offset';

export class DateTimeStr {

  strActionTime_date: Date;
  strActionTime_time: Date;

  getPreparedTime(): Date {
    return new Date(this.strActionTime_date.getTime()
    + Offset.getOnlyTime(this.strActionTime_time));
  }

  static createBasedOnCurDate(): DateTimeStr {
    const dts: DateTimeStr = new DateTimeStr(); 
    dts.strActionTime_date = Offset.createEmptyCurDate();
    return dts;
  }

  static createBasedOnDate(date: Date): DateTimeStr {
    const dts: DateTimeStr = new DateTimeStr(); 
    dts.strActionTime_date = Offset.createEmptyDate(date);
    dts.strActionTime_time = new Date(date);
    return dts;
  }

  static createBasedOnCurDateAndTime(date: Date): DateTimeStr {
    const dts: DateTimeStr = new DateTimeStr(); 
    dts.strActionTime_date = Offset.createEmptyCurDate();
    dts.strActionTime_time = new Date(date);
    return dts;
  }

}