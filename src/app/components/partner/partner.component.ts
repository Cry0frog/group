import { CustomerInfo } from './../../models/task/customerInfo';
import { UnlockUser } from './../../models/blocked-user/unlock/unlockUser';
import { HINTS } from './../../common/hints.description';
import { PaymentComponent } from './components/payment/payment.component';
import { MatDialog } from '@angular/material';
import { AmountResponse } from './../../models/payment/amountResponse';
import { PaymentService } from 'src/app/common/services/payment.service';
import { ProfileComponent } from './components/profile/profile.component';
import { ActiveUrls } from './../../auth/activeUrls';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { UrlResolver } from './common/urlResolver';
import { PartnerService } from './service/partner.service';
import { CommonService } from 'src/app/common/services/common.service';
import { PlaceAdvertising } from 'src/app/models/advertising/common/placeAdvertising';
import { СonfirmationUnlock } from 'src/app/models/blocked-user/common/confirmationUnlock';
import { UnlockNotEnoughMoneyComponent } from './unlock-not-enough-money/unlock-not-enough-money.component';
import { BlockingNotificationComponent } from './blocking-notification/blocking-notification.component';
import { SessionStorageService } from 'angular-web-storage';
import { Chat } from 'src/app/models/chat/common/chat';
import { ChatService } from '../shared-module/service/chat.service';
import { MobileTooltipComponent } from '../shared-module/mobile-tooltip/mobile-tooltip.component';
import { MyVacancysComponent } from './components/my-vacancies/my-vacancies.component';
import { SubscriptionNotEnoughMoneyComponent } from './components/profile/subscription-pay/subscription-not-enough-money/subscription-not-enough-money.component';
import { RateJob } from 'src/app/models/rateJobs/rateJob';
import { SubscriptionPayComponent } from './components/profile/subscription-pay/subscription-pay.component';
import { RateJobType } from 'src/app/models/rateJobs/rateJobType';
import { SubscriptionJob } from 'src/app/models/rateJobs/subscriptionJob';
import { SUBSCRIPTION_DAYS_REVERSE } from '../admin/common/admin.descriptions';
import { SuccessNotificationComponent } from './components/success-notification/success-notification.component';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.css']
})
export class PartnerComponent implements OnInit {
  partnerId: number;
  countСonfirmations: number;
  amount: AmountResponse;
  income: AmountResponse;
  isAdminNotFound: boolean;
  gdBalance = HINTS.gdBalance;
  gdIncome = HINTS.gdIncome;
  gdSubscriptionAndOneTimePayments = HINTS.gdSubscriptionAndOneTimePayments;
  gdOnlySubscription = HINTS.gdOnlySubscription;
  gdOnlyOneTimePayments = HINTS.gdOnlyOneTimePayments;

  gdRefill = HINTS.gdRefill;
  gdRequestPayout = HINTS.gdRequestPayout;

  gdSubscription = HINTS.gdSubscription;
  gdSubscriptionHelp = HINTS.gdSubscriptionHelp;

  summUnlocking: number;
  listCurrentBlocking: UnlockUser[];

  isOpenAssistant: boolean;

  place: PlaceAdvertising;

  isShowVacancyComponent: boolean;

  subscription: SubscriptionJob;

  days = SUBSCRIPTION_DAYS_REVERSE;

  constructor(private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private partnerService: PartnerService,
    private paymentService: PaymentService,
    private commonService: CommonService,
    private sessionStorage: SessionStorageService,
    private chatService: ChatService,
    public dialog: MatDialog
  ) {
    this.partnerId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.place = PlaceAdvertising.USER_PROFILE;
    this.subscription = new SubscriptionJob();
  }

  ngOnInit() {
    this.countСonfirmations = 0;
    this.amount = new AmountResponse();
    this.income = new AmountResponse();

    this.loadCountConfirmations();
    let url = UrlResolver.getMainSectionFromUrl(this.router.url);
    if(url.indexOf('?') != -1) {
      url = url.substring(0, url.indexOf('?'));
    }
    Promise.resolve(null).then(_ => {
      // @ts-ignore
      document.querySelectorAll(`.partner-panel .${url}`)[0].checked = true;
    });
    if(this.isAuthenticated() && this.authService.isUser()) {
      this.paymentService.getAmount().subscribe((data: AmountResponse) => {
        this.amount = data;
      });
      this.paymentService.getIncome().subscribe((data: AmountResponse) => {
        this.income = data;
      });
      this.partnerService.getSubscription().subscribe((data: SubscriptionJob) => {
        this.subscription = data;
      })
    }
    if(this.isYourProfile() && (this.isBadPerformer() || this.isBadPartner())) {
      this.checkBlocking();
    }
  }

  get isMobileMode() {
    return this.authService.isMobileMode();
  }

  showSuccessNotification(test: string){
    const dialogRef = this.dialog.open(SuccessNotificationComponent, {
      width: '600px',
      data: test
    });
    dialogRef.afterClosed().subscribe(() => {
      location.reload();
    });
  }

  showPaySubscribe() {
    const dialogRef = this.dialog.open(SubscriptionPayComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe((data: RateJob) => {
      if(data.rateJobType == RateJobType.SUBSCRIPTION){
        this.showSuccessNotification("Оплата успешно проведена, ваша подписка будет доступна " + this.days[data.countDays]);
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
        this.showSuccessNotification("Оплата успешно проведена, Вы пополнили бонусный счет. Для публикации данной вакансии нажмите повторно 'Опубликовать', выберите тариф и кликнете 'Оплатить'. С Вашего бонусного счета автоматически спишется необходимая сумма и вакансия будет размещена согласно тарифу.");
      }
    });
  }

  checkBlocking() {
    this.commonService.checkBlocking().subscribe((data: UnlockUser[]) => {
      if(data != null && data.length != 0) {
        this.listCurrentBlocking = data;
        this.blockingNotification(0);
      }
    });
  }

  getTooltipMobile(text: string) {

    if(!this.isMobileMode) {
      return;
    }

    this.dialog.open(MobileTooltipComponent, {
      width: '250px',
      data: text,
      backdropClass: 'backdropBackground',
      panelClass: 'panel_class_mob_tooltip'
    });
  }

  isOneTimePaymentsActivated(): boolean {
    return this.subscription.enablePaidPostingVacancies || this.subscription.enablePaidShowResume;
  }

  isAuthenticated(): boolean {
    return this.authService.LoggedUser.authenticated;
  }

  isAdmin(): boolean {
    return this.isAuthenticated() && this.authService.isAdmin();
  }

  isBadPerformer(): boolean {
    return this.isAuthenticated() && this.authService.isBadPerformer();
  }

  isBadPartner(): boolean {
    return this.isAuthenticated() && this.authService.isBadPartner();
  }

  getCountConfirmation(): number {
    return this.countСonfirmations;
  }

  onRouterOutletActivate(component) {
    if(component instanceof ProfileComponent) {
      component.partnerId = this.partnerId;
    }

    if(component instanceof MyVacancysComponent) {
      this.isShowVacancyComponent = true;
    }
    else {
      this.isShowVacancyComponent = false;
    }
  }

  loadCountConfirmations(){
    this.partnerService.getCountConfirmations().subscribe((data: number) =>
      this.countСonfirmations = data)
  }

  isPerformer(): boolean {
    return this.isAuthenticated() && this.authService.isPerformer();
  }

  isYourProfile(): boolean {
    return this.isAuthenticated() && this.partnerId == this.authService.getCurrentId;
  }

  getPayout() {
    let navigationExtras: NavigationExtras = {
      queryParams: { 'mode': 'READY_TO_PAYOUT' },
    };
    this.router.navigate([`user/${this.authService.getCurrentId}/payments`], navigationExtras);
  }

  refillBalance() {
    const dialogRef = this.dialog.open(PaymentComponent, {
      width: '550px',
      data: {
        message: 'Данные средства будут использоваться для оплаты комиссии по задачам с обычным платежом, вывод данных денежных средств не поддерживается'
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if(res != null) {
        window.location.reload(true);
      }
    });
  }

  unlockUser() {
    this.commonService.unlockUser().subscribe((data: UnlockUser) => {
      if(data != null) {
        if(data.сonfirmationUnlock == СonfirmationUnlock.NOT_ENOUGH_MONEY) {
          this.openWindowUnlockNotEnoughMoney(data);
        }
        else if(data.сonfirmationUnlock == СonfirmationUnlock.OK) {
          if(data.description != null) {
            const dialogRef = this.dialog.open(BlockingNotificationComponent, {
              width: '600px',
              data: data.description
            });
          }
          else {
            this.authService.updateRoles(data.roles);
            window.location.reload(true);
          }
        }
      }
    })
  }

  openWindowUnlockNotEnoughMoney(unlockUser: UnlockUser) {
    const dialogRef = this.dialog.open(UnlockNotEnoughMoneyComponent, {
      width: '600px',
      data: unlockUser
    });
    dialogRef.afterClosed().subscribe(data => {
      this.refillBalanceForBlocking(unlockUser);
    });
  }

  blockingNotification(i) {
    const unlockUser = this.listCurrentBlocking[i];
    if(unlockUser != null) {
      this.summUnlocking = unlockUser.summ;
      const dialogRef = this.dialog.open(BlockingNotificationComponent, {
        width: '600px',
        data: unlockUser.description
      });
      dialogRef.afterClosed().subscribe(data => {
        this.blockingNotification(++i);
      });
    }
    else if(this.summUnlocking > 0) {
      this.refillBalanceForBlocking(this.listCurrentBlocking[0]);
    }
    // else {
    //   this.unlockUser();
    // }
  }

  refillBalanceForBlocking(unlock: UnlockUser) {
    const dialogRef = this.dialog.open(PaymentComponent, {
      width: '550px',
      data: {
        summ: unlock.summ,
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if(res != null) {
        window.location.reload(true);
      }
    });
  }

  goToChatWithAdmin() {
    this.chatService.getChatWithAdmin().subscribe((chat: Chat) => {
      if(chat != null) {
        if(chat.id == null) {
          this.isAdminNotFound = true;
          return;
        }

        this.sessionStorage.set('back_chat_url', this.router.url);
        this.router.navigate([`/user/${this.authService.getCurrentId}/chat/${chat.id}`]);
      }
    });
  }

  openCreateTask() {
    this.authService.navigateToCreateNewTask();
  }

  getProfileRouterLink(): string {
    return ActiveUrls.PARTNER_PROFILE;
  }

  getPartnerTaskRouterLink(): string {
    return ActiveUrls.PARTNER_MY_TASKS;
  }

  getVacancyRouterLink(): string {
    return ActiveUrls.PARTNER_VACANCY;
  }

  getRatesRouterLink(): string {
    return ActiveUrls.PARTNER_PAYMENTS;
  }

  getPartnerShareLink(): string {
    return ActiveUrls.PARNTER_SHARE;
  }

  isCountConfirmationNull() {
    return this.countСonfirmations > 0;
  }
}
