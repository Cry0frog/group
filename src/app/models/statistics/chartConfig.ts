import { Color, Label } from 'ng2-charts';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';

export class ChartConfig {
  title: string;
  titleValueFirst: string;
  titleValueSecond: string;
  
  chartType: ChartType;
  barChartOptions: ChartOptions;
  
  barChartData: ChartDataSets[];
  barChartLabels: Label[];

  
  lineChartColors: Color[];
  legend: boolean;
  isAvailableReport: boolean;
  isAvailableFullReport: boolean;

  static clone(base: ChartConfig): ChartConfig {
    return JSON.parse(JSON.stringify(base));
  }
}