import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { UsedChartType } from 'src/app/components/admin/components/statistics/usedChartType';
import { Offset } from './../../common/offset';
import { ChartConfig } from './chartConfig';
import { StatisticPoint } from './statisticPoint';

export class StatisticSettings {
  constructor() {
    this.offset = Offset.getCurTimeZone();
    this.categoryIds = [];
    this.fieldsActivityIds = [];
    this.dateStart = Offset.createEmptyDayWithShift(-1);
    this.dateEnd = Offset.createEmptyDayWithShift(1);
  }

  dateStart: Date;
  dateEnd: Date;
  osm_id: number;
  categoryIds: number[];
  offset: string;
  fieldsActivityIds: number[];

  static clone(obj: StatisticSettings) {
    const newStat: StatisticSettings = new StatisticSettings();
    Object.assign(newStat, obj);

    return newStat;
  }

  static buildCommonCharts(chartType: UsedChartType,
    title: string, titleValueFirst: string, titleValueSecond: string,
    barChartData: ChartDataSets[], labels: Label[],
    legend: boolean, lineChartColors: Color[],
    isAvailableReport: boolean, isAvailableFullReport: boolean): ChartConfig
  {
    let chart: ChartConfig = new ChartConfig();
    chart.chartType = chartType;
    chart.title = title;
    chart.titleValueFirst = titleValueFirst;
    chart.titleValueSecond = titleValueSecond;
    if(chart.barChartOptions == UsedChartType.line) {
      chart.barChartOptions = {
        responsive: true
      };
    }

    if(chart.chartType == UsedChartType.bar) {
      chart.barChartOptions = {
        responsive: true,
        scales : {
          xAxes: [{
            ticks: {
              min: 0,
            }
          }],
          yAxes: [{
            ticks: {
              min: 0
            }
          }]
        }
      };
    }
    else {
      chart.barChartOptions = {
        responsive: true,
      };
    }

    chart.legend = legend;
    chart.lineChartColors = lineChartColors;
    chart.barChartData = barChartData;
    chart.barChartLabels = labels;
    chart.isAvailableReport = isAvailableReport;
    chart.isAvailableFullReport = isAvailableFullReport;
    return chart;
  }

  static sortByTime(points: StatisticPoint[]) {
    return points.sort(
      (a: StatisticPoint, b: StatisticPoint) => (a.dateLabel.getTime() > b.dateLabel.getTime()) ? 1
        : (a.dateLabel.getTime() === b.dateLabel.getTime()) ? 0
        : -1);
  }

  static calcSumm(points: StatisticPoint[]): number {
    return points != null ? points.reduce((summ, el) => summ + el.value, 0) : 0;
  }

}
