export enum PaymentStatus {
  
  PENDING = 'PENDING',
  READY_TO_CHECK = 'READY_TO_CHECK',
  WAITING_FOR_CAPTURE = 'WAITING_FOR_CAPTURE',
  SUCCEEDED = 'SUCCEEDED',
  CANCELED = 'CANCELED',
  SPENT = 'SPENT',

  SECURE_NOT_PAYED = 'SECURE_NOT_PAYED',
  SECURE_PAYED = 'SECURE_PAYED',
  SECURE_CANCELLING = 'SECURE_CANCELLING',
  SECURE_CANCELED = 'SECURE_CANCELED',
  SECURE_READY_TO_PAYOUT = 'SECURE_READY_TO_PAYOUT',
  SECURE_PAYOUT_HANDLING = 'SECURE_PAYOUT_HANDLING',
  SECURE_DONE = 'SECURE_DONE',
  SECURE_TROUBLE = 'SECURE_TROUBLE',

  REGULAR_HOLD = 'REGULAR_HOLD',     //Средства захолдированы на личном счёте
  REGULAR_DONE = 'REGULAR_DONE',     //Средства переведены gooddeal
  REGULAR_CANCELED = 'REGULAR_CANCELED' //Средства возвращены на личный счёт
}