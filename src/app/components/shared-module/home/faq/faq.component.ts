import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';
import { AuthService } from 'src/app/auth/auth.service';
import { FAQ } from 'src/app/components/shared-module/common/faq.description';


interface FAQContent {
  title: string;
  body: string;
  isOpen: boolean;
  linkName: string;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FAQComponent implements OnInit {

  faqContent: FAQContent[];
  isFavoriteQuestions: boolean;

  faqContentTask: FAQContent[] = [
    {title: 'Что такое GoodDeal?', body: FAQ.whatIsGoodDeal, isOpen: false, linkName: null },
    {title: 'Почему Вам стоит выбрать GoodDeal?', body: FAQ.whyChooseGoodDeal, isOpen: false, linkName: null },
    {title: 'Какова роль заказчика и исполнителя в приложении?', body: FAQ.roleOfTheCustomerContractorInApplication, isOpen: false, linkName: null },
    {title: 'Как стать исполнителем? Что мне нужно об этом знать?', body: FAQ.howToBecomPerformer, isOpen: false, linkName: '#how-become-performer' },
    {title: 'Какие комиссии ожидают меня?', body: FAQ.whatCommissionsAwaitMe, isOpen: false, linkName: null },
    {title: 'Как выбрать надёжного исполнителя и не быть обманутым?', body: FAQ.howToChooseReliableContractor, isOpen: false, linkName: '#reliable-performer' },
    {title: 'Как выбрать добросовестного заказчика и не быть обманутым?', body: FAQ.howToChooseBonaFideCustomer, isOpen: false, linkName: null },
    {title: 'Регистрация организации (ИП/Юр. лица). Почему мне стоит зарегистрировать организацию?', body: FAQ.organizationRegistration, isOpen: false, linkName: null },
    {title: 'Как стать партнёром GoodDeal и что это даёт?', body: FAQ.howToBecomeGoodDealPartner, isOpen: false, linkName: null },
    {title: 'Как формируется цена заказа?', body: FAQ.howTheOrderPriceIsFormed, isOpen: false, linkName: '#order price' },
    {title: 'Меня интересует задание, но не устраивает сумма, которую готов заплатить заказчик. Что мне делать?', body: FAQ.InterestedTaskButNotSatisfiedWithTheAmount, isOpen: false, linkName: null },
    {title: 'Я выполнил задание. Когда мне переведут средства за работу?', body: FAQ.whenWillTheFundsForMyWorkBeTransferred, isOpen: false, linkName: '#transfer_funds' },
    {title: 'Как оплатить услугу?', body: FAQ.howToPayForTheService, isOpen: false, linkName: '#pay-service' },
    {title: 'Что такое «Безопасный платёж»?', body: FAQ.whatIsSafePayment, isOpen: false, linkName: null },
    {title: 'Как вывести средства?', body: FAQ.howToWithdrawFunds, isOpen: false, linkName: null },
    {title: 'Я сформировал задание. Что мне делать дальше?', body: FAQ.whatShouldIDoAfterFormingTask, isOpen: false, linkName: null },
    {title: 'Когда я получу предложения и сколько?', body: FAQ.whenWillIReceiveOffers, isOpen: false, linkName: '#get-offers' },
    {title: 'Как исполнителю разместить примеры своих работ?', body: FAQ.howContractorLinkExamplesOfHisWork, isOpen: false, linkName: null },
    {title: 'Может ли исполнитель получать уведомления о задачах, созданных только в его городе?', body: FAQ.canPerformerReceiveNotificationsAboutTasksCreatedHisCity, isOpen: false, linkName: null },
    {title: 'Что мне делать при возникновении трудностей, вопросов и споров?', body: FAQ.whatToDoOfDifficultiesQuestionsAndDisputes, isOpen: false, linkName: null },
    {title: 'Зачем мне указывать свои паспортные данные?', body: FAQ.whySpecifyPassportData, isOpen: false, linkName: null },
    {title: 'Меня заблокировали. Почему, и что мне делать?', body: FAQ.iWasBlocked, isOpen: false, linkName: null },
    {title: 'Какие акции и поощрения меня ждут в приложении?', body: FAQ.whatArePromotionsAndIncentives, isOpen: false, linkName: null },
    {title: 'Я не получил деньги за выполненное задание. Что мне делать?', body: FAQ.didNotReceiveMoneyForTheCompletedTask, isOpen: false, linkName: null },
    {title: 'Меня не выбирают исполнителем/мне не дают заданий. Почему?', body: FAQ.theyDoNotChoosePerformerAndDoNotGiveAssignments, isOpen: false, linkName: null },
    {title: 'У меня низкий рейтинг. Что мне делать?!', body: FAQ.lowRating, isOpen: false, linkName: null },
    {title: 'Что такое режимы выполнения заказов?', body: FAQ.whatAreOrderFulfillmentModes, isOpen: false, linkName: null },
    {title: 'Что такое GD бонусы ?', body: FAQ.whatAreGDbonuses, isOpen: false, linkName: null },
    {title: 'Возврат средств. Как долго ждать?', body: FAQ.howLongToWaitForRefund, isOpen: false, linkName: null },
    {title: 'Как заказать размещение рекламного баннера на сайте GoodDeal?', body: FAQ.howToOrderPlacementOfAnAdvertisingBanner, isOpen: false, linkName: null }
  ];

  faqContentJob: FAQContent[] = [
    {title: 'Что такое GoodDeal.работа?', body: FAQ.whatIsGoodDealJob, isOpen: false, linkName: '#what-is-GoodDeal-job' },
    {title: 'Как найти работу?', body: FAQ.howSearchJob, isOpen: false, linkName: '#how-search-job' },
    {title: 'Как найти сотрудника?', body: FAQ.howSearchPersonJob, isOpen: false, linkName: '#how-search-person-job' },
    {title: 'Где отображены контакты работодателя/соискателя?', body: FAQ.whereContactJob, isOpen: false, linkName: '#where-contact-job' },
    {title: 'Могу ли я создавать несколько резюме и чем они будут отличаться?', body: FAQ.createResumeJob, isOpen: false, linkName: '#create-resume-job' },
    {title: 'Есть ли комиссия в GoodDeal.работа?', body: FAQ.haveComissionJob, isOpen: false, linkName: '#have-comission-job' },
    {title: 'Как найти надежного работодателя/работника?', body: FAQ.howSearchPersonJob, isOpen: false, linkName: null },
    {title: 'Кто может создавать вакансии?', body: FAQ.whoCreateVacancyJob, isOpen: false, linkName: null },
    {title: 'Я сформировал резюме/вакансию. Что делать дальше?', body: FAQ.iHaveResumeVacncyWhatDoJob, isOpen: false, linkName: null },
    {title: 'Что делать, если нет вакансий / резюме?', body: FAQ.whatDoIfNotVacancyJob, isOpen: false, linkName: null },
    {title: 'Регистрация организации (ИП/Юр. лица). Почему мне стоит зарегистрировать организацию?', body: FAQ.registrationOrgJob, isOpen: false, linkName: null },
    {title: 'Как стать партнёром GoodDeal и что это даёт?', body: FAQ.howStayPartnerJob, isOpen: false, linkName: null },
    {title: 'Что мне делать при возникновении трудностей и вопросов?', body: FAQ.whatMeDoWithDifficultJob, isOpen: false, linkName: null },
    {title: 'Зачем мне указывать свои паспортные данные?', body: FAQ.whyPasportJob, isOpen: false, linkName: null },
    {title: 'Как заказать размещение рекламного баннера на сайте GoodDeal?', body: FAQ.howPayReklamaJob, isOpen: false, linkName: null },
  ];

  constructor(private sessionService: SessionStorageService) { }

  ngOnInit() {
    let anchor = window.location.href.substring(window.location.href.lastIndexOf('#'));
    let isJobNavigation: boolean = this.sessionService.get(AuthService.GENERAL_NAV);
    this.chengeFAQContent(isJobNavigation, anchor);
  }

  chengeFAQContent(check, anchor) {
    if(anchor != null && check == null){
      if(this.faqContentTask.filter(el => el.linkName == anchor).length != 0){
        check = true;
      } else if (this.faqContentJob.filter(el => el.linkName == anchor).length != 0){
        check = true;
      }
    }

    this.faqContent = check ? this.faqContentJob : this.faqContentTask;

    if (anchor != null) {
      this.faqContent.forEach(faqContentItem => {
        if(faqContentItem.linkName == anchor) {
          faqContentItem.isOpen = !faqContentItem.isOpen;
        }
      });
    }

    this.isFavoriteQuestions = false;
    this.faqContent.forEach(el => {
      if(el.linkName != null){
        this.isFavoriteQuestions = true;
      }
    });
  }
}
