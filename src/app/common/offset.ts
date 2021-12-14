export class Offset {

  static getCurTimeZone(): string {
    const offset = new Date().getTimezoneOffset(), o = Math.abs(offset);
    return (offset < 0 ? "+" : "-") 
      + ("00" + Math.floor(o / 60)).slice(-2)
      + ":" + ("00" + (o % 60)).slice(-2)
      + ":00";
  }

  static getOnlyTime(date: Date) {
    return date.getHours() * 60 * 60 * 1000
      + date.getMinutes() * 60 * 1000
      + date.getSeconds() * 1000
      + date.getMilliseconds();
  }

  static createEmptyDayWithShift(shift: number): Date {
    let date = this.createEmptyCurDate();
    date.setDate(date.getDate() + shift);
    return date;
  }

  static createEmptyCurDate() {
    const curDate = new Date();
    curDate.setHours(0, 0, 0, 0);
    return curDate;
  }

  static createEmptyDate(date: Date) {
    const emptyDate = new Date(date);
    emptyDate.setHours(0, 0, 0, 0);
    return emptyDate;
  }

}
