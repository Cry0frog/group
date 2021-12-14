import { VACANCY_STATUS_TRANSLATE } from './../../common/jobModule.discription';
import { FilterStatusVacancy } from 'src/app/models/vacancy/filterStatusVacancy';
import { AuthService } from 'src/app/auth/auth.service';
import { ActiveUrls } from './../../../../auth/activeUrls';
import { ShortVacancy } from './../../../../models/vacancy/shortVacancy';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UrlResolver } from 'src/app/components/partner/common/urlResolver';
import { VacancyComponentMode } from '../vacancy/vacancyComponentMode';

@Component({
  selector: 'app-list-vacancies',
  templateUrl: './list-vacancies.component.html',
  styleUrls: ['./list-vacancies.component.css']
})
export class ListVacanciesComponent implements OnInit {
  currentUrl: string;
  @Input() shortVacancies: ShortVacancy[];
  @Input() vacancyComponentMode: VacancyComponentMode;
  @Input() status: FilterStatusVacancy;
  @Output() eventChooseVacancy = new EventEmitter<ShortVacancy>();

  @Output() eventFilter = new EventEmitter<FilterStatusVacancy>();


  vacancyStatusTranslate = VACANCY_STATUS_TRANSLATE;

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.currentUrl = UrlResolver.getMainSectionFromUrl(this.router.url);
  }

  isPartner(): boolean {
    return this.vacancyComponentMode == VacancyComponentMode.PARTNER
  }

  isCommonOfferingMode(): boolean {
    return this.vacancyComponentMode == VacancyComponentMode.COMMON_OFFERING;
  }

  openVacancy(shortVacancy: ShortVacancy) {
    if(this.isCommonOfferingMode()) {
      this.eventChooseVacancy.emit(shortVacancy);
    }
    else {
      this.openVacancyHandler(shortVacancy, this.currentUrl);
    }
  }

  openVacancyHandler(shortVacancy: ShortVacancy, currentUrl) {
    let url = "";
    if(currentUrl == ActiveUrls.PARTNER_VACANCY) {
      url = this.router.serializeUrl(this.router.createUrlTree([`user/${this.authService.getCurrentId}/${ActiveUrls.PARTNER_VACANCY}/${shortVacancy.id}`]));
    }
    else if(currentUrl == ActiveUrls.PARTNER_RESUME) {
      url = this.router.serializeUrl(this.router.createUrlTree([`user/${this.authService.getCurrentId}/${ActiveUrls.PARTNER_RESUME}/${shortVacancy.id}`]));
    }
    else {
      url = this.router.serializeUrl(this.router.createUrlTree([`job/find_vacancy/${shortVacancy.id}`]));
    }

    window.open(url, '_blank');
  }

  isAllFilterStatus(): boolean {
    return this.status == FilterStatusVacancy.ALL;
  }

  isFoundFilterStatus(): boolean {
    return this.status == FilterStatusVacancy.FOUND;
  }

  isHideFilterStatus(): boolean {
    return this.status == FilterStatusVacancy.HIDE;
  }

  filterAll() {
    this.status = FilterStatusVacancy.ALL;
    this.eventFilter.emit(FilterStatusVacancy.ALL);
  }

  filterFound() {
    this.status = FilterStatusVacancy.FOUND;
    this.eventFilter.emit(FilterStatusVacancy.FOUND);
  }

  filterHide() {
    this.status = FilterStatusVacancy.HIDE;
    this.eventFilter.emit(FilterStatusVacancy.HIDE);
  }

}
