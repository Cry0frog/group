import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-field-category',
  templateUrl: './delete-field-category.component.html',
  styleUrls: ['./delete-field-category.component.css']
})
export class DeleteFieldCategoryComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteFieldCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number) { }

  ngOnInit() {
  }

}
