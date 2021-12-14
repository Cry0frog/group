import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.css']
})
export class NotFoundPageComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
    if(!this.router.url.match('not_found')) {
      window.open(`/not_found`, '_self');
    }
  }

}
