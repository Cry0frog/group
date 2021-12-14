import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-support-layout',
  templateUrl: './support-layout.component.html',
})
export class SupportLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.scrollTo(0,0);
  }

}
