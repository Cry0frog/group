import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-advertising',
  templateUrl: './delete-advertising.component.html',
  styleUrls: ['./delete-advertising.component.css']
})
export class DeleteAdvertisingComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteAdvertisingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
