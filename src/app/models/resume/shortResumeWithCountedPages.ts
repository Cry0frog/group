import { ShortResume } from './shortResume';
import { LazyLoadingModel } from "../lazyLoading/lazyLoadingModel";
import { FilterStatusResume } from './filterStatusResume';

export class ShortResumeWithCountedPages extends LazyLoadingModel {

  constructor() {
    super();
    this.resumeList = [];
  }

  resumeList: ShortResume[];
  filterStatusResume: FilterStatusResume;

  static convertToObj(obj): ShortResumeWithCountedPages {
    const shortResumeWithCountedPages = new ShortResumeWithCountedPages();
    Object.assign(shortResumeWithCountedPages, obj);
    shortResumeWithCountedPages.resumeList = obj.resumeList != null ? obj.resumeList.map(el => ShortResume.convertToObj(el)) : [];
    return shortResumeWithCountedPages;
  }
}
