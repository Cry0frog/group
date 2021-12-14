import { ChartType, ChartDataSets } from 'chart.js';
import { StatisticPoint } from './../../../../../../models/statistics/statisticPoint';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChartConfig } from 'src/app/models/statistics/chartConfig';
import { DatePipe } from '@angular/common';
import { UsedChartType } from '../../usedChartType';

export interface IChartTypeMapper {
  value: UsedChartType;
  viewValue: string;
}

export const CHART_TYPES: IChartTypeMapper[] = [
  { value: UsedChartType.line, viewValue: 'График' },
  { value: UsedChartType.bar, viewValue: 'Столбчатая' },
  { value: UsedChartType.doughnut, viewValue: 'Круговая' }
]

@Component({
  selector: 'app-statistic-chart',
  templateUrl: './statistic-chart.component.html',
  styleUrls: ['./statistic-chart.component.css']
})
export class StatisticChartComponent implements OnInit {
  @Input() etalonChartConfig: ChartConfig;
  @Output() eventLoadReport = new EventEmitter<number>();
  @Output() eventLoadFullReport = new EventEmitter<number>();
  workingChartConfig: ChartConfig;

  chartTypes = CHART_TYPES;
  public barChartPlugins = [];

  constructor() {}

  ngOnInit() {
    this.workingChartConfig = ChartConfig.clone(this.etalonChartConfig);
  }

  refreshDisplayData(datasets: (StatisticPoint[])[], valFirst, valSecond) {
    for (let index = 0; index < datasets.length; index++) {
      if(datasets[index] != null) {
        this.etalonChartConfig.barChartData[index].data = datasets[index].map(
          (el: StatisticPoint) => el.value);
      }
    }

    this.etalonChartConfig.titleValueFirst = valFirst;
    this.etalonChartConfig.titleValueSecond = valSecond;

    if(datasets[0] != null) {
      this.etalonChartConfig.barChartLabels = datasets[0].map(
        (el: StatisticPoint) => {
          if(el.dateLabel != null && isNaN(el.dateLabel.getDate()) == false) {
            return new DatePipe('en-US').transform(el.dateLabel, 'dd.MM.yy')
          }
          else {
            return el.label
          }
        });
    }

    this.onTypeChange();
  }

  onTypeChange() {
    const type: ChartType = this.workingChartConfig.chartType;
    let chartConfig: ChartConfig = null;
    if(type == UsedChartType.doughnut) {
      chartConfig = ChartConfig.clone(this.etalonChartConfig);
      chartConfig.chartType = type;

      chartConfig.barChartData.forEach((dataset: ChartDataSets) => {
        //@ts-ignore
        dataset.data = [dataset.data.reduce((summ, el) => summ + el, 0)];
      });

      chartConfig.barChartData = [{
        //@ts-ignore
        data: [chartConfig.barChartData[0].data[0], chartConfig.barChartData[1].data[0]]
      }];

      chartConfig.lineChartColors.map(el => el.backgroundColor)
      chartConfig.lineChartColors = [{
        //@ts-ignore
        backgroundColor: chartConfig.lineChartColors.map(el => el.backgroundColor),
      }];

      chartConfig.barChartLabels = this.etalonChartConfig.barChartData.map(el => el.label);
    }
    else {
      chartConfig = ChartConfig.clone(this.etalonChartConfig);
      chartConfig.chartType = type;
    }

    this.workingChartConfig = chartConfig;
  }

  loadReport() {
    this.eventLoadReport.emit(1);
  }

  loadFullReport() {
    this.eventLoadFullReport.emit(1);
  }

}
