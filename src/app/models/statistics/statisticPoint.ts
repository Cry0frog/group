import { TRANSLATE_DISPLAY_SURVEY_OPTIONS } from 'src/app/components/shared-module/common/surveyOptions.description';

export class StatisticPoint {
  dateLabel: Date;
  label;
  value;

  static convertToObj(obj: any): StatisticPoint {
    if(obj == null) {
      return null;
    }
    const point: StatisticPoint = new StatisticPoint();
    Object.assign(point, obj);
    point.dateLabel = new Date(Date.parse(obj.dateLabel));
    point.label = TRANSLATE_DISPLAY_SURVEY_OPTIONS[obj.label];
    return point;
  }

}