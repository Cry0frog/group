import { ShortNews } from './../../../models/news/shortNews';
import { ActiveUrls } from 'src/app/auth/activeUrls';
import { Router } from '@angular/router';
import { ShortPromotion } from 'src/app/models/promotion/shortPromotion';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { PartnerService } from '../../partner/service/partner.service';
import { FilterTask } from 'src/app/models/filter/filterTask';
import { SessionStorageService } from 'angular-web-storage';
import { ShortTask } from 'src/app/models/task/shortTask';
import { CommonService } from 'src/app/common/services/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  promotions: ShortPromotion[];

  lastThreeTasks: ShortTask[];

  isAllCategoriesMode: boolean;
  isViewTimer: boolean;

  countFinishTask: number;
  textInTheSearchBar = " Что вы хотите найти?"

  findTask: FilterTask;
  threeLastNews: ShortNews[];

  constructor(private authService: AuthService,
    private partnerService: PartnerService,
    private commonService: CommonService,
    private sessionStorage: SessionStorageService,
    public router: Router
    ) {
      this.promotions = [];
      this.countFinishTask = 0;
      this.isViewTimer = false;
      this.findTask = new FilterTask();
      this.threeLastNews = [];
  }

  ngOnInit() {
    window.scrollTo(0,0);
    this.viewTimer();
    this.getPromotions();
    this.getLastThreeTasks();
    this.getLastsNews();
  }

  sendFindTask(event) {
    this.routerFindTask();
  }

  getPromotions() {
    this.partnerService.getAllPromotionsForHome().subscribe((data: ShortPromotion[]) => {
      this.promotions = data;
    });
  }

  isEmptyPromotions(): boolean {
    return this.promotions.length == 0;
  }

  isVisiblePlaceholder(): boolean {
    return this.findTask.filterName == null || this.findTask.filterName == "";
  }

  clickOnPlaceholder() {
    // @ts-ignore
    document.querySelector('.search-input').focus();
  }

  viewTimer() {
    this.partnerService.viewTimer().subscribe(data => {
      if(data != null) {
        this.isViewTimer = true;
        this.countFinishTask = data.countFinishTask;
      }
    });
  }

  get sortedArrayPromotions(): ShortPromotion[] {
    return this.promotions.sort((a, b) => {
       return a.id - b.id;
    });
  }

  routerFindTask() {
    this.sessionStorage.set(FilterTask.FILTER_TASK_PROP, JSON.stringify(this.findTask));
    this.authService.navigateToFindTask();
  }

  routerGoToPromotions(promo: ShortPromotion) {
    this.router.navigateByUrl(`${ActiveUrls.PROMOTION}/${promo.id}`);
  }

  routerGoToNews(id) {
    this.router.navigateByUrl(`our_news/${id}`);
  }

  navigateToPromotion() {
    this.authService.navigateToPromotions();
  }

  openCreateTask() {
    this.authService.navigateToCreateNewTask();
  }

  openFindTask() {
    this.authService.navigateToFindTask();
  }

  openOurPartners() {
    this.authService.navigateToOpenOurPartners();
  }

  openOurNews() {
    this.authService.navigateToOpenOurNews();
  }

  openPerformers() {
    this.authService.navigatePerformers();
  }

  getLastThreeTasks() {
    this.partnerService.getLastThreeTasks().subscribe((data: ShortTask[]) => {
      this.lastThreeTasks = ShortTask.sortByDateDesc(data);
    });
  }

  openFindLastTask(findTask: ShortTask) {
    const url = this.router.serializeUrl(this.router.createUrlTree([`find_task/${findTask.id}`]));
    window.open(url, '_blank');
  }

  openTaskList(){
    const url = this.router.serializeUrl(this.router.createUrlTree([`find_task`]));
    window.open(url, '_blank');
  }

  getLastsNews() {
    this.commonService.getLastsNews().subscribe(data => {
      this.threeLastNews = ShortNews.sortByDate(data);
    });
  }

  innerInputFocussed() {
    this.textInTheSearchBar = "";
  }

  innerInputBlurred() {
    this.textInTheSearchBar = "Что бы Вы хотели сделать?";
  }

}
