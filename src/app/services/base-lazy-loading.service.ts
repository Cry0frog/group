import { Injectable } from '@angular/core';
import { SortParams } from './../models/sort/sortParams';
import { SortType } from './../models/common/sortType';
import { PageableParams } from 'src/app/models/pageable/PageableParams';

@Injectable({
  providedIn: 'root'
})
export class BaseLazyLoadingService {

  public handlePage(event, pageableParams: PageableParams): PageableParams {
    if(event.pageSize != pageableParams.size) {
      pageableParams.page = 0;
      pageableParams.size = event.pageSize;
    }
    else {
      pageableParams.page = event.pageIndex;
    }

    return pageableParams;
  }

  sortChange(event, sortParams: SortParams): SortParams {
    sortParams.nameSort = event.active;
    if(event.direction == SortType.DECK) {
       sortParams.typeSort = SortType.DECK;
       return sortParams;
    }
    else if(event.direction == SortType.ASK) {
      sortParams.typeSort = SortType.ASK;
      return sortParams;
    }
    else {
      return new SortParams();
    }
  }
}
