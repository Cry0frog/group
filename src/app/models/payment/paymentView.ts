import { PaymentType } from './paymentType';
import { AmountResponse } from './amountResponse';
import { PaymentStatus } from './paymentStatus';

export class PaymentView {
  id: string ;
  status: PaymentStatus;
  amount: AmountResponse;
  createdAt: Date;
  description: string;
  paymentType: PaymentType;

  //ui
  choosen: boolean;

  isPending(): boolean {
    return this.status == PaymentStatus.PENDING;
  }

  isPayoutInProgress(): boolean {
    return (this.paymentType == PaymentType.SECURE_RECEIVING_FOR_TASK
      && this.status == PaymentStatus.SECURE_PAYOUT_HANDLING
    )
      || this.status == PaymentStatus.SECURE_CANCELLING;
  }

  static convertToObj(obj: any): PaymentView {
    if(obj == null) {
      return null;
    }
    const paymentView = new PaymentView();
    Object.assign(paymentView, obj);
    if(obj.createdAt != null) {
      paymentView.createdAt = new Date(Date.parse(obj.createdAt));
    }

    return paymentView;
  }
}