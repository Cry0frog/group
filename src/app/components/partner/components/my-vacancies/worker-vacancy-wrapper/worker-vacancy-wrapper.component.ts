import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonDialogNotificationComponent } from 'src/app/components/shared-module/common/common-dialog-notification/common-dialog-notification.component';
import { VacancyComponent } from 'src/app/components/shared-module/vacancies/vacancy/vacancy.component';
import { VacancyComponentMode } from 'src/app/components/shared-module/vacancies/vacancy/vacancyComponentMode';
import { Resume } from 'src/app/models/resume/resume';
import { Vacancy } from 'src/app/models/vacancy/vacancy';
import { PartnerService } from '../../../service/partner.service';

@Component({
  selector: 'app-worker-vacancy-wrapper',
  templateUrl: './worker-vacancy-wrapper.component.html',
  styleUrls: ['./worker-vacancy-wrapper.component.css']
})
export class WorkerVacancyWrapperComponent implements OnInit {
  @ViewChild(VacancyComponent, {static: false}) vacancyComponent: VacancyComponent;

  vacancy: Vacancy;
  listResume: Resume[];
  vacancyId: number;
  mode = VacancyComponentMode.PARTNER;

  constructor(private partnerService: PartnerService,
    public route: ActivatedRoute,
    private dialog: MatDialog,
    public router: Router) {
      this.vacancy = new Vacancy();
      this.route.params.subscribe(param => {
        if(param['id']) {
          this.vacancyId = parseInt(param['id']);
        }
      });

      this.listResume = [];
    }

  ngOnInit() {
    this.getAllResumeVacancy();
    this.getCurrentVacancy();
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

  getCurrentVacancy(){
    this.partnerService.getWorkerVacancy(this.vacancyId).subscribe((data: Vacancy) =>{
      if(data != null) {
        this.vacancy = data;
        if(this.vacancy.id != null && this.vacancy.points.length != 0) {
          setTimeout(() => this.vacancyComponent.onLoadVacancyEvent(this.vacancy), 200);
        }
      }
      else {
        this.dialog.open(CommonDialogNotificationComponent, {
          width: '550px',
          data: "Уважаемый пользователь, данная вакансия не актуальна"
        });
      }

    })
  }
}
