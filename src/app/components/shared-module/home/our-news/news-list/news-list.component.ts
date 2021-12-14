import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common/services/common.service';
import { ShortNews } from 'src/app/models/news/shortNews';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit {


  newsList: ShortNews[];

  constructor(private commonService: CommonService) {
    this.newsList = [];
  }

  ngOnInit() {
    this.getAllNews();
  }

  getAllNews() {
    this.commonService.getAllNews().subscribe((data: ShortNews[]) => {
      this.newsList = data.sort((a, b) =>  b.id - a.id);
    });
  }
}
