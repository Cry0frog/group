import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { ShortPromotion } from 'src/app/models/promotion/shortPromotion';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-promotion-wrapper',
  templateUrl: './my-promotion-wrapper.component.html',
  styleUrls: ['./my-promotion-wrapper.component.css']
})
export class MyPromotionWrapperComponent implements OnInit {

  promotion: ShortPromotion;

  constructor(private partnerService: PartnerService) {
      this.promotion = new ShortPromotion();
  }

  ngOnInit() {
    this.getPromotion();
  }

  getPromotion() {
    this.partnerService.getMyPromotion().subscribe((data: ShortPromotion) => {
      if(data != null) {
        this.promotion = data;
      }
    });
  }
}
