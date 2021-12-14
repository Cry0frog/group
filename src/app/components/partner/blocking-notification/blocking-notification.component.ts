import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-blocking-notification',
  templateUrl: './blocking-notification.component.html',
  styleUrls: ['./blocking-notification.component.css']
})
export class BlockingNotificationComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<BlockingNotificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
