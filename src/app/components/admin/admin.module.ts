import { UpdatePhotoFakeComponent } from './components/development/fake-users/update-photo-fake/update-photo-fake.component';
import { CommonChatsComponent } from './components/chats-area/chats/common-chats/common-chats.component';
import { CalendarModule } from 'primeng/calendar';
import { SharedModuleModule } from './../shared-module/shared-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatDialogModule,
  MatButtonModule, MatCardModule,
  MatOptionModule, MatSelectModule,
  MatCheckboxModule, MatListModule,
  MatExpansionModule, MatTooltipModule, MatStepperModule
} from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminNavComponent } from './admin-nav/admin-nav.component';
import { CategoriesComponent } from './components/categories-area/categories/categories.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { AdvertisesComponent } from './components/advertises/advertises.component';
import { AddCategoryComponent } from './components/categories-area/categories/add-category/add-category.component';
import { PreviewWrapperComponent } from './components/categories-area/categories/preview-wrapper/preview-wrapper.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import { ChatsAreaComponent } from './components/chats-area/chats-area.component';
import { ArbitrationsCommonComponent } from './components/chats-area/arbitrations/arbitrations-common/arbitrations-common.component';
import { AllArbitrationsWrapperComponent } from './components/chats-area/arbitrations/all-arbitrations-wrapper/all-arbitrations-wrapper.component';
import { MyArbitrationsWrapperComponent } from './components/chats-area/arbitrations/my-arbitrations-wrapper/my-arbitrations-wrapper.component';
import { TaskChatsComponent } from './components/chats-area/chats/task-chats/task-chats.component';
import { MyChatsComponent } from './components/chats-area/chats/my-chats/my-chats.component';
import { AdminChatWrapperComponent } from './components/chats-area/chats/admin-chat-wrapper/admin-chat-wrapper.component';
import { AdminArbitrationWrapperComponent } from './components/chats-area/arbitrations/admin-arbitration-wrapper/admin-arbitration-wrapper.component';
import { CommonStatisticsComponent } from './components/statistics/common-statistics/common-statistics.component';
import { UserStatisticsComponent } from './components/statistics/user-statistics/user-statistics.component';
import { StatisticChartComponent } from './components/statistics/common-statistics/statistic-chart/statistic-chart.component';
import { ChartsModule } from 'ng2-charts';
import { DropdownModule } from 'primeng/dropdown';
import { CommissionsComponent } from './components/commissions/commissions.component';
import { AddCommissionComponent } from './components/commissions/add-commission/add-commission.component';
import { DeleteCommissionComponent } from './components/commissions/delete-commission/delete-commission.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCategoryComponent } from './components/categories-area/categories/image-category/image-category.component';
import { InputMaskModule } from 'primeng/inputmask';
import { PayoutsComponent } from './components/payouts/payouts.component';
import { TransferCategoryComponent } from './components/categories-area/categories/transfer-category/transfer-category.component';
import { CommonRatesComponent } from './components/common-rates/common-rates.component';
import { RegionRatesComponent } from './components/common-rates/region-rates/region-rates.component';
import { HourRatesComponent } from './components/common-rates/hour-rates/hour-rates.component';
import { RateCalculatorComponent } from './components/common-rates/rate-calculator/rate-calculator.component';
import { AdminSettingComponent } from './components/admin-setting/admin-setting.component';
import { AddAdvertisingComponent } from './components/advertises/add-advertising/add-advertising.component';
import { DeleteAdvertisingComponent } from './components/advertises/delete-advertising/delete-advertising.component';
import { UsersAreaComponent } from './components/users-area/users-area.component';
import { LegalEntitiesComponent } from './components/users-area/legal-entities/legal-entities.component';
import { BlockedUsersComponent } from './components/users-area/blocked-users/blocked-users.component';
import { BlockUsersComponent } from './components/users-area/users/block-users/block-users.component';
import { ChangeStatusComponent } from './components/users-area/legal-entities/change-status/change-status.component';
import { RatesComponent } from './components/rates-area/rates/rates.component';
import { UsersComponent } from './components/users-area/users/users.component';
import { AddUserComponent } from './components/users-area/users/add-user/add-user.component';
import { UpdateStatusComponent } from './components/users-area/users/update-status/update-status.component';
import { DeleteUserComponent } from './components/users-area/users/delete-user/delete-user.component';
import { DeleteCategoryComponent } from './components/categories-area/categories/delete-category/delete-category.component';
import { AddRateComponent } from './components/rates-area/rates/add-rate/add-rate.component';
import { DeleteRateComponent } from './components/rates-area/rates/delete-rate/delete-rate.component';
import { RatesAreaComponent } from './components/rates-area/rates-area.component';
import { DevelopmentComponent } from './components/development/development.component';
import { FakeUsersComponent } from './components/development/fake-users/fake-users.component';
import { FakeTasksComponent } from './components/development/fake-tasks/fake-tasks.component';
import { EditFakeUsersComponent } from './components/development/fake-users/edit-fake-users/edit-fake-users.component';
import { UserPhotoComponent } from '../shared-module/user-photo/user-photo.component';
import { CreateDevelompentTaskComponent } from './components/development/fake-tasks/create-develompent-task/create-develompent-task.component';
import { DevPartnerAssignComponent } from './components/development/fake-tasks/create-develompent-task/dev-partner-assign/dev-partner-assign.component';
import { ViewTasksComponent } from './components/view-tasks/view-tasks.component';
import { DeleteTaskComponent } from './components/view-tasks/delete-task/delete-task.component';
import { CommonPromotionsComponent } from './components/common-promotions/common-promotions.component';
import { ListRequestShareComponent } from './components/common-promotions/list-request-share/list-request-share.component';
import { AdminPromotionComponent } from './components/common-promotions/admin-promotion/admin-promotion.component';
import { EditPromotionComponent } from './components/common-promotions/admin-promotion/edit-promotion/edit-promotion.component';
import { DeletePromotionComponent } from './components/common-promotions/admin-promotion/delete-promotion/delete-promotion.component';
import { UpdatePhotoPromotionComponent } from './components/common-promotions/admin-promotion/update-photo-promotion/update-photo-promotion.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { UserOperationsComponent } from './components/users-area/user-operations/user-operations.component';
import { AdminNewsComponent } from './components/admin-news/admin-news.component';
import { EditNewsComponent } from './components/admin-news/edit-news/edit-news.component';
import { DeleteNewsComponent } from './components/admin-news/delete-news/delete-news.component';
import { UpdatePhotoNewsComponent } from './components/admin-news/update-photo-news/update-photo-news.component';
import { FieldsActivityComponent } from './components/categories-area/fields-activity/fields-activity.component';
import { JobAreaComponent } from './components/job-area/job-area.component';
import { CategoriesAreaComponent } from './components/categories-area/categories-area.component';
import { AddFieldCategoryComponent } from './components/categories-area/fields-activity/add-field-category/add-field-category.component';
import { DeleteFieldCategoryComponent } from './components/categories-area/fields-activity/delete-field-category/delete-field-category.component';
import { UsersResumeComponent } from './components/job-area/users-resume/users-resume.component';
import { UsersVacanciesComponent } from './components/job-area/users-vacancies/users-vacancies.component';
import { DeleteVacancyComponent } from './components/job-area/users-vacancies/delete-vacancy/delete-vacancy.component';
import { ImageFieldActivityComponent } from './components/categories-area/fields-activity/image-field-activity/image-field-activity.component';
import { JobStatisticsComponent } from './components/statistics/job-statistics/job-statistics.component';
import { DeleteResumeComponent } from './components/job-area/users-resume/delete-resume/delete-resume.component';
import { OneTimePaymentsComponent } from './components/rates-area/one-time-payments/one-time-payments.component';
import { SubscriptionsComponent } from './components/rates-area/subscriptions/subscriptions.component';
import { AddRateJobComponent } from './components/rates-area/rates-job-components/add-rate-job/add-rate-job.component';
import { RatesJobComponentsComponent } from './components/rates-area/rates-job-components/rates-job-components.component';
import { DeleteRateJobComponent } from './components/rates-area/rates-job-components/delete-rate-job/delete-rate-job.component';
import { PayAdminSettingComponent } from './components/rates-area/one-time-payments/pay-admin-setting/pay-admin-setting.component';
import { VacancyChatsComponent } from './components/chats-area/vacancy-chats/vacancy-chats.component';


@NgModule({
  declarations: [AdminComponent, AdminNavComponent,
    UsersComponent, CategoriesComponent,
    RatesComponent, StatisticsComponent,
    AdvertisesComponent, AddCategoryComponent,
    PreviewWrapperComponent, AddUserComponent,
    DeleteUserComponent, UpdateStatusComponent,
    DeleteCategoryComponent, AddRateComponent,
    DeleteRateComponent, ChatsAreaComponent,
    ChatsAreaComponent, ArbitrationsCommonComponent,
    AllArbitrationsWrapperComponent, MyArbitrationsWrapperComponent,
    TaskChatsComponent, MyChatsComponent,
    CommonChatsComponent, AdminChatWrapperComponent,
    AdminArbitrationWrapperComponent, CommonStatisticsComponent,
    UserStatisticsComponent, StatisticChartComponent,
    CommissionsComponent, AddCommissionComponent,
    DeleteCommissionComponent, ImageCategoryComponent,
    PayoutsComponent, TransferCategoryComponent,
    CommonRatesComponent, RegionRatesComponent,
    LegalEntitiesComponent,
    ChangeStatusComponent, AdminSettingComponent,
    AddAdvertisingComponent, DeleteAdvertisingComponent,
    BlockUsersComponent, UsersAreaComponent,
    BlockedUsersComponent, RatesAreaComponent,
    HourRatesComponent, RateCalculatorComponent,
    DevelopmentComponent, FakeUsersComponent,
    FakeTasksComponent, EditFakeUsersComponent,
    CreateDevelompentTaskComponent, DevPartnerAssignComponent,
    ViewTasksComponent, DeleteTaskComponent,
    ListRequestShareComponent, AdminPromotionComponent,
    EditPromotionComponent, DeletePromotionComponent,
    UpdatePhotoFakeComponent, UpdatePhotoPromotionComponent,
    CommonPromotionsComponent, UserOperationsComponent,
    AdminNewsComponent, EditNewsComponent,
    DeleteNewsComponent, UpdatePhotoNewsComponent,
    FieldsActivityComponent, JobAreaComponent,
    CategoriesAreaComponent, AddFieldCategoryComponent,
    DeleteFieldCategoryComponent, UsersResumeComponent,
    UsersVacanciesComponent, DeleteVacancyComponent,
    ImageFieldActivityComponent, JobStatisticsComponent,
    DeleteResumeComponent,
    OneTimePaymentsComponent,
    SubscriptionsComponent,
    AddRateJobComponent,
    DeleteRateJobComponent,
    RatesJobComponentsComponent,
    PayAdminSettingComponent,
    VacancyChatsComponent,
  ],
  imports: [
    CommonModule, AdminRoutingModule,
    MatInputModule, FormsModule,
    MatButtonModule, MatDialogModule,
    MatCardModule, MatOptionModule,
    MatSelectModule, MatTooltipModule,
    MatCheckboxModule, MatListModule,
    SharedModuleModule, MatExpansionModule,
    MatBadgeModule, MatSidenavModule,
    MatSliderModule, MatSlideToggleModule,
    MatAutocompleteModule, MatBottomSheetModule,
    MatButtonToggleModule, MatIconModule,
    MatMenuModule, MatPaginatorModule,
    MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule,
    MatSnackBarModule, MatSortModule, MatTableModule,
    MatTabsModule, MatToolbarModule, ReactiveFormsModule,
    CalendarModule, ChartsModule, DropdownModule,
    ImageCropperModule, InputMaskModule,
    MatStepperModule, NgxSummernoteModule,
    MatProgressBarModule
  ],
  entryComponents: [
    AddCategoryComponent, PreviewWrapperComponent,
    AddUserComponent, DeleteUserComponent,
    UpdateStatusComponent, DeleteCategoryComponent,
    AddRateComponent, DeleteRateComponent,
    AddCommissionComponent, DeleteCommissionComponent,
    ImageCategoryComponent, TransferCategoryComponent,
    BlockUsersComponent, ChangeStatusComponent,
    EditFakeUsersComponent, UserPhotoComponent,
    CreateDevelompentTaskComponent, DeleteTaskComponent,
    EditPromotionComponent, DeletePromotionComponent,
    AddAdvertisingComponent, DeleteAdvertisingComponent,
    UpdatePhotoFakeComponent, UpdatePhotoPromotionComponent,
    EditNewsComponent, DeleteNewsComponent,
    UpdatePhotoNewsComponent, AddFieldCategoryComponent,
    DeleteAdvertisingComponent, DeleteVacancyComponent,
    ImageFieldActivityComponent, DeleteResumeComponent,
    AddRateJobComponent
  ]
})
export class AdminModule { }
