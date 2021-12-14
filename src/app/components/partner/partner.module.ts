import { MyPromotionWrapperComponent } from './components/partner-share/my-promotion-wrapper/my-promotion-wrapper.component';
import { PromotionWrapperComponent } from './../shared-module/promotions/promotion-page/promotion-wrapper/promotion-wrapper.component';
import { ObligatoryPerformerInfoComponent } from './components/executor-panel/obligatory-performer-info/obligatory-performer-info.component';
import { ChangeAccountInfoComponent } from './components/change-account-info/change-account-info.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { DropdownModule } from 'primeng/dropdown';
import { PartnerTaskComponent } from './components/my-tasks/partner-task/partner-task.component';
import { SharedModuleModule } from './../shared-module/shared-module.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnerRoutingModule } from './partner-routing.module';
import { PartnerComponent } from './partner.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MyTasksComponent } from './components/my-tasks/my-tasks.component';
import { ExecutorPanelComponent } from './components/executor-panel/executor-panel.component';
import { RatesComponent } from './components/rates/rates.component';
import { MatInputModule, MatDialogModule, MatButtonModule, MatTooltipModule, MatCheckboxModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListTasksWrapperComponent } from './components/executor-panel/list-tasks-wrapper/list-tasks-wrapper.component';
import { PerformerTaskComponent } from './components/my-tasks/performer-task/performer-task.component'
import { PaymentComponent } from './components/payment/payment.component';
import { RighBottomPartnerAreaComponent } from './components/common/right-bottom-partner-area/right-bottom-partner-area.component';
import { PartnerCardComponent } from './components/common/right-bottom-partner-area/partner-card/partner-card.component';
import { CommonChatComponent } from './components/chat/common-chat/common-chat.component';
import { ArbitrationChatComponent } from './components/chat/arbitration-chat/arbitration-chat.component';
import { UpdatePasswordComponent } from './components/profile/update-password/update-password.component';
import { EditPartnerInfoComponent } from './components/profile/edit-partner-info/edit-partner-info.component';
import { MatSelectModule } from '@angular/material/select';
import { InputMaskModule } from 'primeng/inputmask';
import { CommentProfileWrapperComponent } from './components/profile/comment-profile-wrapper/comment-profile-wrapper.component';
import { PaymentsComponent } from './components/rates/payments/payments.component';
import { RatesListComponent } from './components/rates/rates-list/rates-list.component';
import { ExecutePayComponent } from './components/rates/payments/execute-pay/execute-pay.component';
import { ListTasksAndRequestsWrapperComponent } from './components/executor-panel/list-tasks-and-requests-wrapper/list-tasks-and-requests-wrapper.component';
import { UserPhotoComponent } from '../shared-module/user-photo/user-photo.component';
import { PartnerShareComponent } from './components/partner-share/partner-share.component';
import { EditPhotoProfileComponent } from './components/profile/edit-photo-profile/edit-photo-profile.component';
import { ListPromotionsComponent } from '../shared-module/promotions/list-promotions/list-promotions.component';
import { PromotionComponent } from '../shared-module/promotions/promotion/promotion.component';
import { EditLegalEntityInfoComponent } from './components/profile/edit-legal-entity-info/edit-legal-entity-info.component';
import { PartnerInfoComponent } from './components/profile/partner-info/partner-info.component';
import { LegalEntityInfoComponent } from './components/profile/legal-entity-info/legal-entity-info.component';
import { UnlockNotEnoughMoneyComponent } from './unlock-not-enough-money/unlock-not-enough-money.component';
import { BlockingNotificationComponent } from './blocking-notification/blocking-notification.component';
import { BecomeMemberComponent } from './components/profile/become-member/become-member.component';
import { ChangeLegalEntityInfoComponent } from './components/change-account-info/change-legal-entity-info/change-legal-entity-info.component';
import { MyListPromotionsWrapperComponent } from './components/partner-share/my-list-promotions-wrapper/my-list-promotions-wrapper.component';
import { ObligatoryLegalEntityInfoComponent } from './components/executor-panel/obligatory-legal-entity-info/obligatory-legal-entity-info.component';
import { TypePerformCategoriesComponent } from './components/type-perform-categories/type-perform-categories.component';
import { ProfilePerformeCategoriesComponent } from './components/profile/profile-perform-categories/profile-perform-categories.component';
import { DisplayAdvertisingComponent } from '../shared-module/display-advertising/display-advertising.component';
import { WorkExamplesComponent } from '../shared-module/work-examples/work-examples.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MyVacancysComponent } from './components/my-vacancies/my-vacancies.component';
import { PartnerVacancyWrapperComponent } from './components/my-vacancies/partner-vacancy-wrapper/partner-vacancy-wrapper.component';
import { VacancyComponent } from '../shared-module/vacancies/vacancy/vacancy.component';
import { VacanciesSubmittedResumeWrapperComponent } from './components/my-vacancies/vacancies-submitted-resume-wrapper/vacancies-submitted-resume-wrapper.component';
import { ListVacanciesComponent } from '../shared-module/vacancies/list-vacancies/list-vacancies.component';
import { MyFavoritesJobComponent } from './components/my-favorites-job/my-favorites-job.component';
import { ListVacanciesWrapperComponent } from './components/profile/list-vacancies-wrapper/list-vacancies-wrapper.component';
import { ListResumeComponent } from '../shared-module/resume/list-resume/list-resume.component';
import { WorkerVacancyWrapperComponent } from './components/my-vacancies/worker-vacancy-wrapper/worker-vacancy-wrapper.component';
import { SubscriptionPayComponent } from './components/profile/subscription-pay/subscription-pay.component';
import { SubscriptionNotEnoughMoneyComponent } from './components/profile/subscription-pay/subscription-not-enough-money/subscription-not-enough-money.component';
import { SuccessNotificationComponent } from './components/success-notification/success-notification.component';

@NgModule({
  declarations: [PartnerComponent, ProfileComponent, MyTasksComponent,
    ExecutorPanelComponent, RatesComponent, PaymentComponent,
    PartnerTaskComponent, PerformerTaskComponent, EditPartnerInfoComponent,
    ListTasksWrapperComponent, TypePerformCategoriesComponent,
    RighBottomPartnerAreaComponent, PartnerCardComponent, CommonChatComponent,
    ArbitrationChatComponent, UpdatePasswordComponent,
    EditPartnerInfoComponent, CommentProfileWrapperComponent,
    PaymentsComponent, RatesListComponent, ExecutePayComponent,
    ListTasksAndRequestsWrapperComponent, EditLegalEntityInfoComponent,
    PartnerInfoComponent, LegalEntityInfoComponent,
    UnlockNotEnoughMoneyComponent, BlockingNotificationComponent, BecomeMemberComponent,
    PartnerShareComponent, ChangeAccountInfoComponent, ObligatoryPerformerInfoComponent,
    EditPhotoProfileComponent, MyPromotionWrapperComponent, ChangeLegalEntityInfoComponent,
    MyListPromotionsWrapperComponent, ObligatoryLegalEntityInfoComponent,
    ProfilePerformeCategoriesComponent,MyVacancysComponent, PartnerVacancyWrapperComponent,
    VacanciesSubmittedResumeWrapperComponent, MyFavoritesJobComponent,
    ListVacanciesWrapperComponent, WorkerVacancyWrapperComponent, SubscriptionPayComponent,
    SubscriptionNotEnoughMoneyComponent, SuccessNotificationComponent
  ],
  imports: [
    CommonModule, PartnerRoutingModule,
    MatInputModule, FormsModule,
    SharedModuleModule, MatTooltipModule,
    MatDialogModule, InputMaskModule,
    MatSelectModule, MatButtonModule,
    ReactiveFormsModule, MatIconModule,
    DropdownModule, MatTableModule,
    MatSortModule, MatCheckboxModule,
    MatSlideToggleModule
  ],
  exports: [
    PaymentComponent, SubscriptionPayComponent, SubscriptionNotEnoughMoneyComponent
  ],
  entryComponents: [
    PaymentComponent, UpdatePasswordComponent,
    EditPartnerInfoComponent, UserPhotoComponent,
    ExecutePayComponent, EditLegalEntityInfoComponent,
    UnlockNotEnoughMoneyComponent, BlockingNotificationComponent,
    BecomeMemberComponent, ExecutePayComponent, ChangeAccountInfoComponent,
    ObligatoryPerformerInfoComponent, ListPromotionsComponent,
    PromotionComponent, PromotionWrapperComponent,
    EditPhotoProfileComponent, ChangeLegalEntityInfoComponent,
    DisplayAdvertisingComponent, ObligatoryLegalEntityInfoComponent,
    WorkExamplesComponent, VacancyComponent, ListVacanciesComponent,
    ListResumeComponent, SubscriptionPayComponent,
    SubscriptionNotEnoughMoneyComponent, SuccessNotificationComponent
  ]
})
export class PartnerModule { }
