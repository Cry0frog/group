export class AdminSetting {
    enableTimerOnHomePage: boolean;

    enablePaidSubscriptionJob: boolean;
    enablePaidPostingVacancies: boolean;
    enablePaidShowResume: boolean;
    amountValueShowResume: number;

    static convertToObj(obj: any){
      if(obj == null) {
        return null;
      }
      const adminSetting: AdminSetting = new AdminSetting();
      Object.assign(adminSetting, obj);

      return adminSetting;
    }
}
