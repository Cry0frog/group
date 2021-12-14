import { LazyLoadingModel } from './../lazyLoading/lazyLoadingModel';
import { FilterRole } from 'src/app/auth/filterRole';
import { ShortLegalEntity } from './shortLegalEntity';

export class ShortLegalEntityWithCountedPages extends LazyLoadingModel {

  constructor() {
    super();
    this.shortLegalEntities = [];
    this.filterRole = FilterRole.ALL;
  }

  shortLegalEntities: ShortLegalEntity[];
  filterRole: FilterRole;

  public static convertToObj(obj): ShortLegalEntityWithCountedPages {
    if(obj == null) {
      return null;
    }

    const legalEntityWithCountedPages = new ShortLegalEntityWithCountedPages();
    Object.assign(legalEntityWithCountedPages, obj);
    legalEntityWithCountedPages.shortLegalEntities = obj.shortLegalEntities.map(obj => ShortLegalEntity.convertToObj(obj));

    return legalEntityWithCountedPages;
  }
}
