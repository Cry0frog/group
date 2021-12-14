import { MatProgressBarModule } from '@angular/material/progress-bar';
import { WorkExamplesComponent } from './work-examples/work-examples.component';
import { NotActualityNotificationComponent } from './notification-display/not-actuality-notification/not-actuality-notification.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { ListTasksComponent } from './../partner/components/common/list-tasks/list-tasks.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { CreateTaskComponent } from './tasks/create-task/create-task.component';
import { HomeComponent } from './home/home.component';
import { GeneralNavComponent } from './general-nav/general-nav.component';
import { CommonLayoutComponent } from './layouts/common-layout/common-layout.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MapHandlerComponent } from './map-handler/map-handler.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateTaskContentComponent } from './tasks/create-task-content/create-task-content.component';
import { NgModule } from '@angular/core';
import { MatOptionModule, MatSelectModule,
  MatFormFieldModule, MatInputModule,
  MatDatepickerModule, MatNativeDateModule,
  MatCheckboxModule, MatDialogModule,
  MatDividerModule, MatChipsModule, MatTooltipModule,
  MatIconModule, MAT_DIALOG_DATA,
  MatDialogRef, MatCardModule
} from '@angular/material';
import { CommonModule } from '@angular/common';
import { FindTaskPageComponent } from './tasks/find-task-page/find-task-page.component';
import { TaskComponent } from './tasks/task/task.component';
import { TaskWrapperComponent } from './tasks/find-task-page/task-wrapper/task-wrapper.component';
import { FindTaskComponent } from './tasks/find-task-page/find-task/find-task.component';
import { CancelTaskComponent } from './tasks/task/cancel-task/cancel-task.component';
import { PayTaskComponent } from './tasks/create-task-content/pay-task/pay-task.component';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { SessionStorageService} from 'angular-web-storage';
import { ValidationErrorTemplateComponent } from './validation-error-template/validation-error-template.component';
import { ChatTemplateComponent } from './chat/chat-wrapper/chat-template/chat-template.component';
import { ChatWrapperComponent } from './chat/chat-wrapper/chat-wrapper.component';
import { ChatContactListComponent } from './chat/chat-wrapper/chat-contact-list/chat-contact-list.component';
import { FileUploadModule } from 'primeng/fileupload';
import { PayRedirectWrapperComponent } from './tasks/create-task-content/pay-task/pay-redirect-wrapper/pay-redirect-wrapper.component';
import { InputMaskModule } from 'primeng/inputmask';
import { SpinnerModule } from 'primeng/spinner';
import { KeyFilterModule } from 'primeng/keyfilter';
import { OurPartnersComponent } from './home/our-partners/our-partners.component';
import { OurNewsComponent } from './home/our-news/our-news.component';
import { AboutUsComponent } from './home/about-us/about-us.component';
import { FindPerformerPageComponent } from './performers/find-performer-page/find-performer-page.component';
import { FindPerformerComponent } from './performers/find-performer-page/find-performer/find-performer.component';
import { ListPerformersComponent } from './performers/find-performer-page/list-performers/list-performers.component';

import { RequestCommentComponent } from './tasks/task/request-comment/request-comment.component';
import { CommentComponent } from './comment/comment.component';
import { TaskCommentsWrapperComponent } from './tasks/task-comments-wrapper/task-comments-wrapper.component';
import { OfferingTaskWrapperComponent } from './performers/find-performer-page/list-performers/offering-task-wrapper/offering-task-wrapper.component';
import { CommonDialogNotificationComponent } from './common/common-dialog-notification/common-dialog-notification.component';
import { OfferTaskComponent } from './tasks/task/offer-task/offer-task.component';
import { FAQComponent } from './home/faq/faq.component';
import { CommissionComponent } from './home/commission/commission.component';
import { PricingComponent } from './home/pricing/pricing.component';
import { MotivationProgramComponent } from './home/motivation-program/motivation-program.component';
import { ReasonsBlockingComponent } from './home/reasons-blocking/reasons-blocking.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { RegistrationLayoutComponent } from './layouts/registration-layout/registration-layout.component';
import { VerificationRequestComponent } from './auth/registration/verification-request/verification-request.component';
import { RequestNotEnoughMoneyComponent } from './tasks/find-task-page/task-wrapper/request-not-enough-money/request-not-enough-money.component';
import { PasswordRecoveryComponent } from './auth/password-recovery/password-recovery.component';
import { LegalInformationComponent } from './home/legal-information/legal-information.component';
import { MapDisplayCommonInfoComponent } from './common/map-display-common-info/map-display-common-info.component';
import { CancelRequestComponent } from '../shared-module/tasks/task/cancel-request/cancel-request.component';
import { ChoosePayToolComponent } from './tasks/create-task-content/choose-pay-tool/choose-pay-tool.component';
import { ChoosePerformerPayToolComponent } from './tasks/create-task-content/choose-performer-pay-tool/choose-performer-pay-tool.component';
import { TermsUseComponent } from './home/terms-use/terms-use.component';
import { AddDataForLoginComponent } from './auth/add-data-for-login/add-data-for-login.component';
import { SidePanelComponent } from './side-panel/side-panel.component';
import { PasswordRecoveryLayoutComponent } from './layouts/password-recovery-layout/password-recovery-layout.component';
import { NotificationDisplayComponent } from './notification-display/notification-display.component';
import { SupportComponent } from './home/support/support.component';
import { SupportLayoutComponent } from './layouts/support-layout/support-layout.component';
import { AcceptNotificationComponent } from './tasks/task/accept-notification/accept-notification.component';
import { PublicOfferComponent } from './home/public-offer/public-offer.component';
import { PrivacyPolicyComponent } from './home/privacy-policy/privacy-policy.component';
import { ChooseAmountComponent } from './tasks/create-task-content/choose-amount/choose-amount.component';
import { UserPhotoComponent } from './user-photo/user-photo.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DatetimeComponent } from './common/datetime/datetime.component';
import { RegistrationNotComponent } from './registration-not/registration-not.component';
import { GreetingComponent } from './home/greeting/greeting.component';
import { InterviewComponent } from './auth/registration/interview/interview.component';
import { GreetingLayoutsComponent } from './layouts/greeting-layouts/greeting-layouts.component';
import { ListPromotionsComponent } from './promotions/list-promotions/list-promotions.component';
import { PromotionComponent } from './promotions/promotion/promotion.component';
import { PromotionPageComponent } from './promotions/promotion-page/promotion-page.component';
import { PromotionWrapperComponent } from './promotions/promotion-page/promotion-wrapper/promotion-wrapper.component';
import { ListPromotionsWrapperComponent } from './promotions/promotion-page/list-promotions-wrapper/list-promotions-wrapper.component';
import { MobileTooltipComponent } from './mobile-tooltip/mobile-tooltip.component';
import { HomeCategoriesComponent } from './home/home-categories/home-categories.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { FilterCategoriesComponent } from './filters/filter-categories/filter-categories.component';
import { ContextmenuComponent } from './contextmenu/contextmenu.component';
import { UpdateTaskComponent } from './tasks/update-task/update-task.component';
import { RegistrationLegalComponent } from './auth/registration/registration-legal/registration-legal.component';
import { DisplayPerformersComponent } from './performers/find-performer-page/list-performers/display-performers/display-performers.component';
import { DisplayAdvertisingComponent } from './display-advertising/display-advertising.component';
import { AddImageWorkExampleComponent } from './work-examples/add-image-work-example/add-image-work-example.component';
import { NewsPageComponent } from './home/our-news/news-page/news-page.component';
import { NewsListComponent } from './home/our-news/news-list/news-list.component';
import { HistoryTasksComponent } from './tasks/history-tasks/history-tasks.component';
import { CategoryConstructionComponent } from './home/greeting/category-construction/category-construction.component';
import { OnlineConsultantChatWrapperComponent } from './chat/online-consultant-chat-wrapper/online-consultant-chat-wrapper.component';
import { CommonOnlineConsultantChatComponent } from '../shared-module/chat/common-online-consultant-chat/common-online-consultant-chat.component';
import { CommonDialogUserAuthorizationComponent } from './performers/find-performer-page/list-performers/common/common-dialog-user-authorization/common-dialog-user-authorization.component';
import { KirovCategoryConstructionComponent } from './home/greeting/category-construction/kirov-category-construction/kirov-category-construction.component';
import { FooterComponent } from './home/footer/footer.component';
import { DefaultBodyCategoryConstructionComponent } from './home/greeting/default-body-category-construction/default-body-category-construction.component';
import { EquipmentRepairCategoryComponent } from './home/greeting/equipment-repair-category/equipment-repair-category.component';
import { KirovEquipmentRepairCategoryComponent } from './home/greeting/equipment-repair-category/kirov-equipment-repair-category/kirov-equipment-repair-category.component';
import { RequestMemberComponent } from './home/our-partners/request-member/request-member.component';
import { EarlyCompletionTaskComponent } from './tasks/task/early-completion-task/early-completion-task.component';
import { ChatSupportComponent } from './chat-support/chat-support.component';
import { UserAccountComponent } from './user-account/user-account.component';
import { JobHomeComponent } from './job-home/job-home.component';
import { WhyUsComponent } from './why-us/why-us.component';
import { SpecialAbilitiesComponent } from './special-abilities/special-abilities.component';
import { AdvantagesComponent } from './advantages/advantages.component';
import { FormationOrderPriceComponent } from './formation-order-price/formation-order-price.component';
import { FindVacanciesPageComponent } from './vacancies/find-vacancies-page/find-vacancies-page.component';
import { FindVacanciesComponent } from './vacancies/find-vacancies-page/find-vacancies/find-vacancies.component';
import { VacancyWrapperComponent } from './vacancies/find-vacancies-page/vacancy-wrapper/vacancy-wrapper.component';
import { VacancyComponent } from './vacancies/vacancy/vacancy.component';
import { CreateVacancyContentComponent } from './vacancies/create-vacancy/create-vacancy-content/create-vacancy-content.component';
import { ListVacanciesComponent } from './vacancies/list-vacancies/list-vacancies.component';
import { CreateVacancyComponent } from './vacancies/create-vacancy/create-vocancy.component';
import { FilterFieldsActivityComponent } from './filters/filter-fields-activity/filter-fields-activity.component';
import { ChatListComponent } from './chat/chat-list/chat-list.component';
import { MapVacancyHandlerComponent } from './map-handler/map-vacancy-handler/map-vacancy-handler.component';
import { UpdateVacancyComponent } from './vacancies/update-vacancy/update-vacancy.component';
import { OfferLoadAppComponent } from './common/offer-load-app/offer-load-app.component';
import { FindResumePageComponent } from './resume/find-resume-page/find-resume-page.component';
import { FindResumeComponent } from './resume/find-resume-page/find-resume/find-resume.component';
import {  MultiSelectModule } from 'primeng/multiselect';
import { JobCategoriesComponent } from './job-home/categories/job-categories.component';
import { JobWhyUsComponent } from './job-home/job-why-us/job-why-us.component';
import { JobSpecialAbilitiesComponent } from './job-home/job-special-abilities/job-special-abilities.component';
import { JobAdvantagesComponent } from './job-home/job-advantages/job-advantages.component';
import { JobNavigateServiceComponent } from './job-home/job-navigate-service/job-navigate-service.component';
import { ListResumeComponent } from './resume/list-resume/list-resume.component';
import { OfferingVacancyWrapperComponent } from './resume/find-resume-page/offering-vacancy-wrapper/offering-vacancy-wrapper.component';
import { VacancyUserAuthorizationComponent } from './resume/find-resume-page/vacancy-user-authorization/vacancy-user-authorization.component';
import { JobResumeComponent } from './job-home/job-resume/job-resume.component';
import { PaymentsCreateVacancyComponent } from './vacancies/create-vacancy/payments-create-vacancy/payments-create-vacancy.component';
import { VacancyNotEnoughMoneyComponent } from './vacancies/create-vacancy/payments-create-vacancy/vacancy-not-enough-money/vacancy-not-enough-money.component';
import { CommonDialogResumeComponent } from './resume/common-dialog-resume/common-dialog-resume.component';
import { SubmitResumeWrapperComponent } from './vacancies/submit-resume-wrapper/submit-resume-wrapper.component';
import { ResumeEditorComponent } from './resume/resume-editor/resume-editor.component';
import { ResumePayForViewComponent } from './resume/resume-editor/resume-pay-for-view/resume-pay-for-view.component';
import { ResumeNotEnoughMoneyComponent } from './resume/resume-editor/resume-pay-for-view/resume-not-enough-money/resume-not-enough-money.component';


@NgModule({
  declarations: [
    CreateTaskContentComponent, MapHandlerComponent, FindTaskPageComponent,
    TaskComponent, TaskWrapperComponent, FindTaskComponent,
    CancelTaskComponent, PayTaskComponent, ValidationErrorTemplateComponent,
    CommonLayoutComponent, GeneralNavComponent, HomeComponent,
    CreateTaskComponent, LoginLayoutComponent, LoginComponent,
    ChatTemplateComponent, ChatWrapperComponent, ChatContactListComponent,
    PayRedirectWrapperComponent, ListTasksComponent, OurPartnersComponent,
    OurNewsComponent, AboutUsComponent, FindPerformerPageComponent,
    FindPerformerComponent, ListPerformersComponent, RequestCommentComponent,
    CommentComponent, TaskCommentsWrapperComponent, OfferingTaskWrapperComponent,
    CommonDialogNotificationComponent, OfferTaskComponent, FAQComponent,
    CommissionComponent, PricingComponent, MotivationProgramComponent,
    ReasonsBlockingComponent, RegistrationComponent, RegistrationLayoutComponent,
    VerificationRequestComponent, RequestNotEnoughMoneyComponent, PasswordRecoveryComponent,
    LegalInformationComponent, MapDisplayCommonInfoComponent, CancelRequestComponent,
    SidePanelComponent, PasswordRecoveryLayoutComponent, NotificationDisplayComponent,
    TermsUseComponent, AddDataForLoginComponent, ChoosePayToolComponent,
    ChoosePerformerPayToolComponent, SupportComponent, SupportLayoutComponent,
    AcceptNotificationComponent, PublicOfferComponent, PrivacyPolicyComponent,
    UserPhotoComponent, DatetimeComponent, RegistrationNotComponent, GreetingComponent,
    InterviewComponent, GreetingLayoutsComponent, PromotionComponent,
    ListPromotionsComponent, PromotionWrapperComponent, PromotionPageComponent,
    ListPromotionsWrapperComponent, NotActualityNotificationComponent, MobileTooltipComponent,
    HomeCategoriesComponent, NotFoundPageComponent,  ChooseAmountComponent, UpdateTaskComponent,
    FilterCategoriesComponent, ContextmenuComponent, RegistrationLegalComponent,
    DisplayPerformersComponent, DisplayAdvertisingComponent, WorkExamplesComponent,
    AddImageWorkExampleComponent, NewsPageComponent, NewsListComponent, HistoryTasksComponent, CategoryConstructionComponent,
    DisplayPerformersComponent, DisplayAdvertisingComponent, WorkExamplesComponent,
    AddImageWorkExampleComponent, NewsPageComponent, NewsListComponent,
    OnlineConsultantChatWrapperComponent, CommonOnlineConsultantChatComponent,
    CommonDialogUserAuthorizationComponent, KirovCategoryConstructionComponent,
    FooterComponent, DefaultBodyCategoryConstructionComponent,
    EquipmentRepairCategoryComponent, KirovEquipmentRepairCategoryComponent,
    RequestMemberComponent, EarlyCompletionTaskComponent,
    ChatSupportComponent, UserAccountComponent,
    JobHomeComponent, WhyUsComponent, SpecialAbilitiesComponent,
    AdvantagesComponent, FormationOrderPriceComponent, CreateVacancyComponent,
    CreateVacancyContentComponent,FindVacanciesPageComponent, FindVacanciesComponent,
    VacancyWrapperComponent, ListVacanciesComponent, VacancyComponent,
    FilterFieldsActivityComponent, ChatListComponent, MapVacancyHandlerComponent,
    UpdateVacancyComponent, OfferLoadAppComponent, FindResumePageComponent,
    FindResumeComponent, JobCategoriesComponent, JobWhyUsComponent,
    JobSpecialAbilitiesComponent, JobAdvantagesComponent, JobNavigateServiceComponent,
    ListResumeComponent, OfferingVacancyWrapperComponent, VacancyUserAuthorizationComponent,
    JobResumeComponent, CommonDialogResumeComponent, SubmitResumeWrapperComponent, ResumeEditorComponent,
    PaymentsCreateVacancyComponent, VacancyNotEnoughMoneyComponent, ResumePayForViewComponent, ResumeNotEnoughMoneyComponent
  ],
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatInputModule,
    MatOptionModule, MatSelectModule,
    MatDatepickerModule, NgxMaterialTimepickerModule,
    MatNativeDateModule, MatCheckboxModule,
    MatDialogModule, MatDividerModule,
    CalendarModule, MatChipsModule,
    MatTooltipModule, RouterModule,
    FileUploadModule, DropdownModule,
    InputMaskModule, SpinnerModule,
    KeyFilterModule, ReactiveFormsModule,
    ImageCropperModule, MatIconModule,
    NgxSummernoteModule, MatProgressBarModule,
    MultiSelectModule, MatCardModule
  ],
  entryComponents: [
    FindTaskComponent, TaskWrapperComponent,
    CancelTaskComponent, PayTaskComponent,
    RequestCommentComponent, OfferingTaskWrapperComponent,
    CommonDialogNotificationComponent, OfferTaskComponent,
    VerificationRequestComponent, RequestNotEnoughMoneyComponent,
    CancelRequestComponent, AddDataForLoginComponent,
    ChoosePayToolComponent, ChoosePerformerPayToolComponent,
    AcceptNotificationComponent, RegistrationNotComponent,
    InterviewComponent, NotActualityNotificationComponent,
    MobileTooltipComponent, ContextmenuComponent,
    ChooseAmountComponent, AddImageWorkExampleComponent,
    HistoryTasksComponent, CommonDialogUserAuthorizationComponent,
    EarlyCompletionTaskComponent, OfferLoadAppComponent,
    OfferingVacancyWrapperComponent, VacancyUserAuthorizationComponent,
    CommonDialogResumeComponent, ResumeEditorComponent,
    SubmitResumeWrapperComponent, PaymentsCreateVacancyComponent,
    VacancyNotEnoughMoneyComponent, ResumePayForViewComponent, ResumeNotEnoughMoneyComponent
  ],
  exports: [
    CreateTaskContentComponent, FindTaskPageComponent,
    TaskComponent, CommonLayoutComponent,
    GeneralNavComponent, HomeComponent,
    CreateTaskComponent, LoginLayoutComponent,
    LoginComponent, ChatWrapperComponent,
    ChatContactListComponent, ValidationErrorTemplateComponent,
    ListTasksComponent, CommentComponent, SidePanelComponent,
    NotificationDisplayComponent, UserPhotoComponent,
    DatetimeComponent, ListPromotionsComponent,
    PromotionComponent, PromotionWrapperComponent,
    MobileTooltipComponent, DisplayAdvertisingComponent,
    WorkExamplesComponent, VacancyComponent, ListVacanciesComponent,
    ListResumeComponent
  ],
  providers: [
    SessionStorageService,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class SharedModuleModule { }
