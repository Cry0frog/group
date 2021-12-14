import { Task } from 'src/app/models/task/task';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-cancel-task',
  templateUrl: './cancel-task.component.html',
  styleUrls: ['./cancel-task.component.css']
})
export class CancelTaskComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CancelTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
