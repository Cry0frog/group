import { AdminService } from './../../../service/admin.service';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { ShortPartnerPromotion } from 'src/app/models/promotion/shortPartnerPromotion';
import { ParticipantsPromotionWithCountedPages } from 'src/app/models/promotion/participantsPromotionWithCountedPages';
import { PageableParams } from 'src/app/models/pageable/PageableParams';

@Component({
  selector: 'app-list-request-share',
  templateUrl: './list-request-share.component.html',
  styleUrls: ['./list-request-share.component.css']
})
export class ListRequestShareComponent implements OnInit {
  participants: ShortPartnerPromotion[];
  isLoadAll: boolean;
  participantsPromotionsWithCountedPages: ParticipantsPromotionWithCountedPages;

  displayedColumns: string[] = ['username', 'code', 'name_promotion', 'status'];
  dataSource: MatTableDataSource<ShortPartnerPromotion>;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private adminService: AdminService) {
    this.participants = [];
    this.participantsPromotionsWithCountedPages = new ParticipantsPromotionWithCountedPages();
   }

  ngOnInit() {
    this.getAllParticipantsPromotions();
  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight - 1;
    if(pos >= max && !this.isLoadAll) {
      this.handleLoadMore();
    }
  }

  handleLoadMore() {
    ++this.participantsPromotionsWithCountedPages.pageableParams.page;
    this.getAllParticipantsPromotions();
  }

  getAllParticipantsPromotions() {
    this.adminService.getAllParticipantsPromotions(this.participantsPromotionsWithCountedPages).subscribe((data: ShortPartnerPromotion[]) => {
      this.isLoadAll = false;
      if(data.length < this.participantsPromotionsWithCountedPages.pageableParams.size) {
        this.isLoadAll = true;
      }

      this.makeSortAndRefresh(data);
      this.dataSource.sort = this.sort;
    });
  }

  getTooltipForStatus(result: boolean): string {
    if(result) {
      return "Оплачено за этого пользователя";
    }
    else {
      return "Не оплачено за этого пользователя";
    }
  }

  makeSortAndRefresh(data) {
    this.participants = this.participantsPromotionsWithCountedPages.pageableParams.page != 0 ? this.participants.concat(ShortPartnerPromotion.getShortPartnersShareInRows(data))
      : ShortPartnerPromotion.getShortPartnersShareInRows(data);
    this.refreshCandDisplay();
  }

  onRootDirectoryClick(row: ShortPartnerPromotion) {
    let isShow: boolean;
    if(row.isExpanded == true) {
      isShow = false;
    }
    else {
      isShow = true;
    }
    if(row.friends != null) {
      row.friends.forEach((friend: ShortPartnerPromotion) => friend.isShow = isShow);
    }
    row.isExpanded = !row.isExpanded;

    this.refreshCandDisplay();

  }

  refreshCandDisplay() {
    this.dataSource = new MatTableDataSource(this.participants.filter((partner: ShortPartnerPromotion) => partner.isShow));
  }

  isEmptyFriends(row: ShortPartnerPromotion): boolean {
    return row.friends == null || row.friends.length == 0;
  }

  applyFilter(filterValue: string) {
    filterValue === "" ? this.participantsPromotionsWithCountedPages.search = null : this.participantsPromotionsWithCountedPages.search = filterValue;
    this.participantsPromotionsWithCountedPages.search = filterValue;
    this.participantsPromotionsWithCountedPages.pageableParams = new PageableParams();
    this.getAllParticipantsPromotions();
  }

  changeStatusPayment(row: ShortPartnerPromotion) {
    row.confirmPayment = !row.confirmPayment;
    this.adminService.changeStatusPaymentForPartnerPromotion(row).subscribe(data => {});
  }

}
