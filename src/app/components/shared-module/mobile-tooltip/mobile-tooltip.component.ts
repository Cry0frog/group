import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-mobile-tooltip',
  templateUrl: './mobile-tooltip.component.html',
  styleUrls: ['./mobile-tooltip.component.css']
})
export class MobileTooltipComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MobileTooltipComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit() {
    setTimeout(() => this.dialogRef.close(), 5000);
  }
}
