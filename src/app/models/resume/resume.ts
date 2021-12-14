import { Offset } from 'src/app/common/offset';
import { ErrorHandler } from '../error/errorHandler';
import { EmploymentType } from '../vacancy/employmentType';
import { PlaceWorkType } from '../vacancy/placeWorkType';
import { ScheduleType } from '../vacancy/scheduleType';
import { FieldActivity } from './../field-activity/fileldActivity';
import { GeoCityProperty } from './../map/geo/city/geoCityProperty';
import { DesirableEmploymentType } from './desirableEmploymentType';
import { AdditionalEducationResumeProperty } from './properties/additional_education/additionalEducationResumeProperty';
import { BaseResumeProperty } from './properties/baseResumeProperty';
import { EducationResumeProperty } from './properties/education/educationResumeProperty';
import { TypeResumeProperty } from './properties/typeResumeProperty';
import { WorkExperienceResumeProperty } from './properties/work_experience/workExperienceResumeProperty';

export class Resume extends ErrorHandler {

  constructor(vacancyId?: number) {
    super();
    this.fieldsActivity = [];
    this.properties = [];
    this.workCity = new GeoCityProperty();
    this.orderCounter = 0;
    this.visibleResume = true;
    this.vacancyId = vacancyId;
  }

  static PROP_TYPE = "@type";

  id: number;
  fio: string;
  age: string;

  creatorId: number;
  vacancyId: number;

  properties: BaseResumeProperty[];

  paid: boolean;

  skills: string;
  personalQualities: string;
  desiredPosition: string;
  minSalary: number;
  additionalInformation: string;

  workCity: GeoCityProperty;
  fieldsActivity: FieldActivity[];

  scheduleType: ScheduleType;
  placeWorkType: PlaceWorkType;
  employmentType: EmploymentType;
  desirableEmploymentType: DesirableEmploymentType;

  crossings: boolean;
  businessTrip: boolean;
  visibleResume: boolean;
  defaultResume: boolean;

  dateOfCreation: Date;
  dateOfLastChange: Date;

  favoriteResume: boolean;

  countedFavorite: number;
  countedViewing: number;

  //only ui
  orderCounter: number;

  public static convertToObj(obj): Resume {
    if(obj == null) {
      return;
    }

    const dto: Resume = new Resume();
    Object.assign(dto, obj);

    if(dto.properties != null) {
      const props = [];
      dto.properties.forEach((prop: BaseResumeProperty) => {
        if(prop.type == TypeResumeProperty.WORK_EXPERIENCE) {
          props.push(WorkExperienceResumeProperty.convertToObj(prop));
        }
        else if(prop.type == TypeResumeProperty.EDUCATION) {
          props.push(EducationResumeProperty.convertToObj(prop));
        }
        else if(prop.type == TypeResumeProperty.ADDITIONAL_EDUCATION) {
          props.push(AdditionalEducationResumeProperty.convertToObj(prop));
        }
        else {
          props.push(BaseResumeProperty.convertToObj(prop));
        }

      });
      dto.properties = props;
    }

    if(obj.workCity != null) {
      dto.workCity = GeoCityProperty.convertToObj(obj.workCity, null);
    }

    if(obj.fieldsActivity != null) {
      dto.fieldsActivity = obj.fieldsActivity.map(fieldActivity => FieldActivity.convertToObj(fieldActivity, false));
    }
    return dto;
  }

  getWorkExperienceProperties(): WorkExperienceResumeProperty[] {
    if(this.properties == null || this.properties.length == 0) {
      return [];
    }

    const workExperienceProperties = this.properties.filter(property => property.type == TypeResumeProperty.WORK_EXPERIENCE);

    if(workExperienceProperties.length == 0) {
      return [];
    }

    return <WorkExperienceResumeProperty[]>workExperienceProperties;
  }

  getEducationProperties(): EducationResumeProperty[] {
    if(this.properties == null || this.properties.length == 0) {
      return [];
    }

    const educationProperties = this.properties.filter(property => property.type == TypeResumeProperty.EDUCATION);

    if(educationProperties.length == 0) {
      return [];
    }

    return <EducationResumeProperty[]>educationProperties;
  }

  getAdditionalEducationProperties(): AdditionalEducationResumeProperty[] {
    if(this.properties == null || this.properties.length == 0) {
      return [];
    }

    const additionalEducationProperties = this.properties.filter(property => property.type == TypeResumeProperty.ADDITIONAL_EDUCATION);

    if(additionalEducationProperties.length == 0) {
      return [];
    }

    return <AdditionalEducationResumeProperty[]>additionalEducationProperties;
  }

  getResumeProperties(): BaseResumeProperty[] {
    if(this.properties == null || this.properties.length == 0) {
      return [];
    }

    return this.properties;
  }

  prepareBeforeSave() {
    this.properties.forEach((el: BaseResumeProperty) => {
      el[Resume.PROP_TYPE] = el.getClassName();
      if(TypeResumeProperty.WORK_EXPERIENCE.includes(el.type)) {
        const workExperienceProp: WorkExperienceResumeProperty = <WorkExperienceResumeProperty>el;
        const [day_start, month_start, year_start]: string[] = workExperienceProp.startWorkShow.split('.');
        const [day_end, month_end, year_end]: string[] = workExperienceProp.endWorkShow.split('.');
        workExperienceProp.startWork = new Date(year_start + "-" + month_start + "-" + day_start);
        workExperienceProp.endWork = new Date(year_end + "-" + month_end + "-" + day_end);
        workExperienceProp.offset = Offset.getCurTimeZone();
      }
    });
  }

  static sortByDate(listResume): Resume[] {
    return listResume.sort((a,b) =>
      (a.dateOfCreation < b.dateOfCreation) ? 1
      : (a.dateOfCreation === b.dateOfCreation) ? 0
      : -1
    );
  }
}
