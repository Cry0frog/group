import { RateJobType } from "./rateJobType";

export class RateJob {

  id: number;

  countDays: number;
  amountValue: number;
  rateJobType: RateJobType;

  static convertToObj(obj: any): RateJob {
    if(obj == null) {
      return null;
    }
    const rate: RateJob = new RateJob();
    Object.assign(rate, obj);

    return rate;
  }
}
