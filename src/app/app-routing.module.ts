import { FindResumePageComponent } from './components/shared-module/resume/find-resume-page/find-resume-page.component';
import { VacancyWrapperComponent } from './components/shared-module/vacancies/find-vacancies-page/vacancy-wrapper/vacancy-wrapper.component';
import { FindVacanciesPageComponent } from './components/shared-module/vacancies/find-vacancies-page/find-vacancies-page.component';
import { JobHomeComponent } from './components/shared-module/job-home/job-home.component';
import { NewsListComponent } from './components/shared-module/home/our-news/news-list/news-list.component';
import { UpdateTaskComponent } from './components/shared-module/tasks/update-task/update-task.component';
import { NotFoundPageComponent } from './components/shared-module/not-found-page/not-found-page.component';
import { FindPerformerComponent } from './components/shared-module/performers/find-performer-page/find-performer/find-performer.component';
import { FindPerformerPageComponent } from './components/shared-module/performers/find-performer-page/find-performer-page.component';
import { AboutUsComponent } from './components/shared-module/home/about-us/about-us.component';
import { OurNewsComponent } from './components/shared-module/home/our-news/our-news.component';
import { OurPartnersComponent } from './components/shared-module/home/our-partners/our-partners.component';
import { PayRedirectWrapperComponent } from './components/shared-module/tasks/create-task-content/pay-task/pay-redirect-wrapper/pay-redirect-wrapper.component';
import { FindTaskComponent } from './components/shared-module/tasks/find-task-page/find-task/find-task.component';
import { TaskWrapperComponent } from './components/shared-module/tasks/find-task-page/task-wrapper/task-wrapper.component';
import { FindTaskPageComponent } from './components/shared-module/tasks/find-task-page/find-task-page.component';
import { CreateTaskComponent } from './components/shared-module/tasks/create-task/create-task.component';
import { ActiveUrls } from './auth/activeUrls';
import { CommonLayoutComponent } from './components/shared-module/layouts/common-layout/common-layout.component';
import { LoginComponent } from './components/shared-module/auth/login/login.component';
import { LoginLayoutComponent } from './components/shared-module/layouts/login-layout/login-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/shared-module/home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { FAQComponent } from './components/shared-module/home/faq/faq.component';
import { CommissionComponent } from './components/shared-module/home/commission/commission.component';
import { PricingComponent } from './components/shared-module/home/pricing/pricing.component';
import { MotivationProgramComponent } from './components/shared-module/home/motivation-program/motivation-program.component';
import { ReasonsBlockingComponent } from './components/shared-module/home/reasons-blocking/reasons-blocking.component';
import { RegistrationLayoutComponent } from './components/shared-module/layouts/registration-layout/registration-layout.component';
import { RegistrationComponent } from './components/shared-module/auth/registration/registration.component';
import { PasswordRecoveryComponent } from './components/shared-module/auth/password-recovery/password-recovery.component';
import { LegalInformationComponent } from './components/shared-module/home/legal-information/legal-information.component';
import { TermsUseComponent } from './components/shared-module/home/terms-use/terms-use.component';
import { PasswordRecoveryLayoutComponent } from './components/shared-module/layouts/password-recovery-layout/password-recovery-layout.component';
import { SupportLayoutComponent } from './components/shared-module/layouts/support-layout/support-layout.component';
import { SupportComponent } from './components/shared-module/home/support/support.component';
import { PublicOfferComponent } from './components/shared-module/home/public-offer/public-offer.component';
import { PrivacyPolicyComponent } from './components/shared-module/home/privacy-policy/privacy-policy.component';
import { GreetingComponent } from './components/shared-module/home/greeting/greeting.component';
import { GreetingLayoutsComponent } from './components/shared-module/layouts/greeting-layouts/greeting-layouts.component';
import { PromotionPageComponent } from './components/shared-module/promotions/promotion-page/promotion-page.component';
import { ListPromotionsWrapperComponent } from './components/shared-module/promotions/promotion-page/list-promotions-wrapper/list-promotions-wrapper.component';
import { PromotionWrapperComponent } from './components/shared-module/promotions/promotion-page/promotion-wrapper/promotion-wrapper.component';
import { RegistrationLegalComponent } from './components/shared-module/auth/registration/registration-legal/registration-legal.component';
import { NewsPageComponent } from './components/shared-module/home/our-news/news-page/news-page.component';
import { CategoryConstructionComponent } from './components/shared-module/home/greeting/category-construction/category-construction.component';
import { KirovCategoryConstructionComponent } from './components/shared-module/home/greeting/category-construction/kirov-category-construction/kirov-category-construction.component';
import { EquipmentRepairCategoryComponent } from './components/shared-module/home/greeting/equipment-repair-category/equipment-repair-category.component';
import { KirovEquipmentRepairCategoryComponent } from './components/shared-module/home/greeting/equipment-repair-category/kirov-equipment-repair-category/kirov-equipment-repair-category.component';
import { CreateVacancyComponent } from './components/shared-module/vacancies/create-vacancy/create-vocancy.component';
import { FindVacanciesComponent } from './components/shared-module/vacancies/find-vacancies-page/find-vacancies/find-vacancies.component';
import { UpdateVacancyComponent } from './components/shared-module/vacancies/update-vacancy/update-vacancy.component';
import { FindResumeComponent } from './components/shared-module/resume/find-resume-page/find-resume/find-resume.component';

const routes: Routes = [
  {
    path: '',
    component: CommonLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'prefix' },
      { path: 'home', component: HomeComponent },
      { path: 'our_partners', component: OurPartnersComponent },
      { path: 'about_us', component: AboutUsComponent },
      { path: 'password_recovery', component: PasswordRecoveryComponent },
      { path: 'terms_of_user', component: TermsUseComponent },
      { path: 'support/faq', component: FAQComponent },
      { path: 'support/commission', component: CommissionComponent },
      { path: 'support/pricing', component: PricingComponent },
      { path: 'support/motivation_programm', component: MotivationProgramComponent },
      { path: 'support/reasons_blocking', component: ReasonsBlockingComponent },
      { path: 'support/legal_info', component: LegalInformationComponent },
      { path: 'support/public_offer', component: PublicOfferComponent },
      { path: 'privacy_policy', component: PrivacyPolicyComponent },
      { path: ActiveUrls.NEW_TASK, component: CreateTaskComponent },
      {
        path: 'our_news',
        component: OurNewsComponent,
        children: [
          { path: '', component: NewsListComponent },
          { path: ':id', component: NewsPageComponent }
        ]
      },
      {
        path: ActiveUrls.FIND_TASK,
        component: FindTaskPageComponent,
        children: [
          { path: '', component: FindTaskComponent },
          { path: ':id', component: TaskWrapperComponent },
          { path: 'update/:id', component: UpdateTaskComponent }
        ]
      },
      {
        path: ActiveUrls.PERFORMERS,
        component: FindPerformerPageComponent,
        children: [
          { path: '', component: FindPerformerComponent },
          { path: ':taskId', component: FindPerformerComponent }
        ]
      },
      {
        path: 'partner', redirectTo: 'user'
      },
      {
        path: 'user',
        loadChildren: './components/partner/partner.module#PartnerModule',
        canActivate: [AuthGuard]
      },
      { path: 'pay_wrapper', component: PayRedirectWrapperComponent },
      {
        path: ActiveUrls.PROMOTION,
        component: PromotionPageComponent,
        children: [
          { path: '', component: ListPromotionsWrapperComponent },
          { path: ':id', component: PromotionWrapperComponent }
        ]
      },
      {
        path: "remont_stroitelstvo",
        component: CategoryConstructionComponent,
        children: [
          { path: '', component: CategoryConstructionComponent },
        ]
      },
      {
        path: "remont_stroitelstvo_kirov",
        component: KirovCategoryConstructionComponent,
        children: [
          { path: '', component: KirovCategoryConstructionComponent },
        ]
      },
      {
        path: "remont_tehniki",
        component: EquipmentRepairCategoryComponent,
        children: [
          { path: '', component: EquipmentRepairCategoryComponent },
        ]
      },
      {
        path: "remont_tehniki_kirov",
        component: KirovEquipmentRepairCategoryComponent,
        children: [
          { path: '', component: KirovEquipmentRepairCategoryComponent },
        ]
      }
    ],
    runGuardsAndResolvers: 'always',
  },
  {
    path: "job",
    component: CommonLayoutComponent,
    children: [
      { path: '', component: JobHomeComponent },
      { path: 'create_vacancy',  component: CreateVacancyComponent },
      { path: 'find_vacancy',
        component: FindVacanciesPageComponent,
        children: [
          { path: '', component:  FindVacanciesComponent},
          { path: ':vacancyId', component:  VacancyWrapperComponent},
          { path: 'update/:id', component:  UpdateVacancyComponent}
        ]
      },
      { path: 'find_resume',
      component: FindResumePageComponent,
      children: [
        { path: '', component:  FindResumeComponent},
      ]
      }
    ]
  },
  {
    path: ActiveUrls.LOGIN,
    component: LoginLayoutComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'VK', component: LoginComponent },
      { path: 'Google', component: LoginComponent },
      { path: 'Yandex', component: LoginComponent },
      { path: 'Facebook', component: LoginComponent },
    ]
  },
  {
    path: ActiveUrls.REGISTRATION,
    component: RegistrationLayoutComponent,
    children: [
      { path: '', redirectTo: ActiveUrls.REG_INDIVID, pathMatch: 'prefix' },
      { path: ActiveUrls.REG_INDIVID, component: RegistrationComponent },
      { path: ActiveUrls.REG_LEGAL, component: RegistrationLegalComponent },
    ]
  },
  {
    path: 'password_recovery',
    component: PasswordRecoveryLayoutComponent,
    children: [
      { path: '', component: PasswordRecoveryComponent },
    ]
  },
  {
    path: ActiveUrls.SUPPORT,
    component: SupportLayoutComponent,
    children: [
      { path: '', component: SupportComponent },
    ]
  },
  {
    path: "greeting",
    component: GreetingLayoutsComponent,
    children: [
      { path: '', component: GreetingComponent },
    ]
  },
  {
    path: 'admin',
    loadChildren: './components/admin/admin.module#AdminModule',
    canActivate: [AuthGuard]
  },
  { path: 'not_found', component: NotFoundPageComponent },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
