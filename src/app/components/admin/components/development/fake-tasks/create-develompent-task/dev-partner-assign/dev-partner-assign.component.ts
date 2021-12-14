import { DevelopmentPartner } from 'src/app/models/development/developmentPartner';
import { PlannedTask } from './../../../../../../../models/development/plannedTask';
import { Component, OnInit, Input } from '@angular/core';
import { DateTimeStr } from 'src/app/models/common/dateTimeStr';

@Component({
  selector: 'app-dev-partner-assign',
  templateUrl: './dev-partner-assign.component.html',
  styleUrls: ['./dev-partner-assign.component.css']
})
export class DevPartnerAssignComponent implements OnInit {
  @Input() developmentPartners: DevelopmentPartner[];
  @Input() plannedTask: PlannedTask;

  choosenPartner: DevelopmentPartner;
  choosenRequesters: DevelopmentPartner[];

  timeToSelectingPerformer: DateTimeStr;
  timeTaskToInProgress: DateTimeStr;
  timeToFinishingTask: DateTimeStr;

  constructor() {}

  ngOnInit() {
    this.choosenRequesters = [];
    this.timeToSelectingPerformer = DateTimeStr.createBasedOnCurDate();
    this.timeTaskToInProgress = DateTimeStr.createBasedOnCurDate();
    this.timeToFinishingTask = DateTimeStr.createBasedOnCurDate();
  }

  getDevPartnersWithoutCreator(): DevelopmentPartner[] {
    return this.getSortDevelopmentPartner(this.developmentPartners.filter(el => this.choosenPartner == null ||
      this.choosenPartner.id != el.id
    ));
  }

  getSortDevelopmentPartner(developmentPartners): DevelopmentPartner[] {
    return developmentPartners.sort((a: any, b: any) => {
      if(a.fio < b.fio) { return -1; }
      if(a.fio > b.fio) { return 1; }
      return 0;
    });
  }

}
