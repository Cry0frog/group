export enum DealState {
  Created = 'Created',
  PaymentProcessing = 'PaymentProcessing',
  PaymentProcessError = 'PaymentProcessError',
  Paid = 'Paid',
  
  PayoutProcessing = 'PayoutProcessing',
  PayoutProcessError = 'PayoutProcessError',
  Completed = 'Completed',

  Canceling = 'Canceling',
  CancelError = 'CancelError',
  Canceled = 'Canceled',
  
  PaymentHold = 'PaymentHold',
  PaymentHoldProcessing = 'PaymentHoldProcessing',
  Archived = 'Archived'
}