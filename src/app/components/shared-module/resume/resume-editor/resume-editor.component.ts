import { SessionStorageService } from 'angular-web-storage';
import { ChatService } from 'src/app/components/shared-module/service/chat.service';
import { PaymentService } from './../../../../common/services/payment.service';
import { SelectItem } from 'primeng/api/selectitem';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DESIRABLE_EMPLOYMENT_TYPE, EDUCATION_TYPE, EMPLOYMENT_TYPE, IEducationType, PLACE_WORK_TYPE, SCHEDULE_TYPE } from '../../common/jobModule.discription';
import { RU_CALENDAR } from '../../../../common/localization';
import { GeoCityProperty } from 'src/app/models/map/geo/city/geoCityProperty';
import { GeoCityResponse } from 'src/app/models/map/geo/city/geoCityResponse';
import { FieldActivity } from 'src/app/models/field-activity/fileldActivity';
import { FormControl } from '@angular/forms';
import { WorkExperienceResumeProperty } from 'src/app/models/resume/properties/work_experience/workExperienceResumeProperty';
import { EducationResumeProperty } from 'src/app/models/resume/properties/education/educationResumeProperty';
import { AdditionalEducationResumeProperty } from 'src/app/models/resume/properties/additional_education/additionalEducationResumeProperty';
import { AuthService } from 'src/app/auth/auth.service';
import { Resume } from 'src/app/models/resume/resume';
import { GeoService } from 'src/app/services/geo.service';
import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { EducationType } from 'src/app/models/vacancy/educationType';
import { GeoCityFeature } from 'src/app/models/map/geo/city/geoCityFeature';
import { BaseResumeProperty } from 'src/app/models/resume/properties/baseResumeProperty';
import { CustomerInfo } from 'src/app/models/task/customerInfo';
import { RateJob } from 'src/app/models/rateJobs/rateJob';
import { MatDialog } from '@angular/material/dialog';
import { ResumeNotEnoughMoneyComponent } from './resume-pay-for-view/resume-not-enough-money/resume-not-enough-money.component';
import { PaymentComponent } from 'src/app/components/partner/components/payment/payment.component';
import { ResumePayForViewComponent } from './resume-pay-for-view/resume-pay-for-view.component';
import { RateJobType } from 'src/app/models/rateJobs/rateJobType';
import { UrlResolver } from 'src/app/components/partner/common/urlResolver';
import { Chat } from 'src/app/models/chat/common/chat';
import { Router } from '@angular/router';
import { SuccessNotificationComponent } from 'src/app/components/partner/components/success-notification/success-notification.component';
import { SubscriptionPayComponent } from 'src/app/components/partner/components/profile/subscription-pay/subscription-pay.component';
import { SubscriptionNotEnoughMoneyComponent } from 'src/app/components/partner/components/profile/subscription-pay/subscription-not-enough-money/subscription-not-enough-money.component';
import { SUBSCRIPTION_DAYS_REVERSE } from 'src/app/components/admin/common/admin.descriptions';

@Component({
  selector: 'app-resume-editor',
  templateUrl: './resume-editor.component.html',
  styleUrls: ['./resume-editor.component.css']
})
export class ResumeEditorComponent implements OnInit {
  @Input() resume: Resume;
  @Input() childFieldsActivity: FieldActivity[];
  @Input() hideContactInfo: boolean;
  @Output() markResumeEvent = new EventEmitter<Resume>();

  ru_calendar = RU_CALENDAR;
  educationTypes = EDUCATION_TYPE;
  scheduleTypes = SCHEDULE_TYPE;
  employmentTypes = EMPLOYMENT_TYPE;
  desirableEmploymentTypes = DESIRABLE_EMPLOYMENT_TYPE;
  placeWorkTypes = PLACE_WORK_TYPE;

  resumeCreatorInfo: CustomerInfo;
  isShowCreatorInfo: boolean;

  cities: SelectItem[];
  educationItems: SelectItem[];

  workCityName: string;
  selectedCity: GeoCityProperty;
  geoCityResponse: GeoCityResponse;

  toppingChildFieldActivity = new FormControl();

  workExperienceResumeProperties: WorkExperienceResumeProperty[];
  educationResumeProperties: EducationResumeProperty[];
  additionalEducationResumeProperties: AdditionalEducationResumeProperty[];

  isOnlySubscription: boolean;
  days = SUBSCRIPTION_DAYS_REVERSE;

  constructor(private authService: AuthService,
    private geoService: GeoService,
    private partnerService: PartnerService,
    private paymentService: PaymentService,
    public dialog: MatDialog,
    private chatService: ChatService,
    private sessionStorage: SessionStorageService,
    private router: Router) {
      this.childFieldsActivity = [];
      this.cities = [];
      this.workExperienceResumeProperties = [];
      this.educationResumeProperties = [];
      this.additionalEducationResumeProperties = [];
      this.resumeCreatorInfo = new CustomerInfo();
      this.educationItems = this.educationTypes.map((el: IEducationType) => {
        return {
          label: el.viewValue,
          value: el.value
        }
      });
  }

  ngOnInit() {
    this.getCity();
    if(this.isNotCreated()) {
      this.addCountShoringByTimer(5);
    }

    if(this.isNotCreated() && this.isAuthenticated() && !this.isAdmin() && !this.hideContactInfo) {
      this.getResumeCreatorInfo();
      this.paymentService.checkOnlySubscriptionResume().subscribe((data: boolean) => {
        this.isOnlySubscription = data;
      });
    }
  }

  openChat(resumeId: number) {
    this.chatService.getChatVacancyByParticipantId(this.resume.vacancyId, resumeId).subscribe((chat: Chat) => {
      this.sessionStorage.set('back_chat_url', this.router.url);
      this.router.navigate([UrlResolver.prepareChatUrl(`/user/${this.authService.getCurrentId}`, `/chat/${chat.id}`)]);
    });
  }

  getCity() {
    this.partnerService.getUsedSities().subscribe((data: GeoCityProperty[]) => {
      this.cities = data.map(el => ({ label: el.name, value: el }));
      const citiesFilter = this.cities.filter(el => el.value.osm_id == this.resume.workCity.osm_id);
      if(citiesFilter.length != 0) {
        const id = this.resume.workCity.id;
        this.resume.workCity = citiesFilter[0].value;
        this.resume.workCity.id = id;
      }
      else if(this.resume.workCity != null && this.resume.workCity.name != null) {
        this.cities = [{ label: this.resume.workCity.name, value: this.resume.workCity }];
      }
    });
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
      } else {
        this.showPaySubscribe();
      }
    });
  }

  showSuccessNotification(body: string, reload: boolean){
    const dialogRef = this.dialog.open(SuccessNotificationComponent, {
      width: '600px',
      data: body
    });
    dialogRef.afterClosed().subscribe((countue: boolean) => {
      if(countue || reload){
        if (reload){
          window.open(`${this.router.url}?resumeId=${this.resume.id}`, '_self');
        } else {
          this.showPaySubscribe();
        }
      }
    });
  }

  switchToShowCreatorInfo() {
    if (this.resumeCreatorInfo != null) {
      this.isShowCreatorInfo = !this.isShowCreatorInfo;
    } else {
      if (this.isOnlySubscription){
        this.showSuccessNotification("Чтобы просмотреть контактную информацию соискателя, необходимо оформить подписку", false);
      } else {
        const dialogRef = this.dialog.open(ResumePayForViewComponent, {
          width: '700px',
          data: this.resume.id
        });
        dialogRef.afterClosed().subscribe((data: RateJob) => {
          if(data != null){
            if(data.rateJobType == RateJobType.ONCE){
              this.getResumeCreatorInfo();
              this.isShowCreatorInfo = !this.isShowCreatorInfo;
            } else if(data.rateJobType == RateJobType.NOT_ENOUGH_MONEY) {
              this.showResumeNotEnough(data);
            }
          }
        });
      }
    }
  }

  showResumeNotEnough(data: RateJob) {
    const dialogRef = this.dialog.open(ResumeNotEnoughMoneyComponent, {
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
        redirUrl: `${this.router.url}?resumeId=${this.resume.id}`,
        message: 'После оплаты подождите некоторое время (обычно не более 5 минут, пока платеж не будет подтвержден и попробуйте снова)'
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if(res != null) {
        this.showSuccessNotification("Оплата успешно проведена, Вы пополнили бонусный счет. Для публикации данной вакансии нажмите повторно 'Опубликовать', выберите тариф и кликнете 'Оплатить'. С Вашего бонусного счета автоматически спишется необходимая сумма и вакансия будет размещена согласно тарифу.", true);
      }
    });
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  addCountShoringByTimer(i) {
    setTimeout(() => {
      if(this.resume.id != null) {
        this.partnerService.addCountShowingResume(this.resume.id).subscribe(data => {});
      }
      else if(i != 0) {
        this.addCountShoringByTimer(--i);
      }
    }, 300);
  }

  isResumeVacancy(): boolean {
    return this.resume.vacancyId != null;
  }

  isNotCreated(): boolean {
    return this.resume.creatorId != null && this.authService.getCurrentId != this.resume.creatorId;
  }

  addWorkExperience() {
    this.resume.properties.push(
      WorkExperienceResumeProperty.createEmptyProperty(this.resume.orderCounter++)
    );
  }

  addEducation() {
    this.resume.properties.push(
      EducationResumeProperty.createEmptyProperty(this.resume.orderCounter++)
    );
  }

  addAdditionalEducation() {
    this.resume.properties.push(
      AdditionalEducationResumeProperty.createEmptyProperty(this.resume.orderCounter++)
    );
  }

  onRemoveResumeProperty(property) {
    if (property.order != null) {
      this.resume.properties = this.resume.properties
      .filter(el => el.order != property.order);
    } else {
      this.resume.properties = this.resume.properties
      .filter(el => el.id != property.id);
    }
  }

  isVisibleSpeciality(property: EducationResumeProperty): boolean {
    return property.education != null && (property.education == EducationType.SPECIALIZED_SECONDARY ||
      property.education == EducationType.HIGHER);
  }

  onChangeCity(event) {
    if(this.workCityName != event.target.value) {
      this.workCityName = event.target.value;
      this.refreshCitiesCandidates();
    }
  }

  refreshCitiesCandidates() {
    if(this.workCityName != null && this.workCityName != '') {
      this.geoService.geocodeCitiesByPartOfName(this.workCityName).subscribe((resp: GeoCityResponse) => {
        this.geoCityResponse = resp;
        this.cities = this.geoCityResponse.features.map((feature: GeoCityFeature) => {
          return {
            label: feature.properties.getDisplayName(),
            value: feature.properties
          };
        });
      });
    }
  }

  getResumeCreatorInfo() {
    this.partnerService.getResumeCreatorInfo(this.resume.id).subscribe(data => {
      this.resumeCreatorInfo = data;
    });
  }

  isEmptyWorkExpirienceResumeProperties(): boolean {
    return this.resume.getWorkExperienceProperties().length == 0;
  }

  isEmptyEducationResumeProperties(): boolean {
    return this.resume.getEducationProperties().length == 0;
  }

  isEmptyAdditionalEducationResumeProperties(): boolean {
    return this.resume.getAdditionalEducationProperties().length == 0;
  }

  isEmptyResumeProperties(): boolean {
    return this.resume.properties.length == 0;
  }

  findIndexOfProperty(property: BaseResumeProperty): number {
    return property.id != null ?
      this.resume.properties.findIndex(prop => prop.id == property.id) :
        this.resume.properties.findIndex(prop => prop.order == property.order)
  }

  isShowMarkResume(): boolean {
    return this.resume != null && this.resume.visibleResume == true;
  }

  isAuthenticated(): boolean {
    return this.authService.LoggedUser != null && this.authService.LoggedUser.authenticated;
  }

  markResume() {
    this.markResumeEvent.emit(this.resume);
  }
}
