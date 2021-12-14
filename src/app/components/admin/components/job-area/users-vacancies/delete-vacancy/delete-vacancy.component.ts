import { ShortVacancy } from 'src/app/models/vacancy/shortVacancy';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-vacancy',
  templateUrl: './delete-vacancy.component.html',
  styleUrls: ['./delete-vacancy.component.css']
})
export class DeleteVacancyComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteVacancyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShortVacancy) { }

  ngOnInit() {
  }

}
