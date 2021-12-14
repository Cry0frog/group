import { GeoCityProperty } from './../map/geo/city/geoCityProperty';
import { PartnerInfo } from 'src/app/models/partnerInfo/partnerInfo';
import { ImageWorkExample } from '../image_work_example/imageWorkExample';
import { Resume } from '../resume/resume';

export class PartnerInfoWithCity extends PartnerInfo {
  constructor() {
    super();
    this.cityProperty = new GeoCityProperty();
  }

  cityProperty: GeoCityProperty;
  completedTasksForThisUser: number;

  getCityName(): string {
    return this.cityProperty != null ? this.cityProperty.name : null;
  }

  static convertToObj(obj: any): PartnerInfoWithCity {
    if(obj == null) {
      return null;
    }
    const partnerInfo: PartnerInfoWithCity = new PartnerInfoWithCity();
    Object.assign(partnerInfo, obj);
    partnerInfo.dateLastActivity = obj.dateLastActivity != null ? new Date(obj.dateLastActivity) : null;
    partnerInfo.cityProperty = GeoCityProperty.convertToObj(obj.cityProperty, null);
    partnerInfo.images = obj.images != null ? obj.images.map(el => ImageWorkExample.convertToObj(el)) : [];
    
    if(obj.resume != null) {
      partnerInfo.resume = Resume.convertToObj(obj.resume);
    }
    return partnerInfo;
  }

  static sortByRatingDesc(performers: PartnerInfoWithCity[]): PartnerInfoWithCity[] {
    return performers.sort((a, b) => {
      if(a.averageRating == b.averageRating) {
        if(a.completedTasks == b.completedTasks) {
          return a.idPartner - b.idPartner;
        }
        else {
          return b.completedTasks - a.completedTasks;
        }
      }
      else {
        return b.averageRating - a.averageRating;
      }
    });
  }

  static sortByRatingAsc(performers: PartnerInfoWithCity[]): PartnerInfoWithCity[] {
    return performers.sort((a, b) => {
      if(a.averageRating == b.averageRating) {
        if(a.completedTasks == b.completedTasks) {
          return a.idPartner - b.idPartner;
        }
        else {
          return a.completedTasks - b.completedTasks;
        }
      }
      else {
        return a.averageRating - b.averageRating;
      }
    });
  }

  static sortByNumberOfTasksdDesc(performers: PartnerInfoWithCity[]): PartnerInfoWithCity[] {
    return performers.sort((a, b) => {
      if(a.completedTasks == b.completedTasks) {
        if(a.averageRating == b.averageRating) {
          return a.idPartner - b.idPartner;
        }
        else {
          return b.averageRating - a.averageRating;
        }
      }
      else {
        return b.completedTasks - a.completedTasks;
      }
    });
  }

  static sortByNumberOfTasksdAsc(performers: PartnerInfoWithCity[]): PartnerInfoWithCity[] {
    return performers.sort((a, b) => {
      if(a.completedTasks == b.completedTasks) {
        if(a.averageRating == b.averageRating) {
          return a.idPartner - b.idPartner;
        }
        else {
          return a.averageRating - b.averageRating;
        }
      }
      else {
        return a.completedTasks - b.completedTasks;
      }
    });
  }

}
