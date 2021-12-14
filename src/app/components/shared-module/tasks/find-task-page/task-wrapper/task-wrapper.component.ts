import { TaskComponent } from './../../task/task.component';
import { TaskRequest } from './../../../../../models/task/taskRequest';
import { RequestNotEnoughMoneyComponent } from './request-not-enough-money/request-not-enough-money.component';
import { MatDialog } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';
import { ActiveUrls } from './../../../../../auth/activeUrls';
import { CommonService } from '../../../../../common/services/common.service';
import { Task } from '../../../../../models/task/task';
import { TaskComponentMode } from '../../task/taskComponentMode';
import { Component, OnInit, AfterViewInit, ViewChild, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskRequestStatus } from 'src/app/models/task/taskRequestStatus';
import { SessionStorageService } from 'angular-web-storage';
import { ROLE } from 'src/app/auth/role';
import { CommonDialogNotificationComponent } from '../../../common/common-dialog-notification/common-dialog-notification.component';

@Component({
  selector: 'app-task-wrapper',
  templateUrl: './task-wrapper.component.html',
  styleUrls: ['./task-wrapper.component.css']
})
export class TaskWrapperComponent implements OnInit, AfterViewInit {
  @ViewChild(TaskComponent, {static: false}) taskComponent: TaskComponent;
  taskId: number;
  task: Task;
  requests: TaskRequest[];
  newRequest: TaskRequest;

  eventClickingOnLink = new EventEmitter();

  constructor(private commonService: CommonService,
      private route: ActivatedRoute,
      private router: Router,
      private authService: AuthService,
      private sessionStorage: SessionStorageService,
      public dialog: MatDialog
  ) {
    this.task = new Task();
    this.requests = [];
  }

  ngOnInit() {
    this.newRequest = new TaskRequest();
    this.taskId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.reloadTaskInfo();
    this.reloadTaskRequests();
  }

  ngAfterViewInit() {
    if(this.task.id != null) {
      this.taskComponent.onLoadTaskEvent(this.task);
    }
  }

  reloadTaskInfo() {
    this.commonService.getTaskInfo(this.taskId).subscribe((data: Task) => {
      this.task = data;
      if(this.taskComponent != null) {
        this.taskComponent.onLoadTaskEvent(this.task);
      }
    });
  }

  reloadTaskRequests() {
    this.commonService.getTaskRequestsByTaskId(this.taskId).subscribe((data: TaskRequest[]) => {
      this.requests = data;
    });
  }

  getTaskMode(): TaskComponentMode {
    return TaskComponentMode.COMMON;
  }

  handleTaskRequestError(error: any) {
    this.newRequest.isError = true;
    this.newRequest.errors = error.errors;
  }

  sendRequestHandler = (request: TaskRequest) => {

    this.newRequest.isError = false;
    this.commonService.createTaskRequest(request).subscribe((resp: any) => {
      if(resp.ok != null && resp.ok == false) {
        this.handleTaskRequestError(resp.error);
        return;
      }

      this.sessionStorage.remove('send_task_request');

      if(resp.blockedPartner) {
        return this.dialog.open(CommonDialogNotificationComponent, {
          width: '550px',
          data: "Уважаемый пользователь. Вы не сможете оставить заявку на выполнение, так как заказчик заблокирован."
        });
      }

      if(resp.blockedPerformer) {
        return this.authService.updateRolesForBlocking([ROLE.BAD_PERFORMER]);
      }

      if(resp.status == TaskRequestStatus.NOT_ENOUGH_MONEY) {
        resp.taskId = this.taskId;
        this.showRequestNotEnough(resp);
        return;
      }

      if(resp.status == TaskRequestStatus.ACCEPTED_BY_PERFORMER) {
        return this.router.navigate([`/user/${this.authService.getCurrentId}/${ActiveUrls.EXECUTOR_TASKS}/${this.taskId}`]);
      }
      this.reloadTaskRequests();
    });

  }

  showRequestNotEnough(resp: TaskRequest) {
    this.dialog.open(RequestNotEnoughMoneyComponent, {
      width: '550px',
      data: {
        isPublishedTask: true,
        request: resp,
        partnerId: this.authService.getCurrentId
      }
    });
  }

  //TODO duplication functionality
  sendHandlingRequestHandler = (request: TaskRequest) => {
    // this.commonService.checkTaskRequest(request.id).subscribe((id: number) => {
    //   if(id == null || id == -1) {
    //     const dialogRef = this.dialog.open(CommonDialogNotificationComponent, {
    //       width: '550px',
    //       data: "Уважаемый пользователь, статус задачи был изменён"
    //     });
    //     dialogRef.afterClosed().subscribe(data => {
    //       window.location.reload(true);
    //     });
    //   }
    //   else {
    //     this.commonService.changeTaskRequestStatus(request).subscribe((resp: TaskRequest) => {
    //       if(resp.status == TaskRequestStatus.NOT_ENOUGH_MONEY) {
    //         resp.taskId = this.taskId;
    //         this.showRequestNotEnough(resp);
    //         return;
    //       }
    //       if(resp.status != TaskRequestStatus.ACCEPTED_BY_PERFORMER) {
    //         this.reloadTaskInfo();
    //         this.reloadTaskRequests();
    //       }
    //       else {
    //         this.router.navigate([`/user/${this.authService.getCurrentId}/${ActiveUrls.EXECUTOR_TASKS}/${this.taskId}`]);
    //       }
    //     });
    //   }
    // });

    this.commonService.changeTaskRequestStatus(request).subscribe((resp: TaskRequest) => {
      if(resp != null) {
        if(resp.invalidStatus) {
            const dialogRef = this.dialog.open(CommonDialogNotificationComponent, {
            width: '550px',
            data: "Уважаемый пользователь, статус задачи был изменён"
          });
          dialogRef.afterClosed().subscribe(data => {
            window.location.reload(true);
          });
        }
        else {
          if(resp.status == TaskRequestStatus.NOT_ENOUGH_MONEY) {
            resp.taskId = this.taskId;
            this.showRequestNotEnough(resp);
            return;
          }
          if(resp.status != TaskRequestStatus.ACCEPTED_BY_PERFORMER) {
            this.reloadTaskInfo();
            this.reloadTaskRequests();
          }
          else {
            this.router.navigate([`/user/${this.authService.getCurrentId}/${ActiveUrls.EXECUTOR_TASKS}/${this.taskId}`]);
          }

          this.reloadTaskInfo();
          this.reloadTaskRequests();
        }
      }
    });
  }

  //TODO duplication functionality
  removeRequestByPerformerHandler = (requestId: number) => {
    this.commonService.removeTaskRequestStatus(requestId).subscribe((resp: number) => {
      this.reloadTaskInfo();
      this.reloadTaskRequests();
    });
  }
}
