import { SortType } from '../common/sortType';

export class SortParams {

  constructor() {
    this.typeSort = SortType.DECK;
    this.nameSort = 'id';
  }

  nameSort: string;
  typeSort: SortType;
}
