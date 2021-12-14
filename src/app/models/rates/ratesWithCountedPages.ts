import { Rate } from './rate';
import { SortType } from '../../models/common/sortType' ;

export class RatesWithCountedPages {

  constructor(){
      this.rates = [];
      this.pageIndex = 0;
      this.pageSize = 20;
      this.nameToSort = 'id'
      this.typeToSort = SortType.DECK;
      this.search = "non";
  }

  rates: Rate[];
  countedPages: number;
  pageIndex: number;
  pageSize: number;

  typeToSort: SortType;
  nameToSort: string;

  search: string;

  static convertToObj(obj: any): RatesWithCountedPages {
    if(obj == null) {
      return null;
    }
    const ratesWithCountedPages = new RatesWithCountedPages();
    Object.assign(ratesWithCountedPages, obj);
    ratesWithCountedPages.rates = obj.rates.map(rateObj => Rate.convertToObj(rateObj));

    return ratesWithCountedPages;
  }

}