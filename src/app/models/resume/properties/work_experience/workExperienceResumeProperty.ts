import { BaseResumeProperty } from "../baseResumeProperty";
import { TypeResumeProperty } from "../typeResumeProperty";

export class WorkExperienceResumeProperty extends BaseResumeProperty {
    nameCompany: string;
    position: string;
    offset: string;

    startWork: Date;
    endWork: Date;

    // only ui
    startWorkShow: string;
    endWorkShow: string;

    getClassName() {
      return 'WorkExperienceResumeProperty'; //(<any>this).constructor.name;
    }

    static convertToObj(obj: any): WorkExperienceResumeProperty {
      if(obj == null) {
        return null;
      }
      const resumeProp = new WorkExperienceResumeProperty();
      Object.assign(resumeProp, obj);
      resumeProp.startWork = new Date(obj.startWork);
      resumeProp.endWork = new Date(obj.endWork);

      resumeProp.startWorkShow = resumeProp.startWork.toLocaleDateString();
      resumeProp.endWorkShow = resumeProp.endWork.toLocaleDateString();
      return resumeProp;
    }

    static createEmptyProperty(orderCounter: number): WorkExperienceResumeProperty {
      const prop = new WorkExperienceResumeProperty();
      prop.type = TypeResumeProperty.WORK_EXPERIENCE;
      prop.order = orderCounter;
      return prop;
    }
}