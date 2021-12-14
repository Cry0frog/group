import { Commission } from './../../../../../models/payment/commission';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-delete-commission',
  templateUrl: './delete-commission.component.html',
  styleUrls: ['./delete-commission.component.css']
})
export class DeleteCommissionComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteCommissionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Commission) { }

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
