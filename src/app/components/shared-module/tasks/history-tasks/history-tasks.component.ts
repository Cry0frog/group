import { CommonService } from 'src/app/common/services/common.service';
import { ShortTask } from 'src/app/models/task/shortTask';
import { FilterTask } from 'src/app/models/filter/filterTask';
import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SortTask } from 'src/app/models/task/sortTask';
import { SortType } from 'src/app/models/common/sortType';
import { TaskComponentMode } from '../task/taskComponentMode';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-history-tasks',
  templateUrl: './history-tasks.component.html',
  styleUrls: ['./history-tasks.component.css']
})
export class HistoryTasksComponent implements OnInit {
  tasks: ShortTask[];
  isLoadAll: boolean;

  constructor(public dialogRef: MatDialogRef<HistoryTasksComponent>,
    private authService: AuthService,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: FilterTask) {
      this.tasks = [];
  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    let max = event.target.scrollHeight;
    let pos = !this.isMobileMode ? event.target.offsetHeight + event.target.scrollTop + 1 : event.target.offsetHeight + event.target.scrollTop + 100;
    if(pos >= max && !this.isLoadAll) {
      this.handleLoadMoreTasks();
    }
  }

  handleLoadMoreTasks() {
    this.data.pageable.page++;
    this.commonService.getAllShortInfoTasksByHistoryTasks(this.data).subscribe((data: ShortTask[]) => {
      if(data.length == 0) {
        this.isLoadAll = true;
        return;
      }

      data = this.applyFilter(data);
      this.tasks = this.tasks.concat(data);
    });
  }

  get isMobileMode() {
    return this.authService.isMobileMode();
  }

  ngOnInit() {
    this.data.pageable.page = 0;
    this.commonService.getAllShortInfoTasksByHistoryTasks(this.data).subscribe((listTasks: ShortTask[]) => {
      this.tasks = this.applyFilter(listTasks);
    })
  }

  applyFilter(data): ShortTask[] {
    if(this.data.nameSort == SortTask.DATE && this.data.sortType == SortType.DECK) {
      return ShortTask.sortByDateDesc(data);
    }
    else if(this.data.nameSort == SortTask.DATE && this.data.sortType == SortType.ASK) {
      return ShortTask.sortByDateAsc(data);
    }
    else if(this.data.nameSort == SortTask.PRICE && this.data.sortType == SortType.DECK) {
      return ShortTask.sortByMoneyTopBorderdDesc(data);
    }
    else if(this.data.nameSort == SortTask.PRICE && this.data.sortType == SortType.ASK) {
      return ShortTask.sortByMoneyTopBorderdAsc(data);
    }
  }

  getTaskMode() {
    return TaskComponentMode.COMMON_OFFERING;
  }
}
