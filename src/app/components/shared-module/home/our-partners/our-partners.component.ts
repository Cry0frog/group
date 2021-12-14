import { SessionStorageService } from 'angular-web-storage';
import { Component, OnInit, HostListener } from '@angular/core';
import { PartnerInfoWithCity } from 'src/app/models/partnerInfo/partnerInfoWithCity';
import { CommonService } from 'src/app/common/services/common.service';
import { PageableParams } from 'src/app/models/pageable/PageableParams';
import { LegalEntityInfo } from 'src/app/models/legal-entity-info/legalEntityInfo';
import { PlaceAdvertising } from 'src/app/models/advertising/common/placeAdvertising';

@Component({
  selector: 'app-our-partners',
  templateUrl: './our-partners.component.html',
  styleUrls: ['./our-partners.component.css']
})
export class OurPartnersComponent implements OnInit {
  shortMembers: PartnerInfoWithCity[];
  shortLegalEntitesMembers: LegalEntityInfo[];
  pageable: PageableParams;
  isLoadAll: boolean;

  isLegalEntity: boolean;

  memberInfo: PartnerInfoWithCity;
  legalEntityMemberInfo: LegalEntityInfo;

  place: PlaceAdvertising;

  constructor(private commonService: CommonService,
    private sessionStorage: SessionStorageService) {
    this.isLegalEntity = false;
    this.shortMembers = [];
    this.shortLegalEntitesMembers = [];
    this.memberInfo = new PartnerInfoWithCity();
    this.legalEntityMemberInfo = new LegalEntityInfo();
    this.isLoadAll = false;
    this.pageable = new PageableParams();
    this.place = PlaceAdvertising.MEMBERS;
  }

  ngOnInit() {
    this.getShortPartnerInfos();
    this.getLegalEntitesInfos();
  }

  openMemberInfo(member: PartnerInfoWithCity) {
    if(this.shortLegalEntitesMembers.filter(a => a.id === member.idPartner).length == 0) {
      this.isLegalEntity = false;
    }
    else {
      this.isLegalEntity = true;
      this.legalEntityMemberInfo = this.shortLegalEntitesMembers.find(el => el.id === member.idPartner);
    }

    this.memberInfo = member;
  }

  isEmptyId(): boolean {
    return this.memberInfo.idPartner == null;
  }

  getShortPartnerInfos() {
    this.commonService.getAllShortInfoMembers(this.pageable).subscribe((data: PartnerInfoWithCity[]) => {
      this.shortMembers = data;
    });
  }

  getLegalEntitesInfos() {
    this.commonService.getAllShortLegalEntitesMembers(this.pageable).subscribe((data: LegalEntityInfo[]) => {
      this.shortLegalEntitesMembers = data;
    });
  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight - 1;
    if(pos >= max && !this.isLoadAll && this.pageable.size<=this.shortMembers.length) {
      this.handleLoadMore();
    }
  }

  handleLoadMore() {
    this.pageable.page++;
    this.commonService.getAllShortInfoMembers(this.pageable).subscribe((data: PartnerInfoWithCity[]) => {
      data.forEach(el => {
        this.shortMembers.push(el);
      })
      if(data.length < this.pageable.size) {
        this.isLoadAll = true;
      }
    });
  }
}
