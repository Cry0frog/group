import { Category } from './../../../../models/category/category';
import { Task } from './../../../../models/task/task';
import { SessionStorageService } from 'angular-web-storage';
import { PartnerService } from './../../../partner/service/partner.service';
import { CreateTaskContentComponent } from './../create-task-content/create-task-content.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/common/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.css']
})
export class UpdateTaskComponent implements OnInit {
  taskId: number;
  task: Task;
  categories: Category[];
  currentUrl: string;

  @ViewChild(CreateTaskContentComponent, {static: false}) createTaskContent: CreateTaskContentComponent;

  constructor(private partnerService: PartnerService,
    private sessionStorage: SessionStorageService,
    private commonService: CommonService,
    public route: ActivatedRoute,
    private location: Location,
    public router: Router)
    {
      this.categories = [];
      this.task = new Task();
    }

  ngOnInit() {
    //this.currentUrl= UrlResolver.getMainSectionFromUrl(this.router.url);
    this.taskId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.getAllCategories();
    this.loadTaskInfo();
  }

  loadTaskInfo() {
    this.commonService.getTaskInfo(this.taskId).subscribe((data: Task) => {
      this.task = data;
    });
  }

  handleUpdateTaskError(error: any) {
    this.task.isError = true;
    this.task.errors = error.errors;
  }

  back() {
    this.location.back();
  }

  getAllCategories() {
    this.commonService.getAllCategories().subscribe((data: Category[]) => {
      this.categories = data;
      setTimeout(() => {
        this.createTaskContent.applyTask();
      }, 100);
    });
  }

  updateTask() {
    this.task = this.createTaskContent.task;
    this.task.city = this.createTaskContent.selectedCity;
    this.task.id = this.taskId;

    this.task.isError = false;
    this.partnerService.editTask(this.task).subscribe((responce: any) => {
      if(responce == null) {
        return;
      }

      if(responce.ok != null && responce.ok == false) {
        this.handleUpdateTaskError(responce.error);
        return;
      }

      this.sessionStorage.remove('update_content__saved_task');
      this.task = responce;

      if(this.task.images.length != 0) {
        this.task.images.forEach(image => this.partnerService.updatePartnerImage(image.croppedImg.file, this.task.creatorId, this.task.id, image).subscribe(el => {
          if(this.task.images[this.task.images.length - 1].order == image.order) {
            this.back();
          }
        }));
      }
      else {
        this.back();
      }
    });
  }

}
