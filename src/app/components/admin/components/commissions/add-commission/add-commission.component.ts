import { RU_CALENDAR } from './../../../../../common/localization';
import { Commission } from './../../../../../models/payment/commission';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';

@Component({
  selector: 'app-add-commission',
  templateUrl: './add-commission.component.html',
  styleUrls: ['./add-commission.component.css']
})
export class AddCommissionComponent implements OnInit {
  @ViewChild('calendar', {static: true}) calendar: any;
  ru_calendar = RU_CALENDAR;

  constructor(public dialogRef: MatDialogRef<AddCommissionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Commission) { }

  ngOnInit() {}

  onFocusDate() {
    this.calendar.showOverlay(this.calendar.inputfieldViewChild.nativeElement);
  }

  onChangeFocusDate() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
