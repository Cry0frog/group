import { LazyLoadingModel } from './../lazyLoading/lazyLoadingModel';
import { ShortTask } from './shortTask';

export class ShortTaskWithCountedPages extends LazyLoadingModel {
  constructor() {
    super();
    this.tasks = [];
  }

  tasks: ShortTask[];

  public static convertToObj(obj): ShortTaskWithCountedPages {
    if(obj == null) {
      return null;
    }

    const tasksWithCountedPages = new ShortTaskWithCountedPages();
    Object.assign(tasksWithCountedPages, obj);
    tasksWithCountedPages.tasks = obj.tasks.map(obj => ShortTask.convertToObj(obj));

    return tasksWithCountedPages;
  }
}
