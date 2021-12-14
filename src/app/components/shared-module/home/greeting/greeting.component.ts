import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-greeting',
  templateUrl: './greeting.component.html',
  styleUrls: ['./greeting.component.css']
})
export class GreetingComponent implements OnInit {
  isAppearanceText: boolean;
  isAppearanceImg: boolean;
  isAppearanceBtn: boolean;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.isAppearanceImg = true;
      setTimeout(() => {
        this.isAppearanceText = true;
        setTimeout(() => this.isAppearanceBtn = true, 1500);
      }, 1500)
    }, 200)
  }

  activeHref() {
    window.location.href = "/";
  }

}
