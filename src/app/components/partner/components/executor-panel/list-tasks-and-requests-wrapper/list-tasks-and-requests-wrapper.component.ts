import { ExecutorPanelComponent } from './../executor-panel.component';
import { ListTasksComponent } from 'src/app/components/partner/components/common/list-tasks/list-tasks.component';
import { Component, OnInit, HostListener, Input } from '@angular/core';
import { TaskComponentMode } from 'src/app/components/shared-module/tasks/task/taskComponentMode';
import { FilterStatusCommonType } from 'src/app/models/task/filterStatusCommonType';
import { ShortTask } from 'src/app/models/task/shortTask';
import { AuthService } from 'src/app/auth/auth.service';
import { PartnerService } from '../../../service/partner.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UrlResolver } from '../../../common/urlResolver';
import { ActiveUrls } from 'src/app/auth/activeUrls';
import { ShortTaskRequest } from 'src/app/models/task/shortTaskRequest';
import { FilterStatusRequest } from 'src/app/models/task/filterStatusRequest';
import { PageableParams } from 'src/app/models/pageable/PageableParams';

@Component({
  selector: 'app-list-tasks-and-requests-wrapper',
  templateUrl: './list-tasks-and-requests-wrapper.component.html',
  styleUrls: ['./list-tasks-and-requests-wrapper.component.css']
})
export class ListTasksAndRequestsWrapperComponent implements OnInit {
  listTasksComp: ListTasksComponent;
  executorPanel: ExecutorPanelComponent;

  isLoaded: boolean;
  taskMode: TaskComponentMode;
  filterStatusCommonType: FilterStatusCommonType;
  taskInfos: ShortTask[];

  taskShortRequestInfos: ShortTaskRequest[];
  requestStatus: FilterStatusRequest;

  pageable: PageableParams;
  isLoadAll: boolean;
  currentUrl: string;

  activeButton: boolean;


  constructor(private authService: AuthService,
    private service: PartnerService,
    public route: ActivatedRoute,
    public router: Router) {
      this.taskInfos = [];
      this.taskShortRequestInfos = [];
      this.pageable = new PageableParams();
      this.isLoadAll = false;
      this.isLoaded = false;
      this.requestStatus = FilterStatusRequest.ALL;
      this.filterStatusCommonType = FilterStatusCommonType.ALL;
     }

  ngOnInit() {
    setTimeout(() => {
      // @ts-ignore
      document.querySelector(`.mode-tasks-area .${this.currentUrl}`).checked = true;
    }, 20)
  }

  get isMobileMode() {
    return this.authService.isMobileMode();
  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = !this.isMobileMode ? document.documentElement.scrollHeight - 1 : document.documentElement.scrollHeight - 60;
    if(pos >= max && !this.isLoadAll && (this.pageable.size<=this.taskInfos.length || this.pageable.size<=this.taskShortRequestInfos.length)) {
      this.handleLoadMore();
    }
  }

  onRouterOutletActivate(event) {
    const url = UrlResolver.getMainSectionFromUrl(this.router.url);
    this.currentUrl = url;

    this.activeButton = !Boolean(Number(this.router.url.split("/").pop()));

    if(event instanceof ListTasksComponent) {
      this.listTasksComp = event;
      this.listTasksComp.eventFilter.subscribe(data => {
        this.handleEventTaskFilter(data);
      });
      if(this.currentUrl == ActiveUrls.PARTNER_MY_TASKS) {
        this.setToPartnerRequstsMode();
      } else {
        this.setPerformerMode();
      }
    }
    else {
      this.listTasksComp = null;
    }

    if(event instanceof ExecutorPanelComponent) {
      this.executorPanel = event;
      this.executorPanel.eventFilter.subscribe(data => {
        this.handleEventPanelFilter(data);
      });
      this.setCommonMode();
    } else {
      this.executorPanel = null;
    }
  }

  handleLoadMore() {
    this.pageable.page++;
    if(this.taskMode == TaskComponentMode.PERFORMER) {
      this.service.getAllPartnerTaskRequest(this.filterStatusCommonType, this.pageable).subscribe((data: ShortTask[]) => {
        data.forEach(el => {
          this.taskInfos.push(el);
        });
        if(data.length < this.pageable.size) {
          this.isLoadAll = true;
        }
      });
    }
    else if (this.taskMode == TaskComponentMode.PARTNER){
      this.pageable.page++;
      this.service.getMyShortInfoTasks(this.filterStatusCommonType, this.pageable).subscribe((data: ShortTask[]) => {
        data.forEach(el => {
          this.taskInfos.push(el);
        })
        if(data.length < this.pageable.size) {
          this.isLoadAll = true;
        }
      });
    } else {
      this.service.getMyPerformShortInfoTasks(this.requestStatus, this.pageable).subscribe((data: ShortTaskRequest[]) => {
        data.forEach(el => {
          this.taskShortRequestInfos.push(el);
        })
        if(data.length < this.pageable.size) {
          this.isLoadAll = true;
        }
      });
    }
  }

  handleEventPanelFilter(filterStatusRequest: FilterStatusRequest) {
    this.requestStatus = filterStatusRequest;
    this.pageable = new PageableParams();
    this.isLoadAll = false;
    this.setCommonMode();
  }

  handleEventTaskFilter(filterStatusCommonType: FilterStatusCommonType) {
    this.filterStatusCommonType = filterStatusCommonType;
    if(this.taskMode == TaskComponentMode.PARTNER) {
      this.pageable = new PageableParams();
      this.isLoadAll = false;
      this.setToPartnerRequstsMode();
    } else if(this.taskMode == TaskComponentMode.PERFORMER) {
      this.pageable = new PageableParams();
      this.isLoadAll = false;
      this.setPerformerMode();
    }
  }

  setPerformerMode() {
    this.taskMode = TaskComponentMode.PERFORMER;
    this.listTasksComp.mode = this.taskMode;
    this.listTasksComp.status = this.filterStatusCommonType;
    this.service.getAllPartnerTaskRequest(this.filterStatusCommonType, this.pageable).subscribe((data: ShortTask[]) =>{
      this.taskInfos = ShortTask.sortByDateDesc(data);
      this.listTasksComp.taskInfos = this.taskInfos;
      this.isLoaded = true;
      this.listTasksComp.isLoaded = this.isLoaded;
    });
  }

  setToPartnerRequstsMode() {
    this.taskMode = TaskComponentMode.PARTNER;
    this.listTasksComp.mode = this.taskMode;
    this.listTasksComp.status = this.filterStatusCommonType;
    this.service.getMyShortInfoTasks(this.filterStatusCommonType, this.pageable).subscribe((data: ShortTask[]) => {
      this.taskInfos = ShortTask.sortByDateDesc(data);
      this.listTasksComp.taskInfos = this.taskInfos;
      this.isLoaded = true;
      this.listTasksComp.isLoaded = this.isLoaded;
    });
  }

  setCommonMode() {
    this.taskMode = TaskComponentMode.COMMON;
    if(this.isPerformerUser()){
      this.service.getMyPerformShortInfoTasks(this.requestStatus, this.pageable).subscribe((data: ShortTaskRequest[]) => {
        this.taskShortRequestInfos = ShortTaskRequest.sortById(data);
        this.executorPanel.taskShortRequestInfos = this.taskShortRequestInfos;
        this.executorPanel.status = this.requestStatus;
      });
    }
  }

  switchToPerformerMode() {
    if(this.currentUrl != ActiveUrls.EXECUTOR_TASKS) {
      this.router.navigate([`/user/${this.authService.getCurrentId}/${ActiveUrls.EXECUTOR_TASKS}`]);
    }
  }

  switchToPartnerRequstsMode() {
    if(this.currentUrl != ActiveUrls.PARTNER_MY_TASKS) {
      this.router.navigate([`/user/${this.authService.getCurrentId}/${ActiveUrls.PARTNER_MY_TASKS}`]);
    }
  }

  switchToCommonMode() {
    if(this.currentUrl != ActiveUrls.PARTNER_EXECUTOR_PANEL) {
      this.router.navigate([`/user/${this.authService.getCurrentId}/${ActiveUrls.PARTNER_EXECUTOR_PANEL}`]);
    }
  }

  isPerformerMode(): boolean {
    return this.taskMode == TaskComponentMode.PERFORMER;
  }

  isPartnerMode(): boolean {
    return this.taskMode == TaskComponentMode.PARTNER;
  }

  isCommonMode(): boolean {
    return this.taskMode == TaskComponentMode.COMMON;
  }

  isPerformerUser(): boolean {
    return this.authService.isPerformer();
  }

  getTaskMode(): TaskComponentMode {
    return this.taskMode;
  }

}
