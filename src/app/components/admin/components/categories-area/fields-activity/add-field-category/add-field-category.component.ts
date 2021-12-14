import { FieldActivity } from './../../../../../../models/field-activity/fileldActivity';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-field-category',
  templateUrl: './add-field-category.component.html',
  styleUrls: ['./add-field-category.component.css']
})
export class AddFieldCategoryComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddFieldCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FieldActivity) { }

  ngOnInit() {
  }

}
