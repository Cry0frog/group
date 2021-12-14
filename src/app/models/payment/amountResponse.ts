
export class AmountResponse {
  value: string;
  currency: string;

  static convertToObj(obj: any): AmountResponse {
    if(obj == null) {
      return null;
    }
    const amount: AmountResponse = new AmountResponse();
    Object.assign(amount, obj);
    amount.value = obj.value + '';

    return amount;
  }
}