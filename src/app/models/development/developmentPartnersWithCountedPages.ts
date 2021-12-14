import { DevelopmentPartner } from 'src/app/models/development/developmentPartner';
import { LazyLoadingModel } from './../lazyLoading/lazyLoadingModel';

export class DevelopmentPartnersWithCountedPages extends LazyLoadingModel {
  constructor() {
    super();
    this.partners = [];
  }

  partners: DevelopmentPartner[];

  public static convertToObj(obj): DevelopmentPartnersWithCountedPages {
    if(obj == null) {
      return null;
    }

    const fakeUsersWithCountedPages = new DevelopmentPartnersWithCountedPages();
    Object.assign(fakeUsersWithCountedPages, obj);
    fakeUsersWithCountedPages.partners = obj.partners.map(obj => DevelopmentPartner.convertToObj(obj));

    return fakeUsersWithCountedPages;
  }
}
