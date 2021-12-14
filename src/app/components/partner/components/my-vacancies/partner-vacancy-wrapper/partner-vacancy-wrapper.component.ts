import { PaymentService } from './../../../../../common/services/payment.service';
import { Resume } from 'src/app/models/resume/resume';
import { VacancyComponentMode } from '../../../../shared-module/vacancies/vacancy/vacancyComponentMode';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Vacancy } from 'src/app/models/vacancy/vacancy';
import { PartnerService } from '../../../service/partner.service';
import { VacancyComponent } from 'src/app/components/shared-module/vacancies/vacancy/vacancy.component';
import { MatDialog } from '@angular/material';
import { CommonDialogNotificationComponent } from 'src/app/components/shared-module/common/common-dialog-notification/common-dialog-notification.component';
import { PaymentComponent } from '../../payment/payment.component';
import { VacancyNotEnoughMoneyComponent } from 'src/app/components/shared-module/vacancies/create-vacancy/payments-create-vacancy/vacancy-not-enough-money/vacancy-not-enough-money.component';
import { RateJob } from 'src/app/models/rateJobs/rateJob';
import { RateJobType } from 'src/app/models/rateJobs/rateJobType';
import { PaymentsCreateVacancyComponent } from 'src/app/components/shared-module/vacancies/create-vacancy/payments-create-vacancy/payments-create-vacancy.component';
import { VacancyStatus } from 'src/app/models/vacancy/vacancyStatus';
import { SUBSCRIPTION_DAYS_REVERSE } from 'src/app/components/admin/common/admin.descriptions';
import { SuccessNotificationComponent } from '../../success-notification/success-notification.component';
import { SubscriptionPayComponent } from '../../profile/subscription-pay/subscription-pay.component';
import { SubscriptionNotEnoughMoneyComponent } from '../../profile/subscription-pay/subscription-not-enough-money/subscription-not-enough-money.component';
import { CustomerInfo } from 'src/app/models/task/customerInfo';

@Component({
  selector: 'app-partner-vacancy-wrapper',
  templateUrl: './partner-vacancy-wrapper.component.html',
  styleUrls: ['./partner-vacancy-wrapper.component.css']
})
export class PartnerVacancyWrapperComponent implements OnInit {
  @ViewChild(VacancyComponent, {static: false}) vacancyComponent: VacancyComponent;

  vacancy: Vacancy;
  listResume: Resume[];
  vacancyId: number;
  mode = VacancyComponentMode.PARTNER;

  days = SUBSCRIPTION_DAYS_REVERSE;

  isOnlySubscription: boolean;

  countNewMessage: number;

  constructor(private partnerService: PartnerService,
    public route: ActivatedRoute,
    private dialog: MatDialog,
    private paymentService: PaymentService,
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
    this.paymentService.checkOnlySubscriptionVacancy().subscribe((data: boolean) => {
      this.isOnlySubscription = data;
    });
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

        this.route.queryParams.subscribe(params => {
          if(Boolean(params.resumeId)){
            this.vacancyComponent.viewResume(this.listResume.find(el => el.id == params.resumeId));
          }
        });
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
    this.partnerService.getPartnerVacancy(this.vacancyId).subscribe((data: Vacancy) =>{
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

  showPaySubscribe() {
    const dialogRef = this.dialog.open(SubscriptionPayComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe((data: RateJob) => {
      if(data.rateJobType == RateJobType.SUBSCRIPTION){
        this.showSuccessNotification("Оплата успешно проведена, ваша подписка будет доступна " + this.days[data.countDays], true);
      } else if(data.rateJobType == RateJobType.NOT_ENOUGH_MONEY) {
        this.showSubscribeNotEnough(data);
      }
    });
  }

  showSubscribeNotEnough(data: RateJob) {
    const dialogRef = this.dialog.open(SubscriptionNotEnoughMoneyComponent, {
      width: '550px',
      data: data.amountValue,
    });
    dialogRef.afterClosed().subscribe((data: number) => {
      if(data != null){
        this.goToPayEnough(data);
      }
    });
  }

  showSuccessNotification(body: string, reload: boolean){
    const dialogRef = this.dialog.open(SuccessNotificationComponent, {
      width: '600px',
      data: body

    });
    dialogRef.afterClosed().subscribe((contue: boolean) => {
      if(contue || reload){
        if(reload){
          location.reload();
          this.vacancy.status = VacancyStatus.PUBLISHED;
          this.switchStatusHandler(this.vacancy);
        } else {
          this.showPaySubscribe();
        }
      }
    });
  }

  switchStatusHandler(vacancy: Vacancy) {
    this.partnerService.switchVacancyStatus(vacancy).subscribe(data => {
      if (data != null) {
        if (data.status == VacancyStatus.NOT_PAYED ) {
          if(this.isOnlySubscription){
            this.showSuccessNotification("Чтобы опубликовать данную вакансию, необходимо оформить подписку", false);
          } else {
            const dialogRef = this.dialog.open(PaymentsCreateVacancyComponent, {
              width: '700px',
              data: this.vacancy
            });
            dialogRef.afterClosed().subscribe((data: RateJob) => {
              if (data != null) {
                if (data.rateJobType == RateJobType.ONCE) {
                  this.showSuccessNotification("Оплата успешно проведена, ваша вакансия будет размещена на " + this.days[data.countDays], true);
                } else if (data.rateJobType == RateJobType.NOT_ENOUGH_MONEY) {
                  this.showVacancyNotEnough(data);
                }
              }
            });
          }
        } else {
          this.vacancy = data;
        }
      }
    });
  }

  showVacancyNotEnough(data: RateJob) {
    const dialogRef = this.dialog.open(VacancyNotEnoughMoneyComponent, {
      width: '550px',
      data: data.amountValue,
    });
    dialogRef.afterClosed().subscribe((data: number) => {
      if(data != null){
        this.goToPayEnough(data);
      }
    });
  }

  goToPayEnough(data: number) {
    const dialogRef = this.dialog.open(PaymentComponent, {
      width: '550px',
      data: {
        summ: data,
        redirUrl: this.router.url,
        message: 'После оплаты подождите некоторое время (обычно не более 5 минут, пока платеж не будет подтвержден и попробуйте подать заявку снова)'
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if(res != null) {
        this.showSuccessNotification("Оплата успешно проведена, Вы пополнили бонусный счет. Для публикации данной вакансии нажмите повторно 'Опубликовать', выберите тариф и кликнете 'Оплатить'. С Вашего бонусного счета автоматически спишется необходимая сумма и вакансия будет размещена согласно тарифу.", true);
      }
    });
  }

}
