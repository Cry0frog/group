import { Rate } from './../../../../../../models/rates/rate';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-delete-rate',
  templateUrl: './delete-rate.component.html',
  styleUrls: ['./delete-rate.component.css']
})
export class DeleteRateComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteRateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Rate) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
