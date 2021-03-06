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
import { –°onfirmationUnlock } from 'src/app/models/blocked-user/common/confirmationUnlock';
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
  count–°onfirmations: number;
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
    this.count–°onfirmations = 0;
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
        this.showSuccessNotification("–ě–Ņ–Ľ–į—ā–į —É—Ā–Ņ–Ķ—ą–Ĺ–ĺ –Ņ—Ä–ĺ–≤–Ķ–ī–Ķ–Ĺ–į, –≤–į—ą–į –Ņ–ĺ–ī–Ņ–ł—Ā–ļ–į –Ī—É–ī–Ķ—ā –ī–ĺ—Ā—ā—É–Ņ–Ĺ–į " + this.days[data.countDays]);
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
        message: '–ü–ĺ—Ā–Ľ–Ķ –ĺ–Ņ–Ľ–į—ā—č –Ņ–ĺ–ī–ĺ–∂–ī–ł—ā–Ķ –Ĺ–Ķ–ļ–ĺ—ā–ĺ—Ä–ĺ–Ķ –≤—Ä–Ķ–ľ—Ź (–ĺ–Ī—č—á–Ĺ–ĺ –Ĺ–Ķ –Ī–ĺ–Ľ–Ķ–Ķ 5 –ľ–ł–Ĺ—É—ā, –Ņ–ĺ–ļ–į –Ņ–Ľ–į—ā–Ķ–∂ –Ĺ–Ķ –Ī—É–ī–Ķ—ā –Ņ–ĺ–ī—ā–≤–Ķ—Ä–∂–ī–Ķ–Ĺ –ł –Ņ–ĺ–Ņ—Ä–ĺ–Ī—É–Ļ—ā–Ķ –Ņ–ĺ–ī–į—ā—Ć –∑–į—Ź–≤–ļ—É —Ā–Ĺ–ĺ–≤–į)'
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if(res != null) {
        this.showSuccessNotification("–ě–Ņ–Ľ–į—ā–į —É—Ā–Ņ–Ķ—ą–Ĺ–ĺ –Ņ—Ä–ĺ–≤–Ķ–ī–Ķ–Ĺ–į, –í—č –Ņ–ĺ–Ņ–ĺ–Ľ–Ĺ–ł–Ľ–ł –Ī–ĺ–Ĺ—É—Ā–Ĺ—č–Ļ —Ā—á–Ķ—ā. –Ē–Ľ—Ź –Ņ—É–Ī–Ľ–ł–ļ–į—Ü–ł–ł –ī–į–Ĺ–Ĺ–ĺ–Ļ –≤–į–ļ–į–Ĺ—Ā–ł–ł –Ĺ–į–∂–ľ–ł—ā–Ķ –Ņ–ĺ–≤—ā–ĺ—Ä–Ĺ–ĺ '–ě–Ņ—É–Ī–Ľ–ł–ļ–ĺ–≤–į—ā—Ć', –≤—č–Ī–Ķ—Ä–ł—ā–Ķ —ā–į—Ä–ł—Ą –ł –ļ–Ľ–ł–ļ–Ĺ–Ķ—ā–Ķ '–ě–Ņ–Ľ–į—ā–ł—ā—Ć'. –° –í–į—ą–Ķ–≥–ĺ –Ī–ĺ–Ĺ—É—Ā–Ĺ–ĺ–≥–ĺ —Ā—á–Ķ—ā–į –į–≤—ā–ĺ–ľ–į—ā–ł—á–Ķ—Ā–ļ–ł —Ā–Ņ–ł—ą–Ķ—ā—Ā—Ź –Ĺ–Ķ–ĺ–Ī—Ö–ĺ–ī–ł–ľ–į—Ź —Ā—É–ľ–ľ–į –ł –≤–į–ļ–į–Ĺ—Ā–ł—Ź –Ī—É–ī–Ķ—ā —Ä–į–∑–ľ–Ķ—Č–Ķ–Ĺ–į —Ā–ĺ–≥–Ľ–į—Ā–Ĺ–ĺ —ā–į—Ä–ł—Ą—É.");
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
    return this.count–°onfirmations;
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
      this.count–°onfirmations = data)
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
        message: '–Ē–į–Ĺ–Ĺ—č–Ķ —Ā—Ä–Ķ–ī—Ā—ā–≤–į –Ī—É–ī—É—ā –ł—Ā–Ņ–ĺ–Ľ—Ć–∑–ĺ–≤–į—ā—Ć—Ā—Ź –ī–Ľ—Ź –ĺ–Ņ–Ľ–į—ā—č –ļ–ĺ–ľ–ł—Ā—Ā–ł–ł –Ņ–ĺ –∑–į–ī–į—á–į–ľ —Ā –ĺ–Ī—č—á–Ĺ—č–ľ –Ņ–Ľ–į—ā–Ķ–∂–ĺ–ľ, –≤—č–≤–ĺ–ī –ī–į–Ĺ–Ĺ—č—Ö –ī–Ķ–Ĺ–Ķ–∂–Ĺ—č—Ö —Ā—Ä–Ķ–ī—Ā—ā–≤ –Ĺ–Ķ –Ņ–ĺ–ī–ī–Ķ—Ä–∂–ł–≤–į–Ķ—ā—Ā—Ź'
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
        if(data.—ĀonfirmationUnlock == –°onfirmationUnlock.NOT_ENOUGH_MONEY) {
          this.openWindowUnlockNotEnoughMoney(data);
        }
        else if(data.—ĀonfirmationUnlock == –°onfirmationUnlock.OK) {
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
    return this.count–°onfirmations > 0;
  }
}
