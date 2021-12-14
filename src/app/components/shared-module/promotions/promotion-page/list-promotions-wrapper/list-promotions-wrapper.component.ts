import { ShortPromotion } from 'src/app/models/promotion/shortPromotion';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common/services/common.service';

@Component({
  selector: 'app-list-promotions-wrapper',
  templateUrl: './list-promotions-wrapper.component.html',
  styleUrls: ['./list-promotions-wrapper.component.css']
})
export class ListPromotionsWrapperComponent implements OnInit {
  promotions: ShortPromotion[];

  constructor(private commonService: CommonService) {
    this.promotions = [];
   }

  ngOnInit() {
    this.getAllPromotions();
  }

  getAllPromotions() {
    this.commonService.getAllPromotions().subscribe((data: ShortPromotion[]) => {
      if(data != null) {
        this.promotions = data;
      }
    });
  }

}
