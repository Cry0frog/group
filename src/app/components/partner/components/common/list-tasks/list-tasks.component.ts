import { ActiveUrls } from 'src/app/auth/activeUrls';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { FilterStatusCommonType } from './../../../../../models/task/filterStatusCommonType';
import { TaskComponentMode } from '../../../../shared-module/tasks/task/taskComponentMode';
import { TASK_STATUS_TRANSLATE } from '../../../../../common/task.description';
import { ShortTask } from '../../../../../models/task/shortTask';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UrlResolver } from '../../../common/urlResolver';

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.css']
})
export class ListTasksComponent implements OnInit {
  @Input() isLoaded: boolean;
  @Input() taskInfos: ShortTask[];
  @Input() mode: TaskComponentMode;
  @Input() status: FilterStatusCommonType;
  @Output() eventChooseTask = new EventEmitter<ShortTask>();
  @Output() taskSelectionEvent = new EventEmitter<string>();

  @Output() eventFilter = new EventEmitter<FilterStatusCommonType>();

  taskStatusTranslates = TASK_STATUS_TRANSLATE;
  taskComponentMode = TaskComponentMode;
  partnerId: number;

  currentUrl: string;

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.currentUrl = UrlResolver.getMainSectionFromUrl(this.router.url);
    this.partnerId = this.authService.getCurrentId;
  }

  addLoadedMoreShortTasks(loadedMore: ShortTask[], maxLoadedSize: number) {
    this.taskInfos = this.taskInfos.concat(loadedMore);
  }

  isInfosNotEmpty(): boolean {
    return this.taskInfos != null && this.taskInfos.length != 0;
  }

  isNotCommon(): boolean {
    return this.mode != TaskComponentMode.COMMON
      && this.mode != TaskComponentMode.COMMON_OFFERING;
  }

  isNotCommonOffering(): boolean {
    return this.mode != TaskComponentMode.COMMON_OFFERING;
  }

  isShowYourTask(shortTask: ShortTask): boolean {
    return this.mode == TaskComponentMode.COMMON
      && this.partnerId == shortTask.creatorId;
  }

  isAllStatus(): boolean {
    return this.status == FilterStatusCommonType.ALL;
  }

  isFinishedStatus(): boolean {
    return this.status == FilterStatusCommonType.FINISHED;
  }

  isInProgressStatus(): boolean {
    return this.status == FilterStatusCommonType.IN_PROGRESS;
  }

  isHideStatus(): boolean {
    return this.status == FilterStatusCommonType.HIDE;
  }

  isTroubleStatus(): boolean {
    return this.status == FilterStatusCommonType.TROUBLE;
  }

  filterAll() {
    this.status = FilterStatusCommonType.ALL;
    this.eventFilter.emit(FilterStatusCommonType.ALL);
  }

  filterFinished() {
    this.status = FilterStatusCommonType.FINISHED;
    this.eventFilter.emit(FilterStatusCommonType.FINISHED);
  }

  filterInProgress() {
    this.status = FilterStatusCommonType.IN_PROGRESS;
    this.eventFilter.emit(FilterStatusCommonType.IN_PROGRESS);
  }

  filterHide() {
    this.status = FilterStatusCommonType.HIDE;
    this.eventFilter.emit(FilterStatusCommonType.HIDE);
  }

  filterTrouble() {
    this.status = FilterStatusCommonType.TROUBLE;
    this.eventFilter.emit(FilterStatusCommonType.TROUBLE);
  }

  chooseOrOpenTask(shortTask: ShortTask) {
    if(!this.isNotCommonOffering()) {
      this.chooseTask(shortTask);
    }
    else {
      this.openTask(shortTask, this.currentUrl);
    }
  }

  chooseTask(shortTask: ShortTask) {
    this.eventChooseTask.emit(shortTask);
  }

  openTask(shortTask: ShortTask, currentUrl) {
    let url = "";
    if(currentUrl == ActiveUrls.PARTNER_MY_TASKS) {
      url = this.router.serializeUrl(this.router.createUrlTree([`user/${this.authService.getCurrentId}/my-tasks/${shortTask.id}`]));
    }
    else if(currentUrl == ActiveUrls.PARTNER_EXECUTOR_PANEL) {
      url = this.router.serializeUrl(this.router.createUrlTree([`user/${this.authService.getCurrentId}/executor-panel/${shortTask.id}`]));
    }
    else if(currentUrl == ActiveUrls.EXECUTOR_TASKS) {
      url = this.router.serializeUrl(this.router.createUrlTree([`user/${this.authService.getCurrentId}/executor-tasks/${shortTask.id}`]));
    }
    else {
      if(shortTask.performerId != null) {
        if(this.authService.getUserId == shortTask.performerId) {
          return this.openTask(shortTask, ActiveUrls.EXECUTOR_TASKS);
        }
        else if(this.authService.getUserId == shortTask.creatorId) {
          return this.openTask(shortTask, ActiveUrls.PARTNER_MY_TASKS);
        }
      }
      else {
        this.taskSelectionEvent.emit(shortTask.name);
        url = this.router.serializeUrl(this.router.createUrlTree([`find_task/${shortTask.id}`]));
      }
    }
    window.open(url, '_blank');
  }

}
