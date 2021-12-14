export class Commission {
  id: number;

  startCommission: Date;
  commission: number;
  bottomSummBorder: number;

  offset: string;

  public static convertToObj(obj: any): Commission {
    if(obj == null) {
      return null;
    }

    const commission: Commission = new Commission();
    Object.assign(commission, obj);
    if(obj.date != null) {
      commission.startCommission = new Date(Date.parse(obj.startCommission));
    }

    return commission;
  }
}