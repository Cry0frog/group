import { Category } from 'src/app/models/category/category';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-preview-wrapper',
  templateUrl: './preview-wrapper.component.html',
  styleUrls: ['./preview-wrapper.component.css']
})
export class PreviewWrapperComponent implements OnInit {
  root: Category;
  child: Category;

  constructor(public dialogRef: MatDialogRef<PreviewWrapperComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.root = this.data.root;
    this.child = this.data.child;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
