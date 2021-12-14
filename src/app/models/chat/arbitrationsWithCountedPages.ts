import { ChatArbitration } from './arbitration/chatArbitration';
import { LazyLoadingModel } from './../lazyLoading/lazyLoadingModel';

export class ArbitrationsWithCountedPages extends LazyLoadingModel {

  constructor() {
    super();
    this.arbitrations = [];
  }

  arbitrations: ChatArbitration[];

  static convertToObj(obj): ArbitrationsWithCountedPages {
    if(obj == null) {
      return null;
    }

    const arbitrationsWithPages = new ArbitrationsWithCountedPages();
    Object.assign(arbitrationsWithPages, obj);
    arbitrationsWithPages.arbitrations = obj.arbitrations.map(obj => ChatArbitration.convertToObj(obj));

    return arbitrationsWithPages;
  }
}
