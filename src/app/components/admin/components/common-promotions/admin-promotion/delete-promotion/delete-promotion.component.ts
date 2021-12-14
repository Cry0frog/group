import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
import { ShortPromotion } from 'src/app/models/promotion/shortPromotion';

@Component({
  selector: 'app-delete-promotion',
  templateUrl: './delete-promotion.component.html',
  styleUrls: ['./delete-promotion.component.css']
})
export class DeletePromotionComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeletePromotionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShortPromotion) {}


  ngOnInit() {
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
