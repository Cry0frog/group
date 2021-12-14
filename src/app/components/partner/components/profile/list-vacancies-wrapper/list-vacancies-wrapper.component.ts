import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { VacancyComponentMode } from 'src/app/components/shared-module/vacancies/vacancy/vacancyComponentMode';
import { PageableParams } from 'src/app/models/pageable/PageableParams';
import { FilterStatusVacancy } from 'src/app/models/vacancy/filterStatusVacancy';
import { ShortVacancy } from 'src/app/models/vacancy/shortVacancy';
import { PartnerService } from '../../../service/partner.service';

@Component({
  selector: 'app-list-vacancies-wrapper',
  templateUrl: './list-vacancies-wrapper.component.html',
  styleUrls: ['./list-vacancies-wrapper.component.css']
})
export class ListVacanciesWrapperComponent implements OnInit {

  isLoaded: boolean;
  taskMode: VacancyComponentMode;

  filterStatusVacancy: FilterStatusVacancy;
  vacancyInfos: ShortVacancy[];

  pageable: PageableParams;
  isLoadAll: boolean;

  constructor(private authService: AuthService,
    private service: PartnerService,
    public router: Router) {
      this.vacancyInfos = [];
      this.pageable = new PageableParams();
      this.isLoaded = false;
      this.filterStatusVacancy = FilterStatusVacancy.ALL;
    }

  ngOnInit() {
    this.setPartnerMode();
  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = !this.isMobileMode ? document.documentElement.scrollHeight - 1 : document.documentElement.scrollHeight - 60;
    if(pos >= max && !this.isLoadAll && (this.pageable.size<=this.vacancyInfos.length)) {
      this.handleLoadMore();
    }
  }

  get isMobileMode() {
    return this.authService.isMobileMode();
  }

  handleLoadMore() {
    this.pageable.page++;
    if(this.taskMode == VacancyComponentMode.PARTNER) {
      this.service.getAllVacancyByCreator(this.filterStatusVacancy, this.pageable).subscribe((data: ShortVacancy[]) => {
        data = ShortVacancy.sortByCreatedAt(data);
        data.forEach(el => {
          this.vacancyInfos.push(el);
        });
        if(data.length < this.pageable.size) {
          this.isLoadAll = true;
        }
      });
    }
  }

  setPartnerMode() {
    this.taskMode = VacancyComponentMode.PARTNER;
    this.service.getAllVacancyByCreator(this.filterStatusVacancy, this.pageable).subscribe((data: ShortVacancy[]) =>{
      this.vacancyInfos = ShortVacancy.sortByCreatedAt(data);
    });
  }

  handleEventVacancyFilter(filterStatusVacancy: FilterStatusVacancy) {
    this.filterStatusVacancy = filterStatusVacancy;
    if(this.taskMode == VacancyComponentMode.PARTNER) {
      this.pageable = new PageableParams();
      this.isLoadAll = false;
      this.setPartnerMode();
    }
  }
}
