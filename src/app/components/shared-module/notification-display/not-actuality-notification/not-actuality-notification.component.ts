import { Notification } from 'src/app/models/notification/notification';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
import { NotificationType } from 'src/app/models/notification/notificationType';

@Component({
  selector: 'app-not-actuality-notification',
  templateUrl: './not-actuality-notification.component.html',
  styleUrls: ['./not-actuality-notification.component.css']
})
export class NotActualityNotificationComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NotActualityNotificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Notification) { }

  ngOnInit() {
  }

  isTaskNotification() {
    return this.data.type == NotificationType.TASK_CREATED || this.data.type == NotificationType.TASK_CHANGED ? this.data.type : "";
  }

  isVacancyNotification() {
    return this.data.type == NotificationType.VACANCY_CREATED ? this.data.type : "";
  }

}
