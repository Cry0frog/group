import { VacancyStatus } from 'src/app/models/vacancy/vacancyStatus';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonService } from 'src/app/common/services/common.service';
import { Component, OnInit } from '@angular/core';
import { FieldActivity } from 'src/app/models/field-activity/fileldActivity';
import { FindVacanciesComponent } from './find-vacancies/find-vacancies.component';
import { SessionStorageService } from 'angular-web-storage';
import { FilterVacancy } from 'src/app/models/filter/filterVacancy';
import { VacancyWrapperComponent } from './vacancy-wrapper/vacancy-wrapper.component';
import { CustomerInfo } from 'src/app/models/task/customerInfo';
import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { TaskStatus } from 'src/app/models/task/taskStatus';
import { ChatService } from '../../service/chat.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UrlResolver } from 'src/app/components/partner/common/urlResolver';
import { IActiveCardWithArgs } from 'src/app/components/partner/components/common/right-bottom-partner-area/right-bottom-partner-area.component';
import { MainSectionUrls } from 'src/app/auth/activeUrls';
import { filter } from 'rxjs/operators';
import { Chat } from 'src/app/models/chat/common/chat';
import { Resume } from 'src/app/models/resume/resume';

@Component({
  selector: 'app-find-vacancies-page',
  templateUrl: './find-vacancies-page.component.html',
  styleUrls: ['./find-vacancies-page.component.css']
})
export class FindVacanciesPageComponent implements OnInit {
  findVacanciesComponent: FindVacanciesComponent;
  vacancyWrapperComponent: VacancyWrapperComponent;

  fieldsActivity: FieldActivity[];
  choosenFieldsActivityIds: number[];
  choosenFieldsActivity: FieldActivity[];
  saveFieldActivityId: number[];
  isShowUserCard: boolean;
  customerInfo: CustomerInfo;

  currentVacancyId: number;

  constructor(private commonService: CommonService,
    private partnerService: PartnerService,
    private sessionStorage: SessionStorageService,
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router,) {
    this.fieldsActivity = [];
    this.choosenFieldsActivityIds = [];
    this.choosenFieldsActivity = [];
    this.customerInfo = new CustomerInfo();
  }

  ngOnInit() {
    const saveFieldActivityId: number[] = this.sessionStorage.get(AuthService.FIELD_ACTIVITY_ID);

    this.saveFieldActivityId = saveFieldActivityId;
    this.sessionStorage.remove(AuthService.FIELD_ACTIVITY_ID);

    this.getAllRootFieldsActivity();
  }

  loadCustomerInfo(vacancyId) {
    this.partnerService.getVacancyCreatorInfo(vacancyId).subscribe((customerInfo: CustomerInfo) => {
      this.customerInfo = customerInfo;
    });
  }

  onRouterOutletActivate(event) {

    if(event instanceof FindVacanciesComponent) {
      this.findVacanciesComponent = event;

      this.findVacanciesComponent.eventRefreshFieldsActivity.subscribe(
        (choosenFieldsId: number[]) => this.handleRefreshFieldsActivity(choosenFieldsId));
    }
    else {
      this.findVacanciesComponent = null;
    }

    if(event instanceof VacancyWrapperComponent) {
      this.loadCustomerInfo(event.vacancyId);
      this.currentVacancyId = event.vacancyId;
      this.isShowUserCard = true;
    }
    else {
      this.isShowUserCard = false;
    }
  }

  getAllRootFieldsActivity() {
    this.commonService.getAllRootFieldsActivity().subscribe(data => {
      if(data != null) {
        this.fieldsActivity = FieldActivity.sortedArray(data);

        if (this.saveFieldActivityId != null){
          this.handleRefreshFieldsActivity(this.saveFieldActivityId);
        }
        Promise.resolve(null).then(_ => this.displayChoosenFieldsActivity(this.choosenFieldsActivityIds));
        this.initinalFindVacancyComponent(data, 5);

      }
    })
  }

  restoreFilterVacancy(): FilterVacancy {
    const savedFilterVacancy = this.sessionStorage.get(FilterVacancy.FILTER_VACANCY_PROP);
    let filterVacany: FilterVacancy;
    if(savedFilterVacancy != null && savedFilterVacancy != '') {
      this.sessionStorage.remove(FilterVacancy.FILTER_VACANCY_PROP);
      filterVacany = FilterVacancy.convertToObj(JSON.parse(savedFilterVacancy));
    }
    else {
      filterVacany = FilterVacancy.createFilterBasedOnChoosenFiledActivity(this.choosenFieldsActivity, new FilterVacancy());
    }

    filterVacany.pageable.page = 0;
    return filterVacany;
  }

  isShowChatBtn(): boolean {
    return this.customerInfo.vacancyStatus == VacancyStatus.PUBLISHED;
  }

  openChat() {
    this.chatService.getChatVacancyByParticipantId(this.currentVacancyId, 0).subscribe((chat: Chat) => {
      this.sessionStorage.set('back_chat_url', this.router.url);
      window.scrollTo(0, 0);
      this.router.navigate([UrlResolver.prepareChatUrl(`/user/${this.authService.getCurrentId}`, `/chat/${chat.id}`)]);
    });
  }

  initinalFindVacancyComponent(data, i) {
    if(this.findVacanciesComponent) {
      this.findVacanciesComponent.fieldsActivity = data;
      this.findVacanciesComponent.filterVacancy = this.restoreFilterVacancy();
      this.handleRefreshFieldsActivity(this.findVacanciesComponent.filterVacancy.choosenFieldActivityIds);
      if(this.findVacanciesComponent.filterVacancy.selectedCity != null) {
        this.findVacanciesComponent.partCityName = this.findVacanciesComponent.filterVacancy.selectedCity.name;
        this.findVacanciesComponent.refreshCitiesCandidates();
      }
    }
    else {
      setTimeout(() => this.initinalFindVacancyComponent(data, --i), 200);
    }
  }

  handleRefreshFieldsActivity(ids: number[]) {
    this.choosenFieldsActivityIds = ids;
    this.displayChoosenFieldsActivity(ids);
    this.refreshChoosenFieldsActivity(true);
  }

  displayChoosenFieldsActivity(ids: number[]) {
    if(ids.length == 0) {
      this.choosenFieldsActivity = [];
    }

    this.fieldsActivity.forEach(cat => {
      if(ids.includes(cat.id)) {
        this.choosenFieldsActivity.push(cat);
      }

      if(cat.children != null && cat.children.length != 0) {
        this.choosenFieldsActivity = this.choosenFieldsActivity.concat(cat.children.filter(child => ids.includes(child.id)));
      }
    });
  }

  refreshChoosenFieldsActivity(isReload: boolean) {
    if(this.findVacanciesComponent != null) {
      this.findVacanciesComponent.refreshChoosenFieldsActivity(this.choosenFieldsActivity, isReload);
    }
  }

  toggleFieldActivity(fieldAcivity: FieldActivity) {
    if(this.findVacanciesComponent == null) {
      return;
    }

    this.findVacanciesComponent.toggleFieldAcivity(fieldAcivity, true, false);
    this.choosenFieldsActivityIds = this.findVacanciesComponent.choosenFieldsActivityIds;
    this.choosenFieldsActivity = this.findVacanciesComponent.choosenFieldsActivity;
  }


}
