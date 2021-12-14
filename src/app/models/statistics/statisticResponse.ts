import { StatisticPoint } from './statisticPoint';

export class StatisticResponse {
  statisticPoints: StatisticPoint[];

  static convertToObj(obj: any): StatisticResponse {
    if(obj == null) {
      return null;
    }
    const resp: StatisticResponse = new StatisticResponse();
    Object.assign(resp, obj);
    if(obj.statisticPoints != null) {
      resp.statisticPoints = obj.statisticPoints.map(el => StatisticPoint.convertToObj(el));
    }
    
    return resp;
  }
}