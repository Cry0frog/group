import { CalcMode } from './../models/category/constructor/map/calcMode';
import { ProductCategory } from './../models/task/properties/map/productCategory';
import { DistanceType } from './../models/task/properties/map/distanceType';
import { DealState } from './../models/walletone/deal/dealState';
import { ModeTaskPerformer } from './../models/task/properties/date/modeTaskPerformer';
import { TransportCategory } from './../models/task/properties/map/transportCategory';
import { WeightCategory } from '../models/task/properties/map/weightCategory';
import { TaskStatus } from './../models/task/taskStatus';
import { ChatArbitrationStatus } from '../models/chat/arbitration/chatArbitrationStatus';

export interface ITaskStatusMapper {
  value: TaskStatus;
  viewValue: string;
}

export const TASK_STATUS_MAPPER: ITaskStatusMapper[] = [
  {value: TaskStatus.HIDE, viewValue: 'Скрыта'},
  {value: TaskStatus.PUBLISHED, viewValue: 'Опубликована'}
];

export const TASK_STATUS_TRANSLATE = {
  [TaskStatus.HIDE]: 'Скрыта',
  [TaskStatus.ON_HOLD]: 'Приостановлена',
  [TaskStatus.PUBLISHED]: 'Опубликована',
  [TaskStatus.PERFORMER_SELECTED]: 'Исполнитель найден',
  [TaskStatus.NOT_PAYED]: 'Ожидается оплата',
  [TaskStatus.PROCESSING]: 'В процессе',
  [TaskStatus.REQUEST_TO_FINISH]: 'Исполнитель завершил выполнение',
  [TaskStatus.FINISHED]: 'Завершена',
  [TaskStatus.CANCELED_BY_PARTNER]: 'Внимание! Не выполнено',
  [TaskStatus.CANCELED_BY_PERFORMER]: 'Внимание! Не выполнено',

  [TaskStatus.FINISHED_IN_FAVOR_CUSTOMER]: 'Завершена в пользу заказчика',
  [TaskStatus.FINISHED_IN_FAVOR_PERFORMER]: 'Завершена в пользу исполнителя',
}

export const TASK_STATUS_ACTION_TRANSLATE = {
  [TaskStatus.HIDE]: 'Скрыть',
  [TaskStatus.ON_HOLD]: 'Приостановить',
  [TaskStatus.PUBLISHED]: 'Опубликовать',

  [TaskStatus.PERFORMER_SELECTED]: TaskStatus.PERFORMER_SELECTED,
  [TaskStatus.PROCESSING]: TaskStatus.PROCESSING,
  [TaskStatus.REQUEST_TO_FINISH]: TaskStatus.REQUEST_TO_FINISH,
  [TaskStatus.FINISHED]: TaskStatus.FINISHED,
  [TaskStatus.CANCELED_BY_PARTNER]: TaskStatus.CANCELED_BY_PARTNER,
  [TaskStatus.CANCELED_BY_PERFORMER]: TaskStatus.CANCELED_BY_PERFORMER,

  [TaskStatus.FINISHED_IN_FAVOR_CUSTOMER]: TaskStatus.FINISHED_IN_FAVOR_CUSTOMER,
  [TaskStatus.FINISHED_IN_FAVOR_PERFORMER]: TaskStatus.FINISHED_IN_FAVOR_PERFORMER,
}

export interface IWeightCategoryMapper {
  value: WeightCategory;
  viewValue: string;
}

export const WEIGHT_CATEGORY_MAPPER: IWeightCategoryMapper[] = [
  {value: WeightCategory.FROM_0001_TO_4990_GR, viewValue: '0,01 - 4,99 кг'},
  {value: WeightCategory.FROM_5000_TO_9990_GR, viewValue: '5-9,99 кг'},
  {value: WeightCategory.FROM_10_000_TO_19_990_GR, viewValue: '10-19,99 кг'},
  {value: WeightCategory.FROM_20_000_TO_49_990_GR, viewValue: '20-49,99 кг'},
  {value: WeightCategory.FROM_50_000_TO_99_990_GR, viewValue: '50-99,99 кг'},
  {value: WeightCategory.FROM_100_000_TO_499_990_GR, viewValue: '100 - 499,99 кг'},
  {value: WeightCategory.FROM_500_000_TO_999_990_GR, viewValue: '500-999,99 кг'},

  {value: WeightCategory.FROM_1_000_TO_1_990_KG, viewValue: '1-1,99 т.'},
  {value: WeightCategory.FROM_2_000_TO_4_990_KG, viewValue: '2-4,99 т.'},
  {value: WeightCategory.FROM_5_000_TO_9_990_KG, viewValue: '5-9,99 т.'},
  {value: WeightCategory.FROM_10_000_KG, viewValue: 'более 10 т.'}
];

export const WEIGHT_CATEGORY_TRASLATE = {
  [WeightCategory.FROM_0001_TO_4990_GR]: '0,01 - 4,99 кг',
  [WeightCategory.FROM_5000_TO_9990_GR]: '5-9,99 кг',
  [WeightCategory.FROM_10_000_TO_19_990_GR]: '10-19,99 кг',
  [WeightCategory.FROM_20_000_TO_49_990_GR]: '20-49,99 кг',
  [WeightCategory.FROM_50_000_TO_99_990_GR]: '50-99,99 кг',
  [WeightCategory.FROM_100_000_TO_499_990_GR]: '100 - 499,99 кг',
  [WeightCategory.FROM_500_000_TO_999_990_GR]: '500-999,99 кг',

  [WeightCategory.FROM_1_000_TO_1_990_KG]: '1-1,99 т.',
  [WeightCategory.FROM_2_000_TO_4_990_KG]: '2-4,99 т.',
  [WeightCategory.FROM_5_000_TO_9_990_KG]: '5-9,99 т.',
  [WeightCategory.FROM_10_000_KG]: 'более 10 т.'
}

export interface IDistanceTypeMapper {
  value: DistanceType;
  viewValue: string;
}

export const DISTANCE_TYPE_MAPPER: IDistanceTypeMapper[] = [
  {value: DistanceType.FROM_0_TO_5, viewValue: 'От 0 до 5 км'},
  {value: DistanceType.FROM_5_TO_10, viewValue: 'От 5 до 10 км'},
  {value: DistanceType.FROM_10_TO_20, viewValue: 'От 10 до 20 км'},
  {value: DistanceType.FROM_20_TO_30, viewValue: 'От 20 до 30 км'},
  {value: DistanceType.FROM_30_TO_40, viewValue: 'От 30 до 40 км'},

  {value: DistanceType.FROM_40_TO_50, viewValue: 'От 40 до 50 км'},
  {value: DistanceType.FROM_50_TO_60, viewValue: 'От 50 до 60 км'},
  {value: DistanceType.FROM_60, viewValue: 'От 60 км'}
];

export const DISTANCE_TYPE_TRANSLATE = {
  [DistanceType.FROM_0_TO_5]: 'От 0 до 5 км',
  [DistanceType.FROM_5_TO_10]: 'От 5 до 10 км',
  [DistanceType.FROM_10_TO_20]: 'От 10 до 20 км',
  [DistanceType.FROM_20_TO_30]: 'От 20 до 30 км',
  [DistanceType.FROM_30_TO_40]: 'От 30 до 40 км',
  [DistanceType.FROM_40_TO_50]: 'От 40 до 50 км',
  [DistanceType.FROM_50_TO_60]: 'От 50 до 60 км',
  [DistanceType.FROM_60]: 'От 60 км'
}

export interface ITransportCategoryMapper {
  value: TransportCategory;
  viewValue: string;
}

export const TRANSPORT_CATEGORY_MAPPER: ITransportCategoryMapper[] = [
  {value: TransportCategory.ON_FOOT, viewValue: 'Пешком'},
  {value: TransportCategory.BIKE_MOTORCYCLE_MOPED, viewValue: 'Велосипед/мотоцикл/мопед'},
  {value: TransportCategory.CAR, viewValue: 'Легковой автомобиль'},
  {value: TransportCategory.PASSENGER_VAN, viewValue: 'Легковой фургон'},

  {value: TransportCategory.TRUCK_TO_2, viewValue: 'Грузовой автомобиль г/п до 2 т.'},
  {value: TransportCategory.TRUCK_FROM_2_TO_5, viewValue: 'Грузовой автомобиль г/п от 2 до 5 т.'},
  {value: TransportCategory.TRUCK_FROM_5_TO_10, viewValue: 'Грузовой автомобиль г/п от 5 до 10 т.'},
  {value: TransportCategory.TRUCK_FROM_10, viewValue: 'Грузовой автомобиль г/п более 10 т.'},

  {value: TransportCategory.MINIBUS, viewValue: 'Микроавтобус'},
  {value: TransportCategory.BUS, viewValue: 'Автобус'},
  {value: TransportCategory.ANOTHER_TYPE_TRANSPORT, viewValue: 'Другой вид транспорта'}
];

export const TRANSPORT_CATEGORY_TRASLATE = {
  [TransportCategory.ON_FOOT]: 'Пешком',
  [TransportCategory.BIKE_MOTORCYCLE_MOPED]: 'Велосипед/мотоцикл/мопед',
  [TransportCategory.CAR]: 'Легковой автомобиль',
  [TransportCategory.PASSENGER_VAN]: 'Легковой фургон',

  [TransportCategory.TRUCK_TO_2]: 'Грузовой автомобиль г/п до 2 т.',
  [TransportCategory.TRUCK_FROM_2_TO_5]: 'Грузовой автомобиль г/п от 2 до 5 т.',
  [TransportCategory.TRUCK_FROM_5_TO_10]: 'Грузовой автомобиль г/п от 5 до 10 т.',
  [TransportCategory.TRUCK_FROM_10]: 'Грузовой автомобиль г/п более 10 т.',

  [TransportCategory.MINIBUS]: 'Микроавтобус',
  [TransportCategory.BUS]: 'Автобус',
  [TransportCategory.ANOTHER_TYPE_TRANSPORT]: 'Другой вид транспорта'
};

export interface IModeTaskPerformerMapper {
  value: ModeTaskPerformer;
  viewValue: string;
};

export const MODE_TASK_PERFORMER_MAPPER: IModeTaskPerformerMapper[] = [
  {value: ModeTaskPerformer.RIGHT_AWAY, viewValue: "Обычный" },
  {value: ModeTaskPerformer.ON_DATE, viewValue: "На дату" }
];

export const FAST_MODE_TASK_PERFORMER_MAPPER: IModeTaskPerformerMapper[] = [
  {value: ModeTaskPerformer.RIGHT_AWAY, viewValue: "Обычный" },
  {value: ModeTaskPerformer.URGENTLY, viewValue: "Срочно"},
  {value: ModeTaskPerformer.ON_DATE, viewValue: "На дату" }
];

export interface IProductCategoryMapper {
  value: ProductCategory;
  viewValue: string;
}

export const PRODUCT_CATEGORY_MAPPER: IProductCategoryMapper[] = [
  {value: ProductCategory.FOOD, viewValue: 'Еда (Из заведений)'},
  {value: ProductCategory.PRODUCTS, viewValue: 'Продукты (Из магазина)'},
  {value: ProductCategory.FLOWERS, viewValue: 'Цветы'},
  {value: ProductCategory.HOUSEHOLD_GOODS, viewValue: 'Бытовые товары'},
  {value: ProductCategory.APPLIANCES, viewValue: 'Бытовая техника'},
  {value: ProductCategory.STATIONERY_AND_BOOKS, viewValue: 'Канцелярия и книги'},
  {value: ProductCategory.BUILDING_MATERIALS, viewValue: 'Стройматериалы'},
  {value: ProductCategory.CONSTRUCTION_AND_GARDEN_TOOLS, viewValue: 'Строительные и садовые инструменты'},

  {value: ProductCategory.COUNTRY_TOOLS, viewValue: 'Для дачи'},
  {value: ProductCategory.MEDICAL_SUPPLIES, viewValue: 'Медицинские товары'},
  {value: ProductCategory.ALCOHOL_AND_TOBACCO, viewValue: 'Алкоголь и табак'},
  {value: ProductCategory.GOODS_FOR_PETS, viewValue: 'Товары для животных'},

  {value: ProductCategory.COSMETICS_AND_EVERYTHING_FOR_BEAUTY, viewValue: 'Косметика и всё для красоты'},
  {value: ProductCategory.EVERYTHING_FOR_CARS, viewValue: 'Всё для автомобилей'},
  {value: ProductCategory.EVERYTHING_FOR_OUTDOOR_ACTIVITIES, viewValue: 'Всё для активного отдыха'},
  {value: ProductCategory.CHILDRENS_PRODUCTS, viewValue: 'Товары для детей'},
  {value: ProductCategory.OTHER, viewValue: 'Прочее'},
];

export interface ICalcModeMapper {
  value: CalcMode;
  viewValue: string;
}

export const CALC_MODE_MAPPER: ICalcModeMapper[] = [
  {value: CalcMode.BASED_ON_METER, viewValue: 'На основе расстояния'},
  {value: CalcMode.BASED_ON_HOUR, viewValue: 'На основе часов'},
  {value: CalcMode.AT_CHOICE, viewValue: 'На выбор пользователя'}
]

export const CALC_MODE_SHORT_MAPPER: ICalcModeMapper[] = [
  {value: CalcMode.BASED_ON_METER, viewValue: 'На основе расстояния'},
  {value: CalcMode.BASED_ON_HOUR, viewValue: 'На основе часов'}
]

export const CALC_MODE_TRANSLATE = {
  [CalcMode.BASED_ON_METER]: 'На основе расстояния',
  [CalcMode.BASED_ON_HOUR]: 'На основе часов',
  [CalcMode.AT_CHOICE]: 'На выбор пользователя'
}

export const AVAILABLE_CALC_MODE_MAPPER: ICalcModeMapper[] = [
  {value: CalcMode.BASED_ON_METER, viewValue: 'На основе расстояния'},
  {value: CalcMode.BASED_ON_HOUR, viewValue: 'На основе часов'}
]

export const PRODUCT_CATEGORY_TRASLATE = {
  [ProductCategory.FOOD]: 'Еда (Из заведений)',
  [ProductCategory.PRODUCTS]: 'Продукты (Из магазина)',
  [ProductCategory.FLOWERS]: 'Цветы',
  [ProductCategory.HOUSEHOLD_GOODS]: 'Бытовые товары',
  [ProductCategory.APPLIANCES]: 'Бытовая техника',
  [ProductCategory.STATIONERY_AND_BOOKS]: 'Канцелярия и книги',
  [ProductCategory.BUILDING_MATERIALS]: 'Стройматериалы',
  [ProductCategory.CONSTRUCTION_AND_GARDEN_TOOLS]: 'Строительные и садовые инструменты',

  [ProductCategory.COUNTRY_TOOLS]: 'Для дачи',
  [ProductCategory.MEDICAL_SUPPLIES]: 'Медицинские товары',
  [ProductCategory.ALCOHOL_AND_TOBACCO]: 'Алкоголь и табак',
  [ProductCategory.GOODS_FOR_PETS]: 'Товары для животных',

  [ProductCategory.COSMETICS_AND_EVERYTHING_FOR_BEAUTY]: 'Косметика и всё для красоты',
  [ProductCategory.EVERYTHING_FOR_CARS]: 'Всё для автомобилей',
  [ProductCategory.EVERYTHING_FOR_OUTDOOR_ACTIVITIES]: 'Всё для активного отдыха',
  [ProductCategory.CHILDRENS_PRODUCTS]: 'Товары для детей',
  [ProductCategory.OTHER]: 'Прочее',

};


export const MODE_TASK_PERFORMER_TRANSLATE = {
  [ModeTaskPerformer.RIGHT_AWAY]: 'Обычный',
  [ModeTaskPerformer.URGENTLY]: 'Срочно',
  [ModeTaskPerformer.ON_DATE]: 'На дату',
};

export const CHAT_ARBITRATION_STATUS_TRANSLATE = {
  [ChatArbitrationStatus.SUCCESS]: 'Арбитраж разрешен',
  [ChatArbitrationStatus.SUCCESS_IN_FAVOR_CUSTOMER]: 'Арбитраж разрешен в пользу заказчика',
  [ChatArbitrationStatus.SUCCESS_IN_FAVOR_PERFORMER]: 'Арбитраж разрешен в пользу исполнителя',
}

export const DEAL_STATE_TRANSLATE = {
  [DealState.Created]: 'Сделка зарегистрирована',
  [DealState.PaymentProcessing]: 'Производится оплата',
  [DealState.PaymentProcessError]: 'Ошибка при оплате',
  [DealState.Paid]: 'Успешно оплачена',

  [DealState.PayoutProcessing]: 'Производится выплата',
  [DealState.PayoutProcessError]: 'Ошибка при выплате',
  [DealState.Completed]: 'Успешно завершена',

  [DealState.Canceling]: 'Отменяется',
  [DealState.CancelError]: 'Ошибка при отмене',
  [DealState.Canceled]: 'Отменена',

  [DealState.PaymentHold]: '',
  [DealState.PaymentHoldProcessing]: '',
  [DealState.Archived]: '',
};

export const DEAL_STATE_TOOLTIP = {
  [DealState.Created]: 'Если вы ещё не оплатили задачу - нажимите кнопку "Внести платеж", если оплата пройдена, нажмите на кнопку "Обновить статус оплаты"',
  [DealState.PaymentProcessing]: 'Производится проверка оплаты задачи, пожалуйста, подождите',
  [DealState.PaymentProcessError]: 'Ошибка при оплате, обратитесь к администратору',
  [DealState.Paid]: 'Успешно оплачена',

  [DealState.PayoutProcessing]: 'Производится выплата',
  [DealState.PayoutProcessError]: 'Ошибка при выплате',
  [DealState.Completed]: 'Успешно завершена',

  [DealState.Canceling]: 'Отменяется',
  [DealState.CancelError]: 'Ошибка при отмене',
  [DealState.Canceled]: 'Отменена',

  [DealState.PaymentHold]: '',
  [DealState.PaymentHoldProcessing]: '',
  [DealState.Archived]: '',
};

