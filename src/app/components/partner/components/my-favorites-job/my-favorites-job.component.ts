import { ShortResume } from './../../../../models/resume/shortResume';
import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ResumeComponentMode } from 'src/app/components/shared-module/resume/find-resume-page/resumeComponentMode';
import { VacancyComponentMode } from 'src/app/components/shared-module/vacancies/vacancy/vacancyComponentMode';
import { PageableParams } from 'src/app/models/pageable/PageableParams';
import { Resume } from 'src/app/models/resume/resume';
import { FilterFavoriteStatusJob } from 'src/app/models/vacancy/filterFavoriteStatusJob';
import { ShortVacancy } from 'src/app/models/vacancy/shortVacancy';
import { PartnerService } from '../../service/partner.service';

@Component({
  selector: 'app-my-favorites-job',
  templateUrl: './my-favorites-job.component.html',
  styleUrls: ['./my-favorites-job.component.css']
})
export class MyFavoritesJobComponent implements OnInit {

  pageableParams: PageableParams;
  shortVacancies: ShortVacancy[];
  favoritesResume: ShortResume[];

  filterFavoriteStatusJob: FilterFavoriteStatusJob;

  isLoadAll: boolean;

  constructor(private partnerService: PartnerService,
    private authService: AuthService) {
    this.pageableParams = new PageableParams();
    this.shortVacancies = [];
    this.favoritesResume = [];
    this.filterFavoriteStatusJob = FilterFavoriteStatusJob.FAVORITE_VACANCIES;
  }

  ngOnInit() {
    if(this.filterFavoriteStatusJob == FilterFavoriteStatusJob.FAVORITE_VACANCIES) {
      this.getFavoriteVacancies();
    }
  }

  get isMobileMode() {
    return this.authService.isMobileMode();
  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = !this.isMobileMode ? document.documentElement.scrollHeight - 1 : document.documentElement.scrollHeight - 60;
    if(pos >= max && !this.isLoadAll) {
      this.handleLoadMore();
    }
  }

  handleLoadMore() {
    this.pageableParams.page++;
    if(this.filterFavoriteStatusJob == FilterFavoriteStatusJob.FAVORITE_VACANCIES){
      this.partnerService.getFavoriteVacancies(this.pageableParams).subscribe(data => {
        if(data == null || data.length == 0) {
          this.isLoadAll = true;
          return;
        }
        data = ShortVacancy.sortByCreatedAt(data);
        this.shortVacancies = this.shortVacancies.concat(data);
      });
    }
    else if(this.filterFavoriteStatusJob == FilterFavoriteStatusJob.FAVORITE_RESUME){
      this.partnerService.getFavoritesResume(this.pageableParams).subscribe(data => {
        if(data == null || data.length == 0) {
          this.isLoadAll = true;
          return;
        }
        data = ShortResume.sortByCreatedAt(data);
        this.favoritesResume = this.favoritesResume.concat(data);
      });
    }
  }

  switchFilter(filterStatus) {
    this.filterFavoriteStatusJob = filterStatus;
    this.pageableParams.page = 0;

    if(this.filterFavoriteStatusJob == FilterFavoriteStatusJob.FAVORITE_VACANCIES) {
      this.getFavoriteVacancies();
    }
    else if(this.filterFavoriteStatusJob == FilterFavoriteStatusJob.FAVORITE_RESUME) {
      this.getFavoriteResume();
    }
  }

  getFavoriteVacancies() {
    this.partnerService.getFavoriteVacancies(this.pageableParams).subscribe(data => {
      this.shortVacancies = ShortVacancy.sortByCreatedAt(data);
    });
  }

  getFavoriteResume() {
    this.partnerService.getFavoritesResume(this.pageableParams).subscribe(data => {
      this.favoritesResume = ShortResume.sortByCreatedAt(data);
    });
  }

  get getVacanciesMode() {
    return VacancyComponentMode.FAVORITE;
  }

  get getResumeMode() {
    return ResumeComponentMode.FAVORITE;
  }

  isFavoriteVacancyFilterStatus(): boolean {
    return this.filterFavoriteStatusJob == FilterFavoriteStatusJob.FAVORITE_VACANCIES;
  }

  isFavoriteResumeFilterStatus(): boolean {
    return this.filterFavoriteStatusJob == FilterFavoriteStatusJob.FAVORITE_RESUME;
  }
}
