import { Router } from '@angular/router';
import { ActiveUrls } from 'src/app/auth/activeUrls';
import { SessionStorageService } from 'angular-web-storage';
import { AuthService } from './../../../../auth/auth.service';
import { PartnerService } from './../../../partner/service/partner.service';
import { ShortPartnerPromotion } from './../../../../models/promotion/shortPartnerPromotion';
import { ShortPromotion } from 'src/app/models/promotion/shortPromotion';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.css']
})
export class PromotionComponent implements OnInit {

  @Input() promoId: number;
  @Input() promotion: ShortPromotion;
  @Input() partnerMode: boolean;

  currentPartnerPromotion: ShortPartnerPromotion;

  constructor(private partnerService: PartnerService,
    private sanitizer: DomSanitizer,
    private sessionStorage: SessionStorageService,
    public router: Router,
    private authService: AuthService) {
      this.currentPartnerPromotion = new ShortPartnerPromotion();
  }

  ngOnInit() {
    window.scrollTo(0,0);

    if(this.authService.LoggedUser.creatorId != null && this.promoId != null) {
      this.getPartnerPromotion();
    }
  }

  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.promotion.description);
  }

  getPartnerPromotion() {
    this.partnerService.getCurrentPartnerSharedCode(this.promoId).subscribe((data: ShortPartnerPromotion) => {
      if(data != null) {
        this.currentPartnerPromotion = data;
      }
    });
  }

  participatePromotion() {
    if(this.authService.LoggedUser.authenticated == null || !this.authService.LoggedUser.authenticated) {
      this.sessionStorage.set(AuthService.backUrlName, `${ActiveUrls.PROMOTION}/${this.promoId}`);
      this.router.navigateByUrl('/login');
      return;
    }

    this.partnerService.partnerParticipatePromotion(this.promoId).subscribe((data: ShortPartnerPromotion) => {
      if(data != null) {
        this.currentPartnerPromotion = data;
      }
    });
  }

  isEmptyCode(): boolean {
    return this.currentPartnerPromotion.generatedCode == null;
  }

  isEmptyPartnerPromo(): boolean {
    return this.promotion.id != this.currentPartnerPromotion.promotion.id
  }

}
