import { DevelopmentTasksWithCountedPages } from './../../../../../models/development/developmentTasksWithCountedPages';
import { STATUS_PLANNED_TASK_CLASS } from './../../../common/admin.descriptions';
import { CreateDevelompentTaskComponent } from './create-develompent-task/create-develompent-task.component';
import { PlannedTask } from './../../../../../models/development/plannedTask';
import { DevelopmentService } from './../../../service/development.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { StatusPlannedTask } from 'src/app/models/development/statusPlannedTask';
import { FilterTaskStatus, FILTER_TASK_STATUS_ALL } from './filterTaskStatus';
import { PageableParams } from 'src/app/models/pageable/PageableParams';
import { SortParams } from 'src/app/models/sort/sortParams';
import { BaseLazyLoadingService } from 'src/app/services/base-lazy-loading.service';

@Component({
  selector: 'app-fake-tasks',
  templateUrl: './fake-tasks.component.html',
  styleUrls: ['./fake-tasks.component.css']
})
export class FakeTasksComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'status', 'nextActionTime', 'operations'];
  dataSource: MatTableDataSource<PlannedTask>;
  plannedTasks: PlannedTask[];
  choosenStatusFilters: StatusPlannedTask[];

  fakeTaskWithCountedPages: DevelopmentTasksWithCountedPages;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  choosenFilter: FilterTaskStatus;

  constructor(private devService: DevelopmentService,
    private baseLazyLoadingService: BaseLazyLoadingService,
    public dialog: MatDialog
  ) {
    this.fakeTaskWithCountedPages = new DevelopmentTasksWithCountedPages();
    this.plannedTasks = [];
    this.choosenStatusFilters = [];
    this.choosenFilter = FilterTaskStatus.ALL;
  }

  ngOnInit() {
    this.loadAllPlannedTasks();
  }

  applyFilter(filterValue: string) {
    filterValue === "" ? this.fakeTaskWithCountedPages.search = null : this.fakeTaskWithCountedPages.search = filterValue;
    this.fakeTaskWithCountedPages.search = filterValue;
    this.defaultSortAndPage();
    this.loadAllPlannedTasks();
  }

  sortChange(event) {
    this.fakeTaskWithCountedPages.sortParams = this.baseLazyLoadingService.sortChange(event, this.fakeTaskWithCountedPages.sortParams);
    this.fakeTaskWithCountedPages.pageableParams = new PageableParams();
    this.loadAllPlannedTasks();
  }

  public handlePage(event: any) {
    this.fakeTaskWithCountedPages.pageableParams = this.baseLazyLoadingService.handlePage(event, this.fakeTaskWithCountedPages.pageableParams);
    this.loadAllPlannedTasks();
  }

  defaultSortAndPage() {
    this.fakeTaskWithCountedPages.pageableParams = new PageableParams();
    this.fakeTaskWithCountedPages.sortParams = new SortParams();
  }

  filterAll() {
    this.choosenFilter = FilterTaskStatus.ALL;
    this.defaultSortAndPage();
    this.loadAllPlannedTasks();
  }

  filterNotReady() {
    this.choosenFilter = FilterTaskStatus.NOT_READY;
    this.defaultSortAndPage();
    this.loadAllPlannedTasks();
  }

  filterInProgress() {
    this.choosenFilter = FilterTaskStatus.IN_PROGRESS;
    this.defaultSortAndPage();
    this.loadAllPlannedTasks();
  }

  filterSuccess() {
    this.choosenFilter = FilterTaskStatus.SUCCESS;
    this.defaultSortAndPage();
    this.loadAllPlannedTasks();
  }

  filterError() {
    this.choosenFilter = FilterTaskStatus.ERROR;
    this.defaultSortAndPage();
    this.loadAllPlannedTasks();
  }

  isAllStatus(): boolean {
    return this.choosenFilter == FilterTaskStatus.ALL;
  }

  isInProgress(): boolean {
    return this.choosenFilter == FilterTaskStatus.IN_PROGRESS;
  }

  isNotReady(): boolean {
    return this.choosenFilter == FilterTaskStatus.NOT_READY;
  }

  isSuccess(): boolean {
    return this.choosenFilter == FilterTaskStatus.SUCCESS;
  }

  isError(): boolean {
    return this.choosenFilter == FilterTaskStatus.SUCCESS;
  }

  loadAllPlannedTasks() {
    this.devService.getAllPlannedTasks(this.fakeTaskWithCountedPages, this.choosenFilter).subscribe((data: DevelopmentTasksWithCountedPages) => {
      //if(this.choosenFilter == FilterTaskStatus.ALL) {
      //  this.plannedTasks = data.tasks;
      //}
      //else {
      //  this.plannedTasks = data.tasks.filter(el =>
      //    FILTER_TASK_STATUS_ALL[this.choosenFilter].includes(el.status)
      //  );
      //}

      this.plannedTasks = data.tasks;

      this.fakeTaskWithCountedPages.pageableParams.countedPages = data.pageableParams.countedPages;
      this.dataSource = new MatTableDataSource(this.plannedTasks);
      this.dataSource.sort = this.sort;
    });
  }

  createBasedOnTask(task: PlannedTask) {
    this.devService.getTaskWithPropertyByTaskId(task.id).subscribe((data: PlannedTask) => {
      if(data != null) {
        this.openDialogCreateBasedOnTask(data);
      }
    });
  }

  openDialogCreateBasedOnTask(task: PlannedTask) {
    const dialogRef = this.dialog.open(CreateDevelompentTaskComponent, {
      width: '1000px',
      disableClose: true,
      data: task
    });
    dialogRef.afterClosed().subscribe((plannedTask: PlannedTask) => {
      if(plannedTask != null) {
        this.devService.addPlannedTask(plannedTask).subscribe(el => {
          this.loadAllPlannedTasks();
        });
      }
    });
  }

  addPlannedTask() {
    const dialogRef = this.dialog.open(CreateDevelompentTaskComponent, {
      width: '1000px',
      disableClose: true,
      data: new PlannedTask()
    });
    dialogRef.afterClosed().subscribe((plannedTask: PlannedTask) => {
      if(plannedTask != null) {
        this.devService.addPlannedTask(plannedTask).subscribe(el => {
          this.loadAllPlannedTasks();
        });
      }
    });
  }

  getStatusColorClass(row: PlannedTask): string {
    return STATUS_PLANNED_TASK_CLASS[row.status];
  }

  deletePlannedTask(row: PlannedTask) {
    this.devService.deletePlannedTask(row.id).subscribe(_ => {
      this.loadAllPlannedTasks();
    })
  }

}
