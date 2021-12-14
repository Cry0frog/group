export class PaymentCalc {
  
  calcPay: number;
  commission: number;

  getCalcPay() {
    if(this.calcPay != null) {
      return Math.round(this.calcPay);
    }
    else {
      return null;
    }
  }

  static convertToObj(obj: any): PaymentCalc {
    if(obj == null) {
      return null;
    }
    const payCalc = new PaymentCalc();
    Object.assign(payCalc, obj);

    return payCalc;
  }
}