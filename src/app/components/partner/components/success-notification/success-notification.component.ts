import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-success-notification',
  templateUrl: './success-notification.component.html',
  styleUrls: ['./success-notification.component.css']
})
export class SuccessNotificationComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SuccessNotificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit() {}

  contue(): void {
    this.dialogRef.close(true);
  }
}
