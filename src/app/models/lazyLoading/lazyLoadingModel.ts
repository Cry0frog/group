import { PageableParams } from 'src/app/models/pageable/PageableParams';
import { SortParams } from '../sort/sortParams';

export class LazyLoadingModel {

  constructor() {
    this.pageableParams = new PageableParams();
    this.sortParams = new SortParams();
  }

  pageableParams: PageableParams;
  sortParams: SortParams;
  search: string;
}
