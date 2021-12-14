import { PaymentStatus } from './../models/payment/paymentStatus';
import { PaymentType } from './../models/payment/paymentType';

export const PAYMENT_TYPE_TRANSLATE = {
  [PaymentType.REFILL_COMMISSION_FOR_TASK]: 'Пополнение на оплату комиссии задачи',
  [PaymentType.COMMISSION]: 'Комиссия',
  [PaymentType.UNLOCK]: 'Разблокировка',

  [PaymentType.SINGLE_PAYMENT_FOR_VACANCY_CREATION]: 'Пополнение на оплату комиссии за размещение вакансии',
  [PaymentType.SINGLE_PAYMENT_FOR_VIEW_RESUME]: 'Пополнение на оплату комиссии за просмотр конткнтной информации резюме',
  [PaymentType.SECURE_REFILL]: 'Оплата задачи',
  [PaymentType.SECURE_GD_COMMISSION]: 'Комиссия за задачу',
  [PaymentType.SECURE_RECEIVING_FOR_TASK]: 'Выплата за задачу',
  [PaymentType.SUBSCRIBE_JOB]: 'Пополнение на оплату подписки',

  [PaymentType.PAYOUT]: 'Вывод',
};

export const PAYMENT_STATUS_TRANSLATE = {
  [PaymentStatus.PENDING]: 'Ожидание',
  [PaymentStatus.READY_TO_CHECK]: 'Проверяется',
  [PaymentStatus.WAITING_FOR_CAPTURE]: 'WAITING_FOR_CAPTURE',
  [PaymentStatus.SUCCEEDED]: 'Успешно',
  [PaymentStatus.CANCELED]: 'Отменен',
  [PaymentStatus.SPENT]: 'Средства использованы (для оплаты задачи)',

  [PaymentStatus.SECURE_NOT_PAYED]: 'Безопасный платеж: ещё не оплачено',
  [PaymentStatus.SECURE_PAYED]: 'Безопасный платеж: оплачено',
  [PaymentStatus.SECURE_CANCELLING]: 'Безопасный платеж отменяется (Возврат будет произведен в течение 5-ти рабочих дней)',
  [PaymentStatus.SECURE_CANCELED]: 'Безопасный платеж отменен (Возврат будет произведен в течение 5-ти рабочих дней)',
  [PaymentStatus.SECURE_READY_TO_PAYOUT]: 'Безопасный платеж: готово к выплате',
  [PaymentStatus.SECURE_PAYOUT_HANDLING]: 'Безопасный платеж: обрабатывается',
  [PaymentStatus.SECURE_DONE]: 'Безопасный платеж: зачислено на счёт',
  [PaymentStatus.SECURE_TROUBLE]: 'Безопасный платеж: ошибка, обратитесь к администратору',

  [PaymentStatus.REGULAR_HOLD]: 'Средства на удержании',
  [PaymentStatus.REGULAR_DONE]: 'Успешно',
  [PaymentStatus.REGULAR_CANCELED]: 'Отменен',
}
