import { ShortNews } from 'src/app/models/news/shortNews';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-news',
  templateUrl: './delete-news.component.html',
  styleUrls: ['./delete-news.component.css']
})
export class DeleteNewsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteNewsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShortNews) {}


  ngOnInit() {
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
