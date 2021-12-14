import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfig } from 'src/app/models/statistics/chartConfig';
import { StatisticResponse } from 'src/app/models/statistics/statisticResponse';
import { StatisticSettings } from 'src/app/models/statistics/statisticSettings';
import { AdminStatisticsService } from '../../../service/admin-statistics.service';
import { StatisticChartComponent } from '../common-statistics/statistic-chart/statistic-chart.component';
import { UsedChartType } from '../usedChartType';

@Component({
  selector: 'app-job-statistics',
  templateUrl: './job-statistics.component.html',
  styleUrls: ['./job-statistics.component.css']
})
export class JobStatisticsComponent implements OnInit {
  @ViewChild('newVacanciesChart', {static: false}) newVacanciesChart: StatisticChartComponent;
  @ViewChild('newDefResumeChart', {static: false}) newDefResumeChart: StatisticChartComponent;
  @ViewChild('submittedResumeChart', {static: false}) submittedResumeChart: StatisticChartComponent;


  configNewVacancy: ChartConfig;
  configNewDefResume: ChartConfig;
  configSubmittedResume: ChartConfig;
  settings: StatisticSettings;

  constructor(private statisticsService: AdminStatisticsService) {
    this.settings = new StatisticSettings();
  }

  ngOnInit() {
    this.refreshAllCharts();
  }

  refreshAllCharts() {
    this.configNewVacancy = StatisticSettings.buildCommonCharts(UsedChartType.bar,
      'Созданные вакансии',
      null,
      null,
      [{ data: [0], lineTension: 0, fill: false }],
      [''],
      false,
      [{ backgroundColor: '#0000FF', borderColor: '#0000FF' }],
      false,
      false
    );
    this.configNewDefResume = StatisticSettings.buildCommonCharts(UsedChartType.bar,
      'Созданные резюме',
      null,
      null,
      [{ data: [0], lineTension: 0, fill: false }],
      [''],
      false,
      [{ backgroundColor: '#FF0000', borderColor: '#FF0000' }],
      false,
      false
    );
    this.configSubmittedResume = StatisticSettings.buildCommonCharts(UsedChartType.bar,
      'Поданные резюме',
      null,
      null,
      [{ data: [0], lineTension: 0, fill: false }],
      [''],
      false,
      [{ backgroundColor: '#FF0000', borderColor: '#FF0000' }],
      false,
      false
    );
  }

  applyStatisticSettings() {
    this.reloadAllCharts(this.settings);
  }

  reloadAllCharts(settings: StatisticSettings) {
    this.reloadNewVacanciesChart(settings);
    this.reloadNewDefResumeChart(settings);
    this.reloadSubmittedResumeChart(settings);
  }

  reloadNewVacanciesChart(settings: StatisticSettings) {
    this.statisticsService.getChartNewVacancies(settings).subscribe((resp: StatisticResponse) => {
      this.newVacanciesChart.refreshDisplayData([StatisticSettings.sortByTime(resp.statisticPoints)],
        StatisticSettings.calcSumm(resp.statisticPoints),
        null
      );
    });
  }

  reloadNewDefResumeChart(settings: StatisticSettings) {
    this.statisticsService.getChartNewDefResume(settings).subscribe((resp: StatisticResponse) => {
      this.newDefResumeChart.refreshDisplayData([StatisticSettings.sortByTime(resp.statisticPoints)],
        StatisticSettings.calcSumm(resp.statisticPoints),
        null
      );
    });
  }

  reloadSubmittedResumeChart(settings: StatisticSettings) {
    this.statisticsService.getSubmittedResumeChart(settings).subscribe((resp: StatisticResponse) => {
      this.submittedResumeChart.refreshDisplayData([StatisticSettings.sortByTime(resp.statisticPoints)],
        StatisticSettings.calcSumm(resp.statisticPoints),
        null
      );
    });
  }
}
