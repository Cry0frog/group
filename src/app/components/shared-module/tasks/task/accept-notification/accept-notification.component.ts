import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-accept-notification',
  templateUrl: './accept-notification.component.html',
  styleUrls: ['./accept-notification.component.css']
})
export class AcceptNotificationComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AcceptNotificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
