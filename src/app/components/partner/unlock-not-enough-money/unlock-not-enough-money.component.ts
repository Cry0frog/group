import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UnlockUser } from 'src/app/models/blocked-user/unlock/unlockUser';

@Component({
  selector: 'app-unlock-not-enough-money',
  templateUrl: './unlock-not-enough-money.component.html',
  styleUrls: ['./unlock-not-enough-money.component.css']
})
export class UnlockNotEnoughMoneyComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UnlockNotEnoughMoneyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UnlockUser) { }

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
