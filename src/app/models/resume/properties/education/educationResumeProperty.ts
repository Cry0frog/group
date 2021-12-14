import { EducationType } from "src/app/models/vacancy/educationType";
import { BaseResumeProperty } from "../baseResumeProperty";
import { TypeResumeProperty } from "../typeResumeProperty";

export class EducationResumeProperty extends BaseResumeProperty {
    
  education: EducationType;
  
  speciality: string;
  educationalInstitution: string;

  getClassName() {
    return 'EducationResumeProperty'; //(<any>this).constructor.name;
  }

  static convertToObj(obj: any): EducationResumeProperty {
    if(obj == null) {
      return null;
    }

    const resumeProp = new EducationResumeProperty();
    Object.assign(resumeProp, obj);

    return resumeProp;
  }

  static createEmptyProperty(orderCounter: number): EducationResumeProperty {
    const prop = new EducationResumeProperty();
    prop.type = TypeResumeProperty.EDUCATION;
    prop.order = orderCounter;
    return prop;
  }
}