import { ShortVacancy } from './../../../models/vacancy/shortVacancy';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { AuthService } from 'src/app/auth/auth.service';
import { FilterTask } from 'src/app/models/filter/filterTask';
import { FilterVacancy } from 'src/app/models/filter/filterVacancy';
import { PartnerService } from '../../partner/service/partner.service';
import { ShortNews } from 'src/app/models/news/shortNews';
import { CommonService } from 'src/app/common/services/common.service';
import { ShortResume } from 'src/app/models/resume/shortResume';

@Component({
  selector: 'app-job-home',
  templateUrl: './job-home.component.html',
  styleUrls: ['./job-home.component.css']
})
export class JobHomeComponent implements OnInit {

  findVacancy: FilterTask;
  lastThreeVacancy: ShortVacancy[];

  textInTheSearchBar = "Кем бы Вы хотели работать?";
  threeLastNews: ShortNews[];
  lastThreeResume: ShortResume[];

  constructor(
    private authService: AuthService,
    private sessionStorage: SessionStorageService,
    private partnerService: PartnerService,
    private commonService: CommonService,
    public router: Router,
    ) {
      this.findVacancy = new FilterTask();
      this.threeLastNews = [];
      this.lastThreeResume = [];
      this.lastThreeVacancy = [];
     }

  ngOnInit() {
    this.getLastThreeVacancy();
    this.getLastsNews();
    this.getLastThreeResume();
  }

  routerFindVacancy() {
    this.sessionStorage.set(FilterVacancy.FILTER_VACANCY_PROP, JSON.stringify(this.findVacancy));
    this.authService.navigateToFindVacancy();
  }

  isVisiblePlaceholder(): boolean {
    return this.findVacancy.filterName == null || this.findVacancy.filterName == "";
  }

  sendFindVacancy(event) {
    this.routerFindVacancy();
  }

  getLastThreeVacancy() {
    this.partnerService.getLastThreeVacancy().subscribe((data: ShortVacancy[]) => {
      this.lastThreeVacancy = ShortVacancy.sortByCreatedAt(data);
    });
  }

  openFindLastVacancy(findVacancy: ShortVacancy) {
    const url = this.router.serializeUrl(this.router.createUrlTree([`job/find_vacancy/${findVacancy.id}`]));
    window.open(url, '_blank');
  }

  routerGoToNews(id) {
    this.router.navigateByUrl(`our_news/${id}`);
  }

  getLastsNews() {
    this.commonService.getLastsNews().subscribe(data => {
      this.threeLastNews = ShortNews.sortByDate(data);
    });
  }

  openOurNews() {
    this.authService.navigateToOpenOurNews();
  }

  openVacancyList(){
    const url = this.router.serializeUrl(this.router.createUrlTree([`job/find_vacancy`]));
    window.open(url, '_blank');
  }

  innerInputFocussed() {
    this.textInTheSearchBar = "";
  }

  innerInputBlurred() {
    this.textInTheSearchBar = "Кем бы Вы хотели работать?";
  }

  openCreateVacancy() {
    this.authService.navigateToCreateVacancy();
  }

  clickOnPlaceholder() {
    // @ts-ignore
    document.querySelector('.search-input').focus();
  }

  getLastThreeResume() {
    this.commonService.getLastThreeResume().subscribe((data: ShortResume[]) => {
      this.lastThreeResume = ShortResume.sortByCreatedAt(data);
    });
  }

}
