import { ShortPromotion } from 'src/app/models/promotion/shortPromotion';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/common/services/common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promotion-wrapper',
  templateUrl: './promotion-wrapper.component.html',
  styleUrls: ['./promotion-wrapper.component.css']
})
export class PromotionWrapperComponent implements OnInit {
  promoId: number;
  promotion: ShortPromotion;

  constructor(private commonService: CommonService,
    private route: ActivatedRoute) {
      this.promotion = new ShortPromotion();
  }

  ngOnInit() {
    this.promoId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.getPromotion();
  }

  getPromotion() {
    this.commonService.getPromotion(this.promoId).subscribe((data: ShortPromotion) => {
      if(data != null) {
        this.promotion = data;
      }
    });
  }

}
