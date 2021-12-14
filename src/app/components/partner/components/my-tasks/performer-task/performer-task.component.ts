import { TaskRequestStatus } from 'src/app/models/task/taskRequestStatus';
import { TaskComponent } from './../../../../shared-module/tasks/task/task.component';
import { TaskStatus } from '../../../../../models/task/taskStatus';
import { PartnerService } from '../../../service/partner.service';
import { CommonService } from '../../../../../common/services/common.service';
import { AuthService } from '../../../../../auth/auth.service';
import { TaskComponentMode } from '../../../../shared-module/tasks/task/taskComponentMode';
import { TaskRequest } from '../../../../../models/task/taskRequest';
import { Task } from 'src/app/models/task/task';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { CommonDialogNotificationComponent } from 'src/app/components/shared-module/common/common-dialog-notification/common-dialog-notification.component';
import { RequestNotEnoughMoneyComponent } from 'src/app/components/shared-module/tasks/find-task-page/task-wrapper/request-not-enough-money/request-not-enough-money.component';

@Component({
  selector: 'app-performer-task',
  templateUrl: './performer-task.component.html',
  styleUrls: ['./performer-task.component.css']
})
export class PerformerTaskComponent implements OnInit, AfterViewInit {
  @ViewChild(TaskComponent, {static: false}) taskComponent: TaskComponent;

  taskId: number;
  task: Task;
  requests: TaskRequest[];

  constructor(private service: PartnerService,
      private commonService: CommonService,
      protected auth: AuthService,
      public dialog: MatDialog,
      private route: ActivatedRoute
  ) {
    this.taskId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.task = new Task();
    this.requests = [];
  }

  ngOnInit() {
    window.scrollTo(0,0);
    this.reloadTaskInfo();
    this.reloadTaskRequests();
  }

  ngAfterViewInit() {
    if(this.task.id != null) {
      this.taskComponent.onLoadTaskEvent(this.task);
    }
  }

  getTaskMode(): TaskComponentMode {
    return TaskComponentMode.PERFORMER;
  }

  reloadTaskInfo() {
    this.service.getMyPerformTaskInfo(this.taskId).subscribe((data: Task) => {
      this.task = data;
      if(this.taskComponent != null) {
        this.taskComponent.onLoadTaskEvent(this.task);

        if(this.task.status == TaskStatus.REQUEST_TO_FINISH && this.task.dateAutoFinishTask != null) {
          this.taskComponent.timer();
        }
      }
    });
  }

  reloadTaskRequests() {
    this.commonService.getTaskRequestsByTaskId(this.taskId).subscribe((data: TaskRequest[]) => {
      this.requests = data;
      if(this.taskComponent != null) {
        this.taskComponent.onLoadTaskEvent(this.task);
      }
    });
  }

  switchToStatusHandler($event: TaskStatus) {
    this.service.switchStatusTask(this.task.id, $event).subscribe((data: Task) => {
      if(data != null) {
        if(data.invalidStatus) {
          this.invalidStatusDialogMessage("Уважаемый пользователь, статус задачи был изменён");
        }
        else {
          this.task = data;
          if(this.taskComponent != null) {
            this.taskComponent.isWaitResponse = false;
            this.taskComponent.onLoadTaskEvent(this.task);

            if(this.task.status == TaskStatus.REQUEST_TO_FINISH && this.task.dateAutoFinishTask != null) {
              this.taskComponent.timer();
            }
          }
        }
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
    //         return this.showRequestNotEnough(resp);
    //       }

    //       this.reloadTaskInfo();
    //       this.reloadTaskRequests();
    //     });
    //   }
    // });

    this.commonService.changeTaskRequestStatus(request).subscribe((resp: TaskRequest) => {
      if(resp != null) {

        if(resp.status == TaskRequestStatus.NOT_ENOUGH_MONEY) {
          resp.taskId = this.taskId;
          return this.showRequestNotEnough(resp);
        }

        if(resp.invalidStatus) {
          this.invalidStatusDialogMessage("Уважаемый пользователь, статус заявки был изменён");
        }
        else {
          this.reloadTaskInfo();
          this.reloadTaskRequests();
        }
      }
    });
  }

  invalidStatusDialogMessage(message) {
    const dialogRef = this.dialog.open(CommonDialogNotificationComponent, {
      width: '550px',
      data: message
    });
    dialogRef.afterClosed().subscribe(data => {
      window.location.reload(true);
    });
  }

  showRequestNotEnough(resp: TaskRequest) {
    this.dialog.open(RequestNotEnoughMoneyComponent, {
      width: '550px',
      data: {
        isPublishedTask: false,
        request: resp,
        partnerId: this.auth.getCurrentId
      }
    });
  }


  //TODO duplication functionality
  removeRequestByPerformerHandler = (requestId: number) => {
    this.commonService.removeTaskRequestStatus(requestId).subscribe((resp: number) => {
      //this.reloadTaskInfo();
      this.reloadTaskRequests();
    });
  }

}
