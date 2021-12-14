import { AuthService } from 'src/app/auth/auth.service';
import { FilterStatusCommonType } from '../../../../../models/task/filterStatusCommonType';
import { TaskComponentMode } from '../../../../shared-module/tasks/task/taskComponentMode';
import { ShortTask } from '../../../../../models/task/shortTask';
import { PartnerService } from '../../../service/partner.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { PageableParams } from 'src/app/models/pageable/PageableParams';

@Component({
  selector: 'app-list-tasks-wrapper',
  templateUrl: './list-tasks-wrapper.component.html',
  styleUrls: ['./list-tasks-wrapper.component.css']
})
export class ListTasksWrapperComponent implements OnInit {
  isLoaded: boolean;
  taskInfos: ShortTask[];
  taskMode: TaskComponentMode;
  filterStatusCommonType: FilterStatusCommonType;
  pageable: PageableParams;
  isLoadAll: boolean;

  currentUrl: string;

  constructor(private service: PartnerService,
    private authService: AuthService
  ) {
    this.isLoaded = false;
    this.isLoadAll = false;
    this.pageable = new PageableParams();
    this.filterStatusCommonType = FilterStatusCommonType.ALL;
  }

  ngOnInit() {
    this.setPartnerMode();
  }

  get isMobileMode() {
    return this.authService.isMobileMode();
  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = !this.isMobileMode ? document.documentElement.scrollHeight - 1 : document.documentElement.scrollHeight - 60;
    if(pos >= max && !this.isLoadAll) {
      this.handleLoadMore();
    }
  }

  handleLoadMore() {
    if(this.taskMode == TaskComponentMode.PARTNER) {
      this.pageable.page++;
      this.service.getMyShortInfoTasks(this.filterStatusCommonType, this.pageable).subscribe((data: ShortTask[]) => {
        data.forEach(el => {
          this.taskInfos.push(el);
        })
        if(data.length < this.pageable.size) {
          this.isLoadAll = true;
        }
      });
    }
  }

  handleEventFilter(filterStatusCommonType: FilterStatusCommonType) {
    this.filterStatusCommonType = filterStatusCommonType;
    if(this.taskMode == TaskComponentMode.PARTNER) {
      this.pageable = new PageableParams();
      this.isLoadAll = false;
      this.setPartnerMode();
    }
  }

  setPartnerMode() {
    this.taskMode = TaskComponentMode.PARTNER;
    this.service.getMyShortInfoTasks(this.filterStatusCommonType, this.pageable).subscribe((data: ShortTask[]) => {
      this.taskInfos = ShortTask.sortByDateDesc(data);
      this.isLoaded = true;
    });
  }

  getTaskMode(): TaskComponentMode {
    return this.taskMode;
  }
}
