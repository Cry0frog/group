import { CommonService } from './../../../../../common/services/common.service';
import { ShortPromotion } from './../../../../../models/promotion/shortPromotion';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-list-promotions-wrapper',
  templateUrl: './my-list-promotions-wrapper.component.html',
  styleUrls: ['./my-list-promotions-wrapper.component.css']
})
export class MyListPromotionsWrapperComponent implements OnInit {
  promotions: ShortPromotion[];

  constructor(private commonService: CommonService) {
    this.promotions = [];
   }

  ngOnInit() {
    this.getAllPromotionsWithPromoCode();
  }

  getAllPromotionsWithPromoCode() {
    this.commonService.getAllPromotionsWithPromoCode().subscribe((data: ShortPromotion[]) => {
      if(data != null) {
        this.promotions = data;
      }
    });
  }

}
