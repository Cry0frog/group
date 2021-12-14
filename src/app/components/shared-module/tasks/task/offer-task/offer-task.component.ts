import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-offer-task',
  templateUrl: './offer-task.component.html',
  styleUrls: ['./offer-task.component.css']
})
export class OfferTaskComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<OfferTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
