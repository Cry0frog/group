import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-early-completion-task',
  templateUrl: './early-completion-task.component.html',
  styleUrls: ['./early-completion-task.component.css']
})
export class EarlyCompletionTaskComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EarlyCompletionTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
