import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-registration-not',
  templateUrl: './registration-not.component.html',
  styleUrls: ['./registration-not.component.css']
})
export class RegistrationNotComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RegistrationNotComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
