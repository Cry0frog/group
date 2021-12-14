import { FilterStatusResume } from './../models/resume/filterStatusResume';

export interface IFilterStatusResumeMapper {
  value: FilterStatusResume;
  viewValue: string;
}

export const FILTER_STATUS_RESUME_MAPPER: IFilterStatusResumeMapper[] = [
  {value: FilterStatusResume.ALL, viewValue: 'Все'},
  {value: FilterStatusResume.DEFAULT, viewValue: 'Личные'},
  {value: FilterStatusResume.SUBMITTED, viewValue: 'Поданные'},
];
