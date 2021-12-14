import { SortParams } from 'src/app/models/sort/sortParams';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ShortTask } from 'src/app/models/task/shortTask';
import { AdminService } from '../../service/admin.service';
import { Router } from '@angular/router';
import { FilterStatusCommonType } from 'src/app/models/task/filterStatusCommonType';
import { DeleteTaskComponent } from './delete-task/delete-task.component';
import { ActiveUrls } from '../../../../auth/activeUrls';
import { TASK_STATUS_TRANSLATE } from '../../../../common/task.description';
import { BaseLazyLoadingService } from 'src/app/services/base-lazy-loading.service';
import { ShortTaskWithCountedPages } from 'src/app/models/task/shortTasksWithCountedPages';
import { PageableParams } from 'src/app/models/pageable/PageableParams';

@Component({
  selector: 'app-view-tasks',
  templateUrl: './view-tasks.component.html',
  styleUrls: ['./view-tasks.component.css']
})
export class ViewTasksComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'status', 'createdAt', 'dateTransitionProcessing', 'operations'];
  dataSource: MatTableDataSource<ShortTask>;
  shortTasks: ShortTask[];
  filterStatusCommonType: FilterStatusCommonType;
  shortTasksWithCountedPages: ShortTaskWithCountedPages;

  taskStatusTranslate = TASK_STATUS_TRANSLATE;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private adminService: AdminService,
    private router: Router,
    public dialog: MatDialog,
    private baseLazyLoadingService: BaseLazyLoadingService
  ) {
    this.shortTasks = [];
    this.shortTasksWithCountedPages = new ShortTaskWithCountedPages();
    this.filterStatusCommonType = FilterStatusCommonType.ALL;
  }

  ngOnInit() {
    this.loadAllShortTasks();
  }

  linkToTask(id) {
    this.router.navigateByUrl(`${ActiveUrls.FIND_TASK}/${id}`);
  }

  applyFilter(filterValue: string) {
    filterValue === "" ? this.shortTasksWithCountedPages.search = null : this.shortTasksWithCountedPages.search = filterValue;
    this.shortTasksWithCountedPages.search = filterValue;
    this.defaultSortAndPage();
    this.loadAllShortTasks();
  }

  sortChange(event) {
    this.shortTasksWithCountedPages.sortParams = this.baseLazyLoadingService.sortChange(event, this.shortTasksWithCountedPages.sortParams);
    this.shortTasksWithCountedPages.pageableParams = new PageableParams();
    this.loadAllShortTasks();
  }

  public handlePage(event: any) {
    this.shortTasksWithCountedPages.pageableParams = this.baseLazyLoadingService.handlePage(event, this.shortTasksWithCountedPages.pageableParams);
    this.loadAllShortTasks();
  }

  loadAllShortTasks() {
    this.adminService.getAllShortTasks( this.shortTasksWithCountedPages, this.filterStatusCommonType).subscribe((data: ShortTaskWithCountedPages) => {
      if(data != null) {
        this.shortTasks = data.tasks;
        this.shortTasksWithCountedPages.pageableParams.countedPages = data.pageableParams.countedPages;
        this.dataSource = new MatTableDataSource(this.shortTasks);
        //this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  defaultSortAndPage() {
    this.shortTasksWithCountedPages.pageableParams = new PageableParams();
    this.shortTasksWithCountedPages.sortParams = new SortParams();
  }

  deleteTask(task) {
    const dialogRef = this.dialog.open(DeleteTaskComponent, {
      width: '550px',
      data: task
    });
    dialogRef.afterClosed().subscribe((task: ShortTask) => {
      if(task != null) {
        this.adminService.deleteTask(task.id, task.message).subscribe(el => {
          this.loadAllShortTasks();
        });
      }
    });
  }

  isAllStatus(): boolean {
    return this.filterStatusCommonType == FilterStatusCommonType.ALL;
  }

  isFinishedStatus(): boolean {
    return this.filterStatusCommonType == FilterStatusCommonType.FINISHED;
  }

  isInProgressStatus(): boolean {
    return this.filterStatusCommonType == FilterStatusCommonType.IN_PROGRESS;
  }

  isHideStatus(): boolean {
    return this.filterStatusCommonType == FilterStatusCommonType.HIDE;
  }

  isTroubleStatus(): boolean {
    return this.filterStatusCommonType == FilterStatusCommonType.TROUBLE;
  }

  filterAll() {
    this.filterStatusCommonType = FilterStatusCommonType.ALL;
    this.defaultSortAndPage();
    this.loadAllShortTasks();
  }

  filterFinished() {
    this.filterStatusCommonType = FilterStatusCommonType.FINISHED;
    this.defaultSortAndPage();
    this.loadAllShortTasks();
  }

  filterInProgress() {
    this.filterStatusCommonType = FilterStatusCommonType.IN_PROGRESS;
    this.defaultSortAndPage();
    this.loadAllShortTasks();
  }

  filterHide() {
    this.filterStatusCommonType = FilterStatusCommonType.HIDE;
    this.defaultSortAndPage();
    this.loadAllShortTasks();
  }

  filterTrouble() {
    this.filterStatusCommonType = FilterStatusCommonType.TROUBLE;
    this.defaultSortAndPage();
    this.loadAllShortTasks();
  }

}
