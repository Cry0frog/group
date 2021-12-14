export enum PaymentType {
  REFILL_COMMISSION_FOR_TASK = 'REFILL_COMMISSION_FOR_TASK',   /* пополнение для оплаты задачи c обычной оплатой (вычитается с баланса исполнителя, возвращается, если задача отменена не в пользу исполнителя) */
  COMMISSION = 'COMMISSION',
  UNLOCK = 'UNLOCK', /* пополнение для разблокирования пользователя*/

  SINGLE_PAYMENT_FOR_VACANCY_CREATION = 'SINGLE_PAYMENT_FOR_VACANCY_CREATION', /* разовая оплата за создание вакансии*/
  SINGLE_PAYMENT_FOR_VIEW_RESUME = 'SINGLE_PAYMENT_FOR_VIEW_RESUME', /* разовая оплата за просмотр контактной информации в резюме */
  SECURE_REFILL = 'SECURE_REFILL',    /* холдированная оплата задачи, только для заказчика, возможные статусы:  SECURE_NOT_PAYED, SECURE_PAYED, SECURE_CANCELED, SECURE_DONE*/
  SECURE_GD_COMMISSION = 'SECURE_GD_COMMISSION', /*  комиссия за задачу, для админа возможные статусы:  SECURE_PAYED, SECURE_CANCELED, SECURE_DONE*/
  SECURE_RECEIVING_FOR_TASK = 'SECURE_RECEIVING_FOR_TASK',  /*  оплата задачи, только для исполнителя, возможные статусы:  SECURE_PAYED, SECURE_CANCELED, SECURE_DONE*/
  SUBSCRIBE_JOB = 'SUBSCRIBE_JOB', /* оформление подписки */

  PAYOUT = 'PAYOUT'
}
