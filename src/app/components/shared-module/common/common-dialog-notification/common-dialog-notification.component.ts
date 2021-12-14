import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-common-dialog-notification',
  templateUrl: './common-dialog-notification.component.html',
  styleUrls: ['./common-dialog-notification.component.css']
})
export class CommonDialogNotificationComponent implements OnInit {

  constructor(public router: Router,
    public dialogRef: MatDialogRef<CommonDialogNotificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: String) {}

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}