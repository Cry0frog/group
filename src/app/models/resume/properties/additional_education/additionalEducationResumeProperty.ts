import { BaseResumeProperty } from "../baseResumeProperty";
import { TypeResumeProperty } from "../typeResumeProperty";

export class AdditionalEducationResumeProperty extends BaseResumeProperty {
    
    additionalEducation: string;

    getClassName() {
      return 'AdditionalEducationResumeProperty'; //(<any>this).constructor.name;
    }

    static convertToObj(obj: any): AdditionalEducationResumeProperty {
      if(obj == null) {
        return null;
      }
  
      const resumeProp = new AdditionalEducationResumeProperty();
      Object.assign(resumeProp, obj);
  
      return resumeProp;
    }

    static createEmptyProperty(orderCounter: number): AdditionalEducationResumeProperty {
      const prop = new AdditionalEducationResumeProperty();
      prop.type = TypeResumeProperty.ADDITIONAL_EDUCATION;
      prop.order = orderCounter;
      return prop;
    }
}