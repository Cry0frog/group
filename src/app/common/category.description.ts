import { CategoryPropertyPayoutTypes } from './../models/category/constructor/categoryPropertyPayoutTypes';
import { LocationType } from '../models/task/properties/map/locationType';
import { ICategoryStatusMapper } from './category.description';
import { CategoryStatus } from './../models/category/categoryStatus';
import { TypeCategoryProperty } from './../models/category/constructor/typeCategoryProperty';

export interface ICategoryTypeMapper {
  value: TypeCategoryProperty;
  viewValue: string;
}

export const CATEGORY_TYPES: ICategoryTypeMapper[] = [
  { value: TypeCategoryProperty.STRING, viewValue: 'Строка'},
  { value: TypeCategoryProperty.LONG_STRING, viewValue: 'Большая строка'},
  { value: TypeCategoryProperty.COORDINATE, viewValue: 'Координата'},
  { value: TypeCategoryProperty.COORDINATE_PATH, viewValue: 'Простой путь'},
  { value: TypeCategoryProperty.DATE, viewValue: 'Дата'},
  { value: TypeCategoryProperty.DATETIME, viewValue: 'Дата и время'},
  { value: TypeCategoryProperty.DATETIME_INTERVAL, viewValue: 'Временной интервал'},
]

export interface ICategoryStatusMapper {
  value: CategoryStatus;
  viewValue: string;
}

export const CATEGORY_STATUSES: ICategoryStatusMapper[] = [
  { value: CategoryStatus.HIDE, viewValue: 'Скрыта'},
  { value: CategoryStatus.PUBLISHED, viewValue: 'Опубликована'}
];

export interface ILocationTypeMapper {
  value: LocationType;
  viewValue: string;
}

export const LOCATION_TYPE_MAPPER: ILocationTypeMapper[] = [
  {value: LocationType.REMOTELY, viewValue: "Дистанционно"},
  {value: LocationType.AT_PERFORMER, viewValue: "У исполнителя"},
  {value: LocationType.AT_CUSTOMER, viewValue: "У заказчика"},
  {value: LocationType.NOT_FUNDAMENTALY, viewValue: "Не принципиально"},
];

export interface ICategoryPropertyPayoutTypesMapper {
  value: CategoryPropertyPayoutTypes;
  viewValue: string;
};

export const GLOBAL_CATEGORY_PROPERTY_PAYOUT_TYPES_MAPPER: ICategoryPropertyPayoutTypesMapper[] = [
  {value: CategoryPropertyPayoutTypes.SECURE, viewValue: "Безопасный платеж" },
  {value: CategoryPropertyPayoutTypes.REGULAR, viewValue: "Обычный платеж" },
]

export const CATEGORY_PROPERTY_PAYOUT_TYPES_CREATION_MAPPER: ICategoryPropertyPayoutTypesMapper[] = [
  {value: CategoryPropertyPayoutTypes.SECURE, viewValue: "Безопасный платеж" },
  {value: CategoryPropertyPayoutTypes.REGULAR, viewValue: "Обычный платеж" }
];

export const CATEGORY_PROPERTY_PAYOUT_TYPES_MAPPER: ICategoryPropertyPayoutTypesMapper[] = [
  {value: CategoryPropertyPayoutTypes.SECURE, viewValue: "Безопасный платеж" },
  {value: CategoryPropertyPayoutTypes.REGULAR_CARD, viewValue: "Оплата картой" },
  {value: CategoryPropertyPayoutTypes.REGULAR_CASH, viewValue: "Оплата наличными" },
  {value: CategoryPropertyPayoutTypes.REGULAR_NOT_PRINCIPAL, viewValue: "Не принципиально" },
];

export const REGULAR_CATEGORY_PROPERTY_PAYOUT_TYPES_MAPPER: ICategoryPropertyPayoutTypesMapper[] = [
  {value: CategoryPropertyPayoutTypes.REGULAR_CARD, viewValue: "Оплата картой" },
  {value: CategoryPropertyPayoutTypes.REGULAR_CASH, viewValue: "Оплата наличными" },
  {value: CategoryPropertyPayoutTypes.REGULAR_ACCOUNT, viewValue: "Оплата со счёта на счёт" },
  {value: CategoryPropertyPayoutTypes.REGULAR_NOT_PRINCIPAL, viewValue: "Не принципиально" },
];

export const PAYOUT_TYPE_DISPLAY = {
  [CategoryPropertyPayoutTypes.SECURE ]: 'Безопасный',
  [CategoryPropertyPayoutTypes.REGULAR_CARD]: 'Обычный (оплата картой)',
  [CategoryPropertyPayoutTypes.REGULAR_CASH]: 'Обычный (оплата наличными)',
  [CategoryPropertyPayoutTypes.REGULAR_ACCOUNT]: 'Обычный (оплата со счёта на счёт)',
  [CategoryPropertyPayoutTypes.REGULAR_NOT_PRINCIPAL]: 'Обычный (не принципиально)'
}

export const LOCATION_TYPE_DISPLAY = {
  [LocationType.REMOTELY ]: 'Дистанционно',
  [LocationType.AT_PERFORMER ]: 'У исполнителя',
  [LocationType.AT_CUSTOMER ]: 'У заказчика',
  [LocationType.NOT_FUNDAMENTALY ]: 'Не принципиально',
}
