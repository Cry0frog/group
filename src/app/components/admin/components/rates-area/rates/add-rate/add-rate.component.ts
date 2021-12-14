import { RU_CALENDAR } from './../../../../../../common/localization';
import { WEIGHT_CATEGORY_MAPPER, TRANSPORT_CATEGORY_MAPPER, DISTANCE_TYPE_MAPPER, PRODUCT_CATEGORY_MAPPER } from './../../../../../../common/task.description';
import { RATE_TYPE_MAPPER,  } from './../../../../common/admin.descriptions';
import { Rate } from './../../../../../../models/rates/rate';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';

@Component({
  selector: 'app-add-rate',
  templateUrl: './add-rate.component.html',
  styleUrls: ['./add-rate.component.css']
})
export class AddRateComponent implements OnInit {
  @ViewChild('calendar', {static: true}) calendar: any;

  @ViewChild('calendarStartWindow', {static: true}) calendarStartWindow: any;
  @ViewChild('calendarEndWindow', {static: true}) calendarEndWindow: any;

  rateTypesMapper = RATE_TYPE_MAPPER;
  weightCategoryMapper = WEIGHT_CATEGORY_MAPPER;
  transportCategoryMapper = TRANSPORT_CATEGORY_MAPPER;
  productCategoryMapper = PRODUCT_CATEGORY_MAPPER;
  distanceTypeMapper = DISTANCE_TYPE_MAPPER;
  ru_calendar = RU_CALENDAR;

  constructor(public dialogRef: MatDialogRef<AddRateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Rate) { }

  ngOnInit() {
  }

  onFocusDate() {
    this.calendar.showOverlay(this.calendar.inputfieldViewChild.nativeElement);
  }

  onChangeFocusDate() {
    //this.calendar.hideOverlay(this.calendar.inputfieldViewChild.nativeElement);
  }

  /* calendarStartWindow */
  onFocusStartWindow() {
    this.calendarStartWindow.showOverlay(this.calendarStartWindow.inputfieldViewChild.nativeElement);
  }

  onChangeFocusStartWindow() {
    //this.calendarStartWindow.hideOverlay(this.calendarStartWindow.inputfieldViewChild.nativeElement);
  }

  /* calendarEndWindow */
  onFocusEndWindow() {
    this.calendarEndWindow.showOverlay(this.calendarEndWindow.inputfieldViewChild.nativeElement);
  }

  onChangeFocusEndWindow() {
    //this.calendarEndWindow.hideOverlay(this.calendarEndWindow.inputfieldViewChild.nativeElement);
  }
  /**/


  onNoClick(): void {
    this.dialogRef.close();
  }
}
