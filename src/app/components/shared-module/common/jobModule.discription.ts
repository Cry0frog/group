import { ScheduleType } from './../../../models/vacancy/scheduleType';
import { PlaceWorkType } from '../../../models/vacancy/placeWorkType';
import { WorkExperienceType } from './../../../models/vacancy/workExperienceType';
import { VacancyStatus } from './../../../models/vacancy/vacancyStatus';
import { EducationType } from "src/app/models/vacancy/educationType";
import { EmploymentType } from 'src/app/models/vacancy/employmentType';
import { DesirableEmploymentType } from 'src/app/models/resume/desirableEmploymentType';

export interface IEducationType{
  value: EducationType;
  viewValue: string;
}

export const EDUCATION_TYPE: IEducationType[] = [
  { value: EducationType.NOT_FUNDAMENTALY, viewValue: 'Не принципиально'},
  { value: EducationType.AVERAGE_GENERAL, viewValue: 'Среднее общее'},
  { value: EducationType.SPECIALIZED_SECONDARY, viewValue: 'Среднее специальное'},
  { value: EducationType.HIGHER, viewValue: 'Высшее'}
]

export const EDUCATION_TYPE_TRANSLATE = {
  [EducationType.NOT_FUNDAMENTALY]: 'Не принципиально',
  [EducationType.AVERAGE_GENERAL]: 'Среднее общее',
  [EducationType.SPECIALIZED_SECONDARY]: 'Среднее специальное',
  [EducationType.HIGHER]: 'Высшее'
}

export interface IVacancyStatus{
  value: VacancyStatus;
  viewValue: string;
}

export const VACANCY_STATUS: IVacancyStatus[] = [
  { value: VacancyStatus.HIDE, viewValue: 'Скрыта'},
  { value: VacancyStatus.PUBLISHED, viewValue: 'Опубликовано'},
]

export const VACANCY_STATUS_TRANSLATE = {
  [VacancyStatus.HIDE]: 'Скрыта',
  [VacancyStatus.PUBLISHED]: 'Опубликовано',
  [VacancyStatus.FOUND]: 'Вакансия закрыта',
  [VacancyStatus.NOT_PAYED]: 'Не оплачена',
}

export interface IWorkExperienceType{
  value: WorkExperienceType;
  viewValue: string;
}

export const WORK_EXPERIENCE_TYPE: IWorkExperienceType[] = [
  { value: WorkExperienceType.NOT_FUNDAMENTALY, viewValue: 'Не принципиально'},
  { value: WorkExperienceType.DESIRABLE, viewValue: 'Желателен'},
  { value: WorkExperienceType.REQUIRED, viewValue: 'Требуется'}
]

export const WORK_EXPERIENCE_TYPE_TRANSLATE = {
  [WorkExperienceType.NOT_FUNDAMENTALY]: 'Не принципиально',
  [WorkExperienceType.DESIRABLE]: 'Желателен',
  [WorkExperienceType.REQUIRED]: 'Требуется',
}

export interface IPlaceWorkType{
  value: PlaceWorkType;
  viewValue: string;
}

export const PLACE_WORK_TYPE: IPlaceWorkType[] = [
  { value: PlaceWorkType.NOT_FUNDAMENTALY, viewValue: 'Не принципиально'},
  { value: PlaceWorkType.REMOTELY, viewValue: 'Удалённо'},
  { value: PlaceWorkType.IN_PLACE, viewValue: 'На месте'}
]

export const PLACE_WORK_TYPE_TRANSLATE = {
  [PlaceWorkType.NOT_FUNDAMENTALY]: 'Не принципиально',
  [PlaceWorkType.REMOTELY]: 'Удалённо',
  [PlaceWorkType.IN_PLACE]: 'На месте',
}

export interface IScheduleType {
  value: ScheduleType;
  viewValue: string;
}

export const SCHEDULE_TYPE: IScheduleType[] = [
  { value: ScheduleType.FULL_DAY, viewValue: 'Полный день'},
  { value: ScheduleType.FLEXIBLE_SCHEDULE, viewValue: 'Гибкий график'},
  { value: ScheduleType.SHIFT_SCHEDULE, viewValue: 'Сменный график'},
  { value: ScheduleType.SHIFT_METHOD, viewValue: 'Вахтовый метод'}
]

export const SCHEDULE_TYPE_TRANSLATE = {
  [ScheduleType.FULL_DAY]: 'Полный день',
  [ScheduleType.FLEXIBLE_SCHEDULE]: 'Гибкий график',
  [ScheduleType.SHIFT_SCHEDULE]: 'Сменный график',
  [ScheduleType.SHIFT_METHOD]: 'Вахтовый метод',
}

export interface IEmploymentType {
  value: EmploymentType;
  viewValue: string;
}

export const EMPLOYMENT_TYPE: IEmploymentType[] = [
  { value: EmploymentType.FULL_TIME, viewValue: 'Полная занятость'},
  { value: EmploymentType.PART_TIME, viewValue: 'Частичная занятость'},
  { value: EmploymentType.INTERNSHIP, viewValue: 'Стажировка'},
]

export const EMPLOYMENT_TYPE_TRANSLATE = {
  [EmploymentType.FULL_TIME]: 'Полная занятость',
  [EmploymentType.PART_TIME]: 'Частичная занятость',
  [EmploymentType.INTERNSHIP]: 'Стажировка',
}

export interface IDesirableEmploymentType {
  value: DesirableEmploymentType;
  viewValue: string;
}

export const DESIRABLE_EMPLOYMENT_TYPE: IDesirableEmploymentType[] = [
  { value: DesirableEmploymentType.NOT_IMPORTANT, viewValue: 'Не принципиально'},
  { value: DesirableEmploymentType.NOT_OFFICIAL_DEVICE, viewValue: 'Не официальное устройство'},
  { value: DesirableEmploymentType.PERMANENT_BASIS, viewValue: 'На постоянную основу'},
  { value: DesirableEmploymentType.PER_CONTRACT, viewValue: 'На контракт'}
]
