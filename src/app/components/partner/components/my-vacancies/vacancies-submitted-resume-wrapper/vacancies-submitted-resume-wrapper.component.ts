import { AuthService } from 'src/app/auth/auth.service';
import { ShortVacancy } from '../../../../../models/vacancy/shortVacancy';
import { PageableParams } from 'src/app/models/pageable/PageableParams';
import { Component, HostListener, OnInit } from '@angular/core';
import { PartnerService } from '../../../service/partner.service';
import { VacancyComponentMode } from 'src/app/components/shared-module/vacancies/vacancy/vacancyComponentMode';

@Component({
  selector: 'app-vacancies-submitted-resume-wrapper',
  templateUrl: './vacancies-submitted-resume-wrapper.component.html',
  styleUrls: ['./vacancies-submitted-resume-wrapper.component.css']
})
export class VacanciesSubmittedResumeWrapperComponent implements OnInit {
  pageableParams: PageableParams;
  shortVacancies: ShortVacancy[];
  isLoadAll: boolean;

  constructor(private partnerService: PartnerService,
    private authService: AuthService) {
    this.pageableParams = new PageableParams();
    this.shortVacancies = [];
  }

  ngOnInit() {
    this.getVacanciesBySubmittedResume();
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
    this.partnerService.getVacanciesBySubmittedResume(this.pageableParams).subscribe(data => {
      if(data == null || data.length == 0) {
        this.isLoadAll = true;
        return;
      }
      data = ShortVacancy.sortByCreatedAt(data);
      this.shortVacancies = this.shortVacancies.concat(data);
    });
  }

  getVacanciesBySubmittedResume() {
    this.partnerService.getVacanciesBySubmittedResume(this.pageableParams).subscribe(data => {
      this.shortVacancies = ShortVacancy.sortByCreatedAt(data);
    });
  }

  get getMode() {
    return VacancyComponentMode.RESUME;
  }

}
