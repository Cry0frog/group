import { UpdateVacancyComponent } from './../shared-module/vacancies/update-vacancy/update-vacancy.component';
import { ExecutorPanelComponent } from './components/executor-panel/executor-panel.component';
import { ListTasksComponent } from 'src/app/components/partner/components/common/list-tasks/list-tasks.component';
import { UpdateTaskComponent } from './../shared-module/tasks/update-task/update-task.component';
import { PromotionWrapperComponent } from './../shared-module/promotions/promotion-page/promotion-wrapper/promotion-wrapper.component';
import { RatesListComponent } from './components/rates/rates-list/rates-list.component';
import { PaymentsComponent } from './components/rates/payments/payments.component';
import { ArbitrationChatComponent } from './components/chat/arbitration-chat/arbitration-chat.component';
import { CommonChatComponent } from './components/chat/common-chat/common-chat.component';
import { ActiveUrls } from './../../auth/activeUrls';
import { PerformerTaskComponent } from './components/my-tasks/performer-task/performer-task.component';
import { RatesComponent } from './components/rates/rates.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartnerComponent } from './partner.component';
import { ListTasksAndRequestsWrapperComponent } from './components/executor-panel/list-tasks-and-requests-wrapper/list-tasks-and-requests-wrapper.component';
import { PartnerShareComponent } from './components/partner-share/partner-share.component';
import { PartnerTaskComponent } from './components/my-tasks/partner-task/partner-task.component';
import { MyPromotionWrapperComponent } from './components/partner-share/my-promotion-wrapper/my-promotion-wrapper.component';
import { MyVacancysComponent } from './components/my-vacancies/my-vacancies.component';
import { ListVacanciesComponent } from '../shared-module/vacancies/list-vacancies/list-vacancies.component';
import { PartnerVacancyWrapperComponent } from './components/my-vacancies/partner-vacancy-wrapper/partner-vacancy-wrapper.component';
import { VacanciesSubmittedResumeWrapperComponent } from './components/my-vacancies/vacancies-submitted-resume-wrapper/vacancies-submitted-resume-wrapper.component';
import { MyFavoritesJobComponent } from './components/my-favorites-job/my-favorites-job.component';
import { ListVacanciesWrapperComponent } from './components/profile/list-vacancies-wrapper/list-vacancies-wrapper.component';
import { WorkerVacancyWrapperComponent } from './components/my-vacancies/worker-vacancy-wrapper/worker-vacancy-wrapper.component';

const routes: Routes = [
  {
    path: ':id',
    component: PartnerComponent,
    children: [
      { path: '', redirectTo: ActiveUrls.PARTNER_PROFILE, pathMatch: "full" },
      { path: ActiveUrls.PARTNER_PROFILE, component: ProfileComponent },
      {
        path: ActiveUrls.PARNTER_SHARE,
        component: PartnerShareComponent,
        children: [
          { path: '', component: MyPromotionWrapperComponent},
          { path: ':id', component: PromotionWrapperComponent},

        ]
      },
      {
        path: ActiveUrls.PARTNER_MY_TASKS,
        component: ListTasksAndRequestsWrapperComponent,
        children: [
          { path: '', component: ListTasksComponent },
          { path: ':id', component: PartnerTaskComponent },
          { path: 'update/:id', component: UpdateTaskComponent }
        ]
      },
      {
        path: ActiveUrls.EXECUTOR_TASKS,
        component: ListTasksAndRequestsWrapperComponent,
        children: [
          { path: '', component: ListTasksComponent },
          { path: ':id', component: PerformerTaskComponent },
          { path: 'update/:id', component: UpdateTaskComponent }
        ]
      },
      {
        path: ActiveUrls.PARTNER_EXECUTOR_PANEL,
        component: ListTasksAndRequestsWrapperComponent,
        children: [
          { path: '', component: ExecutorPanelComponent },
          { path: ':id', component: PerformerTaskComponent },
          { path: 'update/:id', component: UpdateTaskComponent }
        ]
      },
      {
        path: ActiveUrls.PARTNER_VACANCY,
        component: MyVacancysComponent,
        children: [
          { path: '', component: ListVacanciesWrapperComponent },
          { path: ':id', component: PartnerVacancyWrapperComponent },
          { path: 'update/:id', component: UpdateVacancyComponent }
        ]
      },
      {
        path: ActiveUrls.PARTNER_RESUME,
        component: MyVacancysComponent,
        children: [
          { path: '', component: VacanciesSubmittedResumeWrapperComponent },
          { path: ':id', component: WorkerVacancyWrapperComponent },
        ]
      },
      {
        path: ActiveUrls.PARTNER_FAVORITE_JOB,
        component: MyVacancysComponent,
        children: [
          { path: '', component: MyFavoritesJobComponent },
          { path: ':id', component: WorkerVacancyWrapperComponent },
        ]
      },
      {
        path: ActiveUrls.PARTNER_RATES,
        component: RatesComponent,
        children: [
          { path: '', component: RatesListComponent }
        ]
      },
      {
        path: ActiveUrls.PARTNER_PAYMENTS,
        component: RatesComponent,
        children: [
          { path: '', component: PaymentsComponent }
        ]
      },
    ],
    runGuardsAndResolvers: 'always'
  },
  {
    path: ':id/chat/:chatId',
    component: CommonChatComponent,
  },
  {
    path: ':id/chat',
    component: CommonChatComponent,
  },
  {
    path: ':id/arbitration/:chatId',
    component: ArbitrationChatComponent
  },
  {
    path: ':id/arbitration',
    component: ArbitrationChatComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerRoutingModule { }
