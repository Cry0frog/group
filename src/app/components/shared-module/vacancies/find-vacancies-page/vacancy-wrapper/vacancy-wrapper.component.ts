import { Resume } from 'src/app/models/resume/resume';
import { VacancyComponent } from 'src/app/components/shared-module/vacancies/vacancy/vacancy.component';
import { VacancyComponentMode } from './../../vacancy/vacancyComponentMode';
import { Vacancy } from './../../../../../models/vacancy/vacancy';
import { PartnerService } from './../../../../partner/service/partner.service';
import { CommonService } from 'src/app/common/services/common.service';
import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-vacancy-wrapper',
  templateUrl: './vacancy-wrapper.component.html',
  styleUrls: ['./vacancy-wrapper.component.css']
})
export class VacancyWrapperComponent implements OnInit {
  @ViewChild(VacancyComponent, {static: false}) vacancyComponent: VacancyComponent;
  vacancyId: number;
  vacancy: Vacancy;
  listResume: Resume[];

  constructor(private commonService: CommonService,
    private authService: AuthService,
    private partnerService: PartnerService,
    private route: ActivatedRoute) {
      this.route.params.subscribe(params => this.vacancyId = params['vacancyId']);
      this.vacancy = new Vacancy();
      this.listResume = [];
  }

  ngOnInit() {
    this.getVacation();

    if(this.authService.LoggedUser.authenticated) {
      this.getAllResumeVacancy()
    }
  }

  refrashResumeVacancyHandler(event) {
    this.getAllResumeVacancy();
  }

  deleteResumeHandler(event) {
    this.partnerService.deleteResume(event).subscribe(data => {
      this.getAllResumeVacancy();
    });
  }

  getAllResumeVacancy() {
    this.partnerService.getAllResumeVacancy(this.vacancyId).subscribe(data => {
      if(data != null) {
        this.listResume = Resume.sortByDate(data);
      }
    });
  }

  markVacancyHandler(vacancy) {
    this.partnerService.markVacancy(vacancy).subscribe(data => {
      if(data != null) {
        this.vacancy = data;
      }
    });
  }

  getVacation() {
    this.partnerService.getVacancy(this.vacancyId).subscribe(data => {
      this.vacancy = data;
      if(this.vacancy.id != null && this.vacancy.points.length != 0) {
        setTimeout(() => this.vacancyComponent.onLoadVacancyEvent(this.vacancy), 200);
      }
    });
  }

  get getVacancyMode() {
    return VacancyComponentMode.COMMON;
  }

}
