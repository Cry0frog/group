import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-resume-not-enough-money',
  templateUrl: './resume-not-enough-money.component.html',
  styleUrls: ['./resume-not-enough-money.component.css']
})
export class ResumeNotEnoughMoneyComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ResumeNotEnoughMoneyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number) { }

  ngOnInit() {}

  goToPayEnough() {
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
