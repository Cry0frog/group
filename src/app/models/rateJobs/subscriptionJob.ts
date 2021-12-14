export class SubscriptionJob {
  dateEndSubscribe: Date;
  subscriptionHave: boolean;
  enableSubscriptionJob: boolean;
  enablePaidPostingVacancies: boolean;
  enablePaidShowResume: boolean;


  static convertObj(obj: any): SubscriptionJob {
    if(obj == null) {
      return null;
    }
    const subscription: SubscriptionJob = new SubscriptionJob();
    Object.assign(subscription, obj);

    return subscription;
  }
}
