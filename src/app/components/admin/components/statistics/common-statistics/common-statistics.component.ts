import { StatisticPoint } from './../../../../../models/statistics/statisticPoint';
import { StatisticChartComponent } from './statistic-chart/statistic-chart.component';
import { StatisticResponse } from './../../../../../models/statistics/statisticResponse';
import { AdminStatisticsService } from './../../../service/admin-statistics.service';
import { StatisticSettings } from './../../../../../models/statistics/statisticSettings';
import { ChartDataSets } from 'chart.js';
import { AdminService } from './../../../service/admin.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Color, Label } from 'ng2-charts';
import { ChartConfig } from 'src/app/models/statistics/chartConfig';
import { GeoService } from 'src/app/services/geo.service';
import { UsedChartType } from '../usedChartType';

@Component({
  selector: 'app-common-statistics',
  templateUrl: './common-statistics.component.html',
  styleUrls: ['./common-statistics.component.css']
})
export class CommonStatisticsComponent implements OnInit {
  //
  @ViewChild('userActivityChart', {static: false}) chartUserActivity: StatisticChartComponent;
  @ViewChild('allOrdersChart', {static: false}) chartAllOrders: StatisticChartComponent;
  @ViewChild('averageCheck', {static: false}) chartAverageCheck: StatisticChartComponent;
  @ViewChild('numberOfSales', {static: false}) chartNumberOfSales: StatisticChartComponent;
  @ViewChild('revenue', {static: false}) chartRevenue: StatisticChartComponent;
  @ViewChild('payout', {static: false}) chartPayout: StatisticChartComponent;
  @ViewChild('countReg', {static: false}) chartCountReg: StatisticChartComponent;
  @ViewChild('surveyResult', {static: false}) chartSurveyResult: StatisticChartComponent;

  configActivityUsers: ChartConfig;
  configCountOfOrders: ChartConfig;
  configAverageCheck: ChartConfig;
  configNumberOfSales: ChartConfig;
  configRevenue: ChartConfig;
  configPayout: ChartConfig;
  configCountReg: ChartConfig;
  configSurveyResult: ChartConfig;

  settings: StatisticSettings;

  constructor(private adminService: AdminService,
    private statisticsService: AdminStatisticsService,
    private geoService: GeoService
  ) {
    this.settings = new StatisticSettings();
  }

  ngOnInit() {
    this.refreshAllCharts();
  }

  refreshAllCharts() {
    this.configCountReg = StatisticSettings.buildCommonCharts(UsedChartType.bar,
      'Количество регистраций',
      null,
      null,
      [
        { data: [0], label: 'Заказчики', lineTension: 0, fill: false },
        { data: [0], label: 'Исполнители', lineTension: 0, fill: false }
      ],
      [],
      true,
      [
        { backgroundColor: '#FF0000', borderColor: '#FF0000' },
        { backgroundColor: '#5893D4', borderColor: '#5893D4' }

      ],
      true,
      true
    );

    this.configActivityUsers = StatisticSettings.buildCommonCharts(UsedChartType.line,
      'Активность пользователей',
      null,
      null,
      [{ data: [0], label: 'По всем', lineTension: 0, fill: false }],
      [''],
      false,
      //[{ backgroundColor: 'red', borderColor: 'red', }, { backgroundColor: '#0000FF', borderColor: '#0000FF' }]
      [{ backgroundColor: '#0000FF', borderColor: '#0000FF' }],
      false,
      false
    );

    this.configCountOfOrders = StatisticSettings.buildCommonCharts(UsedChartType.bar,
      'Количество заказов',
      '0', //'12 231',
      null,
      [{ data: [], lineTension: 0, fill: false }],
      [],
      false,
      [{ backgroundColor: '#FF8000', borderColor: '#FF8000' }],
      true,
      false
    );

    this.configAverageCheck = StatisticSettings.buildCommonCharts(UsedChartType.line,
      'Средний чек',
      '0',
      null,
      [{ data: [], lineTension: 0, fill: false }],
      [],
      false,
      [{ backgroundColor: '#27C102', borderColor: '#27C102' }],
      true,
      false
    );

    this.configNumberOfSales = StatisticSettings.buildCommonCharts(UsedChartType.doughnut,
      'Количество продаж',
      '0',
      '0',
      [
        { data: [0], label: 'Общее число продаж', lineTension: 0, fill: false },
        { data: [0], label: 'Число продаж в выбранной категории', lineTension: 0, fill: false }
      ],
      ['Общее число продаж', 'Число продаж в выбранной категории'],
      true,
      [
        { backgroundColor: '#DCDCDC', borderColor: '#DCDCDC' },
        { backgroundColor: '#5893D4', borderColor: '#5893D4' }
      ],
      true,
      false
    );

    this.configRevenue = StatisticSettings.buildCommonCharts(UsedChartType.line,
      'Выручка',
      '0',
      null,
      [{ data: [], lineTension: 0, fill: false }],
      [],
      false,
      [{ backgroundColor: '#FF4C4A', borderColor: '#FF4C4A' }],
      true,
      false
    );

    this.configPayout = StatisticSettings.buildCommonCharts(UsedChartType.line,
      'Выплаты',
      '0',
      null,
      [{ data: [], lineTension: 0, fill: false }],
      [],
      false,
      [{ backgroundColor: '#B20083', borderColor: '#B20083' }],
      true,
      false
    );

    this.configSurveyResult = StatisticSettings.buildCommonCharts(UsedChartType.bar,
      'Опрос',
      null,
      null,
      [{ data: [], lineTension: 0, fill: false }],
      [],
      false,
      [{ backgroundColor: '#FF0000', borderColor: '#FF0000' }],
      false, false
    );

  }

  applyStatisticSettings() {
    this.reloadAllCharts(this.settings);
  }

  reloadAllCharts(settings: StatisticSettings) {
    this.reloadChartActivityUsers(settings);
    this.reloadChartCountOfOrders(settings);
    this.reloadChartAverageCheck(settings);
    this.reloadChartNumberOfSales(settings);

    this.reloadChartRevenue(settings);
    this.reloadChartPayout(settings);
    this.reloadChartCountReg(settings);
    this.reloadChartSurveyResult(settings);
  }

  reloadChartActivityUsers(settings: StatisticSettings) {
    this.statisticsService.getChartActivityUsers(settings).subscribe((resp: StatisticResponse) => {
      this.chartUserActivity.refreshDisplayData([StatisticSettings.sortByTime(resp.statisticPoints)],
        null,
        null
      );
    });
  }

  reloadChartCountOfOrders(settings: StatisticSettings) {
    this.statisticsService.getChartCountOfOrders(settings).subscribe((resp: StatisticResponse) => {
      this.chartAllOrders.refreshDisplayData([StatisticSettings.sortByTime(resp.statisticPoints)],
        StatisticSettings.calcSumm(resp.statisticPoints),
        null
      );
    });
  }

  reloadChartAverageCheck(settings: StatisticSettings) {
    this.statisticsService.getChartAverageCheck(settings).subscribe((resp: StatisticResponse) => {
      this.chartCountReg.refreshDisplayData([StatisticSettings.sortByTime(resp.statisticPoints)],
        null,
        null);
    });
  }

  reloadChartNumberOfSales(_settings: StatisticSettings) {
    const settings = StatisticSettings.clone(_settings);
    if(settings.categoryIds.length == 0) {
      let pointsForAll: StatisticPoint[] = null,
        pointsForCategory: StatisticPoint[] = null;

      this.statisticsService.getChartNumberOfSalesSuccess(settings).subscribe((resp: StatisticResponse) => {
        pointsForCategory = StatisticSettings.sortByTime(resp.statisticPoints);
        if(pointsForAll != null) {
          this.chartNumberOfSales.refreshDisplayData([pointsForAll, pointsForCategory],
            StatisticSettings.calcSumm(pointsForAll),
            StatisticSettings.calcSumm(pointsForCategory)
          );
        }
      });

      settings.categoryIds.length == 0;
      this.statisticsService.getChartNumberOfSalesSuccess(settings).subscribe((resp: StatisticResponse) => {
        pointsForAll = StatisticSettings.sortByTime(resp.statisticPoints);
        if(pointsForCategory != null) {
          this.chartNumberOfSales.refreshDisplayData([pointsForAll, pointsForCategory],
            StatisticSettings.calcSumm(pointsForAll),
            StatisticSettings.calcSumm(pointsForCategory)
          );
        }
      });
    }
    else {
      this.statisticsService.getChartNumberOfSalesSuccess(settings).subscribe((resp: StatisticResponse) => {
        this.chartNumberOfSales.refreshDisplayData([StatisticSettings.sortByTime(resp.statisticPoints)],
          StatisticSettings.calcSumm(resp.statisticPoints),
          null
        );
      });
    }

  }

  getStatisticByCountOfOrders(event) {
    this.statisticsService.getStatisticReportByCountOfOrders(this.settings);
  }

  getStatisticByAverageCheck(event) {
    this.statisticsService.getStatisticReportByAverageCheck(this.settings);
  }

  getStatisticByNumberOfSales(event) {
    this.statisticsService.getStatisticReportByNumberOfSales(this.settings);
  }

  getStatisticReportForRevenue(event) {
    this.statisticsService.getStatisticReportByRevenue(this.settings);
  }

  getStatisticReportForPayout(event) {
    this.statisticsService.getStatisticReportByPayout(this.settings);
  }

  getStatisticReportForReg(event) {
    this.statisticsService.getStatisticReportRegistration(this.settings);
    this.statisticsService.getStatisticReportRegistrationPerformers(this.settings);
  }

  getStatisticFullReportForReg(event) {
    this.statisticsService.getStatisticFullReportRegistration(this.settings);
  }

  reloadChartRevenue(settings: StatisticSettings) {
    this.statisticsService.getChartRevenue(settings).subscribe((resp: StatisticResponse) => {
      this.chartRevenue.refreshDisplayData([StatisticSettings.sortByTime(resp.statisticPoints)],
        Math.round(StatisticSettings.calcSumm(resp.statisticPoints)) + ' Р',
        null);
    });
  }

  reloadChartPayout(settings: StatisticSettings) {
    this.statisticsService.getChartPayout(settings).subscribe((resp: StatisticResponse) => {
      this.chartPayout.refreshDisplayData([StatisticSettings.sortByTime(resp.statisticPoints)],
        Math.round(StatisticSettings.calcSumm(resp.statisticPoints)) + ' Р',
        null);
    });
  }

  reloadChartCountReg(settings: StatisticSettings) {
    const _settings = StatisticSettings.clone(settings);
    let pointsForPartners: StatisticPoint[] = null,
    pointsForPerformers: StatisticPoint[] = null;

    this.statisticsService.getChartCountReg(settings).subscribe((resp: StatisticResponse) => {
      pointsForPartners = StatisticSettings.sortByTime(resp.statisticPoints)
      if(pointsForPartners != null) {
        this.chartCountReg.refreshDisplayData([pointsForPartners, pointsForPerformers],
          StatisticSettings.calcSumm(pointsForPartners),
          StatisticSettings.calcSumm(pointsForPerformers)
        );
      }
    });

    this.statisticsService.getChartCountRegPerformers(settings).subscribe((resp: StatisticResponse) => {
      pointsForPerformers = StatisticSettings.sortByTime(resp.statisticPoints)
      if(pointsForPerformers != null) {
        this.chartCountReg.refreshDisplayData([pointsForPartners, pointsForPerformers],
          StatisticSettings.calcSumm(pointsForPartners),
          StatisticSettings.calcSumm(pointsForPerformers)
        );
      }
    });
  }

  reloadChartSurveyResult(settings: StatisticSettings) {
    this.statisticsService.getChartSurveyResult(settings).subscribe((resp: StatisticResponse) => {
      this.chartSurveyResult.refreshDisplayData([this.sortByValue(resp.statisticPoints)],
        null,
        null);
    });
  }

  calcAvg(points: StatisticPoint[]): number {
    if(points.length == 0) {
      return 0;
    }
    return points.reduce((summ, el) => summ + el.value, 0) / points.length;
  }

  sortByValue(points: StatisticPoint[]) {
    return points.sort(
      (a: StatisticPoint, b: StatisticPoint) => (a.value < b.value) ? 1
        : (a.value === b.value) ? 0
        : -1);
  }
}
