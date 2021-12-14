import { ShortPromotion } from 'src/app/models/promotion/shortPromotion';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-promotions',
  templateUrl: './list-promotions.component.html',
  styleUrls: ['./list-promotions.component.css']
})
export class ListPromotionsComponent implements OnInit {
  @Input() promotions: ShortPromotion[];

  constructor() {}

  ngOnInit() {
    window.scrollTo(0,0);
  }
}
