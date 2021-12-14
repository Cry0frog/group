import { ShortResume } from 'src/app/models/resume/shortResume';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-resume',
  templateUrl: './delete-resume.component.html',
  styleUrls: ['./delete-resume.component.css']
})
export class DeleteResumeComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteResumeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShortResume) { }

  ngOnInit() {
  }

}
