import { ActiveUrls } from 'src/app/auth/activeUrls';
import { UsersResumeComponent } from './components/job-area/users-resume/users-resume.component';
import { JobAreaComponent } from './components/job-area/job-area.component';
import { CategoriesAreaComponent } from './components/categories-area/categories-area.component';
import { CommonPromotionsComponent } from './components/common-promotions/common-promotions.component';
import { HourRatesComponent } from './components/common-rates/hour-rates/hour-rates.component';
import { RegionRatesComponent } from './components/common-rates/region-rates/region-rates.component';
import { PayoutsComponent } from './components/payouts/payouts.component';
import { CommissionsComponent as CommissionsComponent } from './components/commissions/commissions.component';
import { CommonStatisticsComponent } from './components/statistics/common-statistics/common-statistics.component';
import { AdminArbitrationWrapperComponent } from './components/chats-area/arbitrations/admin-arbitration-wrapper/admin-arbitration-wrapper.component';
import { AdminChatWrapperComponent } from './components/chats-area/chats/admin-chat-wrapper/admin-chat-wrapper.component';
import { MyChatsComponent } from './components/chats-area/chats/my-chats/my-chats.component';
import { TaskChatsComponent } from './components/chats-area/chats/task-chats/task-chats.component';
import { ChatsAreaComponent } from './components/chats-area/chats-area.component';
import { AllArbitrationsWrapperComponent } from './components/chats-area/arbitrations/all-arbitrations-wrapper/all-arbitrations-wrapper.component';
import { MyArbitrationsWrapperComponent } from './components/chats-area/arbitrations/my-arbitrations-wrapper/my-arbitrations-wrapper.component';
import { AdvertisesComponent } from './components/advertises/advertises.component';
import { CategoriesComponent } from './components/categories-area/categories/categories.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { UsersAreaComponent } from './components/users-area/users-area.component';
import { UsersComponent } from './components/users-area/users/users.component';
import { LegalEntitiesComponent } from './components/users-area/legal-entities/legal-entities.component';
import { BlockedUsersComponent } from './components/users-area/blocked-users/blocked-users.component';
import { RatesComponent } from '../admin/components/rates-area/rates/rates.component';
import { RatesAreaComponent } from './components/rates-area/rates-area.component';
import { DevelopmentComponent } from './components/development/development.component';
import { FakeUsersComponent } from './components/development/fake-users/fake-users.component';
import { FakeTasksComponent } from './components/development/fake-tasks/fake-tasks.component';
import { ViewTasksComponent } from './components/view-tasks/view-tasks.component';
import { AdminPromotionComponent } from './components/common-promotions/admin-promotion/admin-promotion.component';
import { ListRequestShareComponent } from './components/common-promotions/list-request-share/list-request-share.component';
import { AdminNewsComponent } from './components/admin-news/admin-news.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { UserStatisticsComponent } from './components/statistics/user-statistics/user-statistics.component';
import { FieldsActivityComponent } from './components/categories-area/fields-activity/fields-activity.component';
import { UsersVacanciesComponent } from './components/job-area/users-vacancies/users-vacancies.component';
import { JobStatisticsComponent } from './components/statistics/job-statistics/job-statistics.component';
import { OneTimePaymentsComponent } from './components/rates-area/one-time-payments/one-time-payments.component';
import { SubscriptionsComponent } from './components/rates-area/subscriptions/subscriptions.component';
import { VacancyChatsComponent } from './components/chats-area/vacancy-chats/vacancy-chats.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'users' },
      {
        path: 'users',
        component: UsersAreaComponent,
        children: [
          { path: '', component: UsersComponent },
        ]
      },
      {
        path: 'legal_entities',
        component: UsersAreaComponent,
        children: [
          { path: '', component: LegalEntitiesComponent }
        ]
      },
      {
        path: 'blocked_users',
        component: UsersAreaComponent,
        children: [
          { path: '', component: BlockedUsersComponent }
        ]
      },
      {
        path: 'categories',
        component: CategoriesAreaComponent,
        children: [
          { path: '', component: CategoriesComponent }
        ]
      },
      {
        path: 'fields_activity',
        component: CategoriesAreaComponent,
        children: [
          { path: '', component: FieldsActivityComponent }
        ]
      },
      {
        path: 'users_vacancies',
        component: JobAreaComponent,
        children: [
          { path: '', component:  UsersVacanciesComponent}
        ]
      },
      {
        path: 'users_resume',
        component: JobAreaComponent,
        children: [
          { path: '', component: UsersResumeComponent }
        ]
      },
      { path: 'tasks_monitoring', component: ViewTasksComponent },
      { path: 'payouts', component: PayoutsComponent },
      { path: 'commissions', component: CommissionsComponent },
      {
        path: 'common_rates',
        component: RatesAreaComponent,
        children: [
          { path: '', component: RatesComponent },
        ]
      },
      {
        path: 'region_rates',
        component: RatesAreaComponent,
        children: [
          { path: '', component: RegionRatesComponent },
        ]
      },
      {
        path: 'hour_rates',
        component: RatesAreaComponent,
        children: [
          { path: '', component: HourRatesComponent },
        ]
      },
      {
        path: ActiveUrls.ONE_TIME_PAYMENTS,
        component: RatesAreaComponent,
        children: [
          { path: '', component: OneTimePaymentsComponent },
        ]
      },
      {
        path: ActiveUrls.SUBSCRIPTIONS,
        component: RatesAreaComponent,
        children: [
          { path: '', component: SubscriptionsComponent },
        ]
      },
      {
        path: 'statistics',
        component: StatisticsComponent,
        children: [
          { path: '', redirectTo: ActiveUrls.ADMIN_COMMON_STATISTICS },
          { path: ActiveUrls.ADMIN_COMMON_STATISTICS, component: CommonStatisticsComponent },
          { path: ActiveUrls.ADMIN_USER_STATISTICS, component: UserStatisticsComponent },
          { path: ActiveUrls.ADMIN_JOB_STATISTICS, component: JobStatisticsComponent }
        ]
      },
      { path: 'advertises', component: AdvertisesComponent },
      {
        path: 'chats',
        component: ChatsAreaComponent,
        children: [
          { path: '', redirectTo: ActiveUrls.ADMIN_MY_ARBITRATIONS },
          { path: ActiveUrls.ADMIN_MY_ARBITRATIONS, component: MyArbitrationsWrapperComponent },
          { path: ActiveUrls.ADMIN_ALL_ARBITRATIONS, component: AllArbitrationsWrapperComponent },
          { path: ActiveUrls.ADMIN_TASK_CHATS, component: TaskChatsComponent },
          { path: ActiveUrls.ADMIN_VACANCY_CHATS, component: VacancyChatsComponent },
          { path: ActiveUrls.ADMIN_MY_CHATS, component: MyChatsComponent }
        ]
      },
      {
        path: 'development',
        component: DevelopmentComponent,
        children: [
          { path: '', redirectTo: ActiveUrls.ADMIN_FAKE_PARTNERS },
          { path: ActiveUrls.ADMIN_FAKE_PARTNERS, component: FakeUsersComponent },
          { path: ActiveUrls.ADMIN_FAKE_TASKS, component: FakeTasksComponent },
        ]
      },
      { path: 'promotion',
        component: CommonPromotionsComponent,
        children: [
          { path: '', redirectTo: 'promotions' },
          { path: 'promotions', component: AdminPromotionComponent },
          { path: 'participants', component: ListRequestShareComponent }
        ]
      },
      { path: 'news', component: AdminNewsComponent },
      {
        path: 'chats/:chatId',
        component: AdminChatWrapperComponent
      },
      {
        path: 'arbitration/:arbitrationId',
        component: AdminArbitrationWrapperComponent
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
