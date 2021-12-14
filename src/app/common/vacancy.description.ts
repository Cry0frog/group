import { VacancyStatus } from 'src/app/models/vacancy/vacancyStatus';
import { FilterStatusVacancy } from 'src/app/models/vacancy/filterStatusVacancy';

export interface IVacancyStatusMapper {
  value: VacancyStatus;
  viewValue: string;
}

export const VACANCY_STATUS_MAPPER: IVacancyStatusMapper[] = [
  {value: VacancyStatus.HIDE, viewValue: 'Скрыта'},
  {value: VacancyStatus.PUBLISHED, viewValue: 'Опубликована'},
  {value: VacancyStatus.FOUND, viewValue: 'Работник найден'}
];

export const VACANCY_STATUS_TRANSLATE = {
  [VacancyStatus.HIDE]: 'Скрыта',
  [VacancyStatus.FOUND]: 'Работник найден',
  [VacancyStatus.PUBLISHED]: 'Опубликована',
  [VacancyStatus.NOT_PAYED]: 'Не оплачена',
}

export interface IFilterStatusVacancyMapper {
  value: FilterStatusVacancy;
  viewValue: string;
}

export const FILTER_STATUS_VACANCY_MAPPER: IFilterStatusVacancyMapper[] = [
  {value: FilterStatusVacancy.ALL, viewValue: 'Все'},
  {value: FilterStatusVacancy.PUBLISHED, viewValue: 'Опубликована'},
  {value: FilterStatusVacancy.HIDE, viewValue: 'Скрыта'},
  {value: FilterStatusVacancy.NOT_PAYED, viewValue: 'Не оплачена'},
  //{value: FilterStatusVacancy.FOUND, viewValue: 'Работник найден'}
];
