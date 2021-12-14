import { TypeResumeProperty } from "./typeResumeProperty";

export class BaseResumeProperty {
    
    id: number;
    type: TypeResumeProperty;

    // only ui
    order: number;

    getClassName() {
        return 'base';
    } 

    isEducation(): boolean {
        return this.type == TypeResumeProperty.EDUCATION;
    }

    isAdditionalEducation(): boolean {
        return this.type == TypeResumeProperty.ADDITIONAL_EDUCATION;
    }

    isWorkExperience(): boolean {
        return this.type == TypeResumeProperty.WORK_EXPERIENCE;
    }

    static convertToObj(obj: any): BaseResumeProperty {
        if(obj == null) {
          return null;
        }
    
        const resumeProp = new BaseResumeProperty();
        Object.assign(resumeProp, obj);
      
        return resumeProp;
    }
    
}