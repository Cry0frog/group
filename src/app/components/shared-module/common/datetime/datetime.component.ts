import { RU_CALENDAR } from './../../../../common/localization';
import { Component, OnInit, Input } from '@angular/core';
import { DateTimeStr } from 'src/app/models/common/dateTimeStr';

@Component({
  selector: 'app-datetime',
  templateUrl: './datetime.component.html',
  styleUrls: ['./datetime.component.css']
})
export class DatetimeComponent implements OnInit {
  @Input() dateTimeObj: DateTimeStr;
  
  ru_calendar = RU_CALENDAR;

  constructor() { }

  ngOnInit() {}

}
