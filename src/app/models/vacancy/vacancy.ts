import { EmploymentType } from './employmentType';
import { ScheduleType } from './scheduleType';
import { ShortUserInfo } from 'src/app/models/task/shortUserInfo';
import { FieldActivity } from './../field-activity/fileldActivity';
import { GeoCityProperty } from './../map/geo/city/geoCityProperty';
import { PlaceWorkType } from './placeWorkType';
import { EducationType } from "./educationType";
import { WorkExperienceType } from "./workExperienceType";
import { VacancyStatus } from './vacancyStatus';
import { ErrorHandler } from '../error/errorHandler';
import { MapVacancyPropertyPoint } from './mapVacancyPropertyPoint';

export class Vacancy extends ErrorHandler {

  constructor() {
    super();
    this.status = VacancyStatus.PUBLISHED;
    this.userInfo = new ShortUserInfo();
    this.fieldActivity = new FieldActivity();
    this.city = new GeoCityProperty();
    this.points = [];
  }

  id: number;
  name: string;
  description: string;
  minAge: string;
  maxAge: string;
  requirements: string;
  educationType: EducationType;
  education: string;
  experienceType: WorkExperienceType;
  workExperienceValue: number;
  placeWorkType: PlaceWorkType;
  businessTrips: boolean;
  moving: boolean;
  status: VacancyStatus;
  addressMoving: string;
  salary: number;

  creatorId: number;

  createdAt: Date;
  dateEndPublication: Date;

  city: GeoCityProperty;
  fieldActivity: FieldActivity;
  userInfo: ShortUserInfo;

  scheduleType: ScheduleType;
  employmentType: EmploymentType;

  points: MapVacancyPropertyPoint[];

  favoriteVacancy: boolean;

  countedFavorite: number;
  countedViewing: number;

  public getBusinessTripsDescr(): string {
    return this.businessTrips ? "Есть" : "Нет";
  }

  public getMoving(): string {
    return this.moving ? "Есть" : "Нет";
  }

  getPointsSortedByOrder(): MapVacancyPropertyPoint[] {
    return this.points.sort(
      (a: MapVacancyPropertyPoint, b: MapVacancyPropertyPoint) =>
        (a.order > b.order) ? 1
        : (a.order === b.order) ? 0
        : -1
    );
  }

  public static convertToObj(obj): Vacancy {
    if(obj == null) {
      return;
    }

    const dto: Vacancy = new Vacancy();
    Object.assign(dto, obj);

    if(obj.city != null) {
      dto.city = GeoCityProperty.convertToObj(obj.city, null);
    }

    if(obj.fieldActivity != null) {
      dto.fieldActivity = FieldActivity.convertToObj(obj.fieldActivity, false);
    }

    if(obj.userInfo != null) {
      dto.userInfo = ShortUserInfo.shortUserInfoConvertToObj(obj.userInfo);
    }

    if(obj.points != null) {
      dto.points = obj.points.map(el => MapVacancyPropertyPoint.convertToObj(el));
    }

    return dto;
  }

  setMapToCenterOfPoints() {
    let lon; let lat;

    if(this.points.length >= 2) {
      lon = (Number(this.points[0].lon) + Number(this.points[this.points.length - 1].lon)) / 2;
      lat = (Number(this.points[0].lat) + Number(this.points[this.points.length - 1].lat)) / 2;
    }
    else {
      lon = Number(this.points[0].lon);
      lat = Number(this.points[0].lat);
    }
    return [lon, lat];
  }

  isShowEditVacancy(): boolean {
    return this.status == VacancyStatus.PUBLISHED || this.status == VacancyStatus.HIDE || this.status == VacancyStatus.NOT_PAYED;
  }

  isPublished(): boolean {
    return this.status == VacancyStatus.PUBLISHED;
  }

  isHide(): boolean {
    return this.status == VacancyStatus.HIDE;
  }

  isNotPay(): boolean {
    return this.status == VacancyStatus.NOT_PAYED;
  }
}
