import { LazyLoadingModel } from './../lazyLoading/lazyLoadingModel';
import { ShortPartner } from './shortPartner';
import { FilterRole } from 'src/app/auth/filterRole';

export class ShortPartnersWitCountedPages extends LazyLoadingModel {

  constructor() {
    super();
    this.shortPartners = [];
    this.filterRole = FilterRole.ALL;
  }

  shortPartners: ShortPartner[];
  filterRole: FilterRole;

  public static convertToObj(obj): ShortPartnersWitCountedPages {
    if(obj == null) {
      return null;
    }

    const usersWithCountedPages = new ShortPartnersWitCountedPages();
    Object.assign(usersWithCountedPages, obj);
    usersWithCountedPages.shortPartners = obj.shortPartners.map(obj => ShortPartner.convertToObj(obj));

    return usersWithCountedPages;
  }
}
