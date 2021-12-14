import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common/services/common.service';
import { ShortNews } from 'src/app/models/news/shortNews';

@Component({
  selector: 'app-news-page',
  templateUrl: './news-page.component.html',
  styleUrls: ['./news-page.component.css']
})
export class NewsPageComponent implements OnInit {
  currentNews: ShortNews;
  lastNews: ShortNews[];
  newsId: number;

  constructor(private commonService: CommonService,
    public route: ActivatedRoute) {
    this.currentNews = new ShortNews();
    this.lastNews = [];
   }

  ngOnInit() {
    window.scrollTo(0,0);
    this.newsId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.getNews();
    this.getLastNews();
  }

  getNews() {
    this.commonService.getNews(this.newsId).subscribe(data => {
      this.currentNews = data;
    })
  }

  getLastNews() {
    this.commonService.getLastsNews().subscribe(data => {
      this.lastNews = data.sort((a: ShortNews, b: ShortNews) => b.id - a.id);
    });
  }

}
