import { PlannedTask } from './plannedTask';
import { LazyLoadingModel } from './../lazyLoading/lazyLoadingModel';

export class DevelopmentTasksWithCountedPages extends LazyLoadingModel {
  constructor() {
    super();
    this.tasks = [];
  }

  tasks: PlannedTask[];

  public static convertToObj(obj): DevelopmentTasksWithCountedPages {
    if(obj == null) {
      return null;
    }

    const plannedTasksWithCountedPages = new DevelopmentTasksWithCountedPages();
    Object.assign(plannedTasksWithCountedPages, obj);
    plannedTasksWithCountedPages.tasks = obj.tasks.map(obj => PlannedTask.convertToObj(obj));

    return plannedTasksWithCountedPages;
  }
}
