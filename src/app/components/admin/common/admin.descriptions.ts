import { StatusPlannedTask } from './../../../models/development/statusPlannedTask';
import { ChatArbitrationStatus } from './../../../models/chat/arbitration/chatArbitrationStatus';
import { RateType } from './../../../models/rates/rateType';
import { ROLE } from 'src/app/auth/role'
import { FilterRole } from 'src/app/auth/filterRole';
import { PlaceAdvertising } from 'src/app/models/advertising/common/placeAdvertising';
import { TypeBlocking } from 'src/app/common/typeBlocking';
import { ReasonsBlocking } from 'src/app/models/blocked-user/common/reasonsBlocking';

export interface IUserRoleMapper{
    value: ROLE;
    viewValue: string;
}

export interface RateJobDays {
  value: number;
  viewValue: string;
}

export interface SwitchAdminSettingTumbler {
  value: number;
  viewValue: string;
}

export const SWITCH_TUMBLER_ADMIN_SETTING = [
  {value: true, viewValue: 'вкл'},
  {value: false, viewValue: 'выкл'}
]

export const ROLE_TITILE_DISPLAY = {
    [ROLE.PARTNER]: 'Заказчик',
    [ROLE.PERFORMER]: 'Исполнитель',
    [ROLE.SUPER_USER]: 'Администратор',
    [ROLE.MEMBER_PERFORMER]: 'Партнеры исполнители',
    [ROLE.MEMBER_ANOTHER]: 'Другие партнеры',
    [ROLE.MEMBER_STORE]: 'Партнёры магазины'
}

export const ROLE_DISPLAY = {
    [ROLE.PARTNER]: 'З',
    [ROLE.PERFORMER]: 'И',
    [ROLE.SUPER_USER]: 'А'
}

export const ADD_ROLES: IUserRoleMapper[] = [
    { value: ROLE.PARTNER, viewValue: 'Заказчик'},
    { value: ROLE.PERFORMER, viewValue: 'Исполнитель'},
    { value: ROLE.SUPER_USER, viewValue: 'Администратор'},
]

export const ADD_ROLES_LEGAL_ENTITY: IUserRoleMapper[] = [
  { value: ROLE.MEMBER_ANOTHER, viewValue: 'Другие партнеры'},
  { value: ROLE.MEMBER_PERFORMER, viewValue: 'Партнер исполнитель'},
  { value: ROLE.MEMBER_STORE, viewValue: 'Партнер магазин'},
]

export interface IRateTypeMapper {
  value: RateType;
  viewValue: string;
}

export const RATE_TYPE_DISPLAY = {
  [RateType.DISTANCE]: 'Расстояние',
  [RateType.URGENTLY]: 'Режим "Срочно"',
  [RateType.TRANSPORT_CATEGORY]: 'Категория транспорта',
  [RateType.WEIGHT_CATEGORY]: 'Весовая категория',
  [RateType.PRODUCT_CATEGORY]: 'Категория продукта',
  [RateType.PORTER]: 'Грузчики',
  [RateType.PASSENGER]: 'Пассажиры',
  [RateType.PERFORMER_ATTACHING]: 'Получение статуса исполнитель',
};

export const RATE_TYPE_MAPPER: IRateTypeMapper[] = [
  { value: RateType.DISTANCE, viewValue: 'Расстояние'},
  { value: RateType.URGENTLY, viewValue: 'Режим "Срочно"'},
  { value: RateType.TRANSPORT_CATEGORY, viewValue: 'Категория транспорта'},
  { value: RateType.WEIGHT_CATEGORY, viewValue: 'Весовая категория'},
  { value: RateType.PRODUCT_CATEGORY, viewValue: 'Категория продукта'},
  { value: RateType.PORTER, viewValue: 'Грузчики'},
  { value: RateType.PASSENGER, viewValue: 'Пассажиры'},
  { value: RateType.PERFORMER_ATTACHING, viewValue: 'Получение статуса исполнитель'}
];

export const RATE_JOB_DAYS: RateJobDays[] = [
  { value: 7, viewValue: "1 неделя" },
  { value: 31, viewValue: "1 месяц" },
  { value: 183, viewValue: "6 месяцев" },
  { value: 366, viewValue: "1 год" }
]

export const RATE_JOB_DAYS_REVERSE = {
  [7]: "1 неделя",
  [31]: "1 месяц",
  [183]: "6 месяцев",
  [366]: "1 год"
}

export const SUBSCRIPTION_DAYS_REVERSE = {
  [7]: "1 неделю",
  [31]: "1 месяц",
  [183]: "6 месяцев",
  [366]: "1 год"
}

export const CHAT_ARBITRATION_DISPLAY = {
  [ChatArbitrationStatus.IN_PROGRESS]: 'В процессе',
  [ChatArbitrationStatus.ADMIN_REQUEST]: 'Запрошена помощь администратора',
  [ChatArbitrationStatus.ADMIN_JOINED]: 'Админинстратор присоединился',
  [ChatArbitrationStatus.SUCCESS]: 'Успешно разрешен'
};

export interface IPlacesAdvertisingMapper {
  value: PlaceAdvertising;
  viewValue: string;
}

export const ADD_PLACES_ADVERTISING: IPlacesAdvertisingMapper[] = [
  { value: PlaceAdvertising.CREATE_TASK, viewValue: 'Создать задачу'},
  { value: PlaceAdvertising.FIND_PERFORMER, viewValue: 'Исполнители'},
  { value: PlaceAdvertising.FIND_TASK, viewValue: 'Найти задачу'},
  { value: PlaceAdvertising.MEMBERS, viewValue: 'Партнеры'},
  { value: PlaceAdvertising.USER_PROFILE, viewValue: 'Профиль пользователя'},
]


export interface ITypeBlockingMapper {
  value: TypeBlocking;
  viewValue: string;
}

export const CHOOSE_TYPE_BLOCKING: ITypeBlockingMapper[] = [
  { value: TypeBlocking.THREE_DAYS, viewValue: 'Три дня'},
  { value: TypeBlocking.SEVEN_DAYS, viewValue: 'Семь дней'},
  { value: TypeBlocking.FOURTEEN_DAYS, viewValue: 'Четырнадцать дней'},
  { value: TypeBlocking.THIRTY_DAYS, viewValue: 'Тридцать дней'},
  { value: TypeBlocking.NINETY_DAYS, viewValue: 'Девяносто дней'},
]

export const LEVEL_BLOCKING = {
  [TypeBlocking.THREE_DAYS]: '1',
  [TypeBlocking.SEVEN_DAYS]: '2',
  [TypeBlocking.FOURTEEN_DAYS]: '3',
  [TypeBlocking.THIRTY_DAYS]: '4',
  [TypeBlocking.NINETY_DAYS]: '5',
};

export interface IReasonsBlockingMapper {
  value: ReasonsBlocking;
  viewValue: string;
}

export const CHOOSE_REASONS_BLOCKING_PERFORMER: IReasonsBlockingMapper[] = [
  { value: ReasonsBlocking.BAD_COMPLETED_TASK, viewValue: 'Недобросовестный подход выполнения заданий'},
  { value: ReasonsBlocking.CANCELLATION_TASK, viewValue: 'Злоупотребление функцией "Отмена заказа"'},
]

export const CHOOSE_REASONS_BLOCKING_PARTNER: IReasonsBlockingMapper[] = [
  { value: ReasonsBlocking.NOT_PAID_TASK, viewValue: 'Неоплаченный заказ'},
  { value: ReasonsBlocking.CANCEL_TASK, viewValue: 'Отмены заказов'},
]

//Planned task
export const STATUS_PLANNED_TASK_DISPLAY = {
  [StatusPlannedTask.NOT_READY]: 'Не готова к старту',
  [StatusPlannedTask.NOT_STARTED]: 'Готова к старту',
  [StatusPlannedTask.PUBLISHED]: 'Опубликована',
  [StatusPlannedTask.REQUESTS_FINISHED]: 'Все участники подали заявки',

  [StatusPlannedTask.PERFORMER_SELECTED]: 'Исполнитель выбран',
  [StatusPlannedTask.IN_PROGRESS]: 'В процессе выполнения',
  [StatusPlannedTask.FINISHED]: 'Завершена',

  [StatusPlannedTask.ERROR]: 'Ошибка'
};

export const STATUS_PLANNED_TASK_CLASS = {
  [StatusPlannedTask.NOT_READY]: 'gray',
  [StatusPlannedTask.NOT_STARTED]: 'yellow',
  [StatusPlannedTask.PUBLISHED]: 'yellow',
  [StatusPlannedTask.REQUESTS_FINISHED]: 'yellow',

  [StatusPlannedTask.PERFORMER_SELECTED]: 'yellow',
  [StatusPlannedTask.IN_PROGRESS]: 'yellow',
  [StatusPlannedTask.FINISHED]: 'green',

  [StatusPlannedTask.ERROR]: 'red'
}

export interface IFilterUserRoleMapper{
  value: FilterRole;
  viewValue: string;
}

export const FILTER_ROLES: IFilterUserRoleMapper[] = [
  { value: FilterRole.ALL, viewValue: 'Все'},
  { value: FilterRole.PARTNER, viewValue: 'Заказчик'},
  { value: FilterRole.PERFORMER, viewValue: 'Исполнитель'},
  { value: FilterRole.SUPER_USER, viewValue: 'Администратор'}
]

export const FILTER_LEGAL_ENTITY_MAPPER: IFilterUserRoleMapper[] = [
  { value: FilterRole.ALL, viewValue: 'Все'},
  { value: FilterRole.PARTNER, viewValue: 'Заказчик'},
  { value: FilterRole.PERFORMER, viewValue: 'Исполнитель'},
]
