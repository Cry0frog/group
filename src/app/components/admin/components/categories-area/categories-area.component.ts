import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActiveUrls } from 'src/app/auth/activeUrls';
import { UrlResolver } from 'src/app/components/partner/common/urlResolver';

@Component({
  selector: 'app-categories-area',
  templateUrl: './categories-area.component.html',
  styleUrls: ['./categories-area.component.css']
})
export class CategoriesAreaComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    const url = UrlResolver.getMainSectionFromUrl(this.router.url);
    // @ts-ignore
    document.querySelectorAll(`.user-panel .${url}`)[0].checked = true;
  }


  switchToCategories() {
    this.router.navigate([ActiveUrls.ADMIN_CATEGORIES]);
  }

  switchToFieldsActivity() {
    this.router.navigate([ActiveUrls.ADMIN_FILDS_ACIVITY]);
  }
}
