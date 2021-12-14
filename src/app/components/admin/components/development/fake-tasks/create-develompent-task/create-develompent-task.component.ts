import { Task } from 'src/app/models/task/task';
import { MapTaskProperty } from './../../../../../../models/task/properties/map/mapTaskProperty';
import { BaseTaskProperty } from './../../../../../../models/task/properties/baseTaskProperty';
import { Offset } from 'src/app/common/offset';
import { PlannedPartnerAction } from './../../../../../../models/development/plannedPartnerAction';
import { DevPartnerAssignComponent } from './dev-partner-assign/dev-partner-assign.component';
import { DevelopmentPartner } from './../../../../../../models/development/developmentPartner';
import { DevelopmentService } from './../../../../service/development.service';
import { CreateTaskContentComponent } from './../../../../../shared-module/tasks/create-task-content/create-task-content.component';
import { CommonService } from './../../../../../../common/services/common.service';
import { Category } from './../../../../../../models/category/category';
import { PlannedTask } from './../../../../../../models/development/plannedTask';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatStepper } from '@angular/material';
import { DateTimeStr } from 'src/app/models/common/dateTimeStr';

@Component({
  selector: 'app-create-develompent-task',
  templateUrl: './create-develompent-task.component.html',
  styleUrls: ['./create-develompent-task.component.css']
})
export class CreateDevelompentTaskComponent implements OnInit {
  @ViewChild(CreateTaskContentComponent, {static: false}) createTaskContent: CreateTaskContentComponent;
  @ViewChild(DevPartnerAssignComponent, {static: false}) devPartnerAssignComponent: DevPartnerAssignComponent;
  @ViewChild(MatStepper, {static: false}) stepper: MatStepper;

  categories: Category[];
  developmentPartners: DevelopmentPartner[];

  constructor(public dialogRef: MatDialogRef<CreateDevelompentTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PlannedTask,
    private commonService: CommonService,
    private devService: DevelopmentService
  ) {
    this.categories = [];
    this.developmentPartners = [];
  }

  ngOnInit() {
    this.getDevelopmentPartners();
    this.getAllCategories();
  }

  getDevelopmentPartners() {
    this.devService.getAllDevelopmentPartners().subscribe((data: DevelopmentPartner[]) => {
      this.developmentPartners = data;

      this.developmentPartners.forEach(el => {
        el.strActionTime_date = new Date();
        el.strActionTime_time = el.strActionTime_date;
      });
    })
  }

  addDevelopmentPartners() {
    this.data.id = null;
    this.data.refTask.id = null;
    this.data.refTask.createdAt = null;
    this.data.refTask.finishedAt = null;
    this.data.refTask.properties.forEach((el: BaseTaskProperty) => {
      el.id = null;
    });

    const mapTaskProp: MapTaskProperty = this.data.refTask.getMapTaskProperty();
    if(mapTaskProp != null) {
      if(mapTaskProp.points != null) {
        mapTaskProp.points.forEach(el => {
          el.id = null;
        });
      }
    }

    this.data.refTask.prepareBeforeSave();
    this.dialogRef.close(this.data);
  }

  getAllCategories() {
    this.commonService.getAllCategories().subscribe((data: Category[]) => {
      this.categories = data;
      setTimeout(() => {
        this.createTaskContent.applyTask();
      }, 100);
    });
  }

  applyTask() {
    this.data.refTask = this.createTaskContent.task;
    this.data.refTask.city = this.createTaskContent.selectedCity;

    if(this.data.id != null) {
      this.devPartnerAssignComponent.timeToSelectingPerformer = DateTimeStr.createBasedOnCurDateAndTime(this.data.timeToSelectingPerformer);
      this.devPartnerAssignComponent.timeTaskToInProgress = DateTimeStr.createBasedOnCurDateAndTime(this.data.timeTaskToInProgress);
      this.devPartnerAssignComponent.timeToFinishingTask = DateTimeStr.createBasedOnCurDateAndTime(this.data.timeToFinishingTask);

      const filters = this.devPartnerAssignComponent.developmentPartners
        .filter(el => this.data.plannedCreator.partnerId == el.id);

      this.devPartnerAssignComponent.choosenPartner = filters.length == 0
        ? null : filters[0];

      const filterRequesterIds = this.data.plannedRequesters.map(el => el.partnerId);
      this.devPartnerAssignComponent.choosenRequesters = this.devPartnerAssignComponent.developmentPartners
        .filter(el => filterRequesterIds.includes(el.id));

    }
    this.stepper.next();
  }

  applyDevPartner() {
    this.data.plannedCreator = PlannedPartnerAction
      .convertFromDevPartner(this.devPartnerAssignComponent.choosenPartner);

    this.data.plannedRequesters = this.devPartnerAssignComponent.choosenRequesters
      .map(el => PlannedPartnerAction.convertFromDevPartner(el));

    this.data.timeToSelectingPerformer = this.devPartnerAssignComponent
      .timeToSelectingPerformer.getPreparedTime();

    this.data.timeTaskToInProgress = this.devPartnerAssignComponent
      .timeTaskToInProgress.getPreparedTime();

    this.data.timeToFinishingTask = this.devPartnerAssignComponent
      .timeToFinishingTask.getPreparedTime();

    this.stepper.next();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
