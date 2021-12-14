import { TaskComponent } from './../../../../shared-module/tasks/task/task.component';
import { AuthService } from './../../../../../auth/auth.service';
import { CommonService } from './../../../../../common/services/common.service';
import { TaskRequest } from './../../../../../models/task/taskRequest';
import { TaskComponentMode } from '../../../../shared-module/tasks/task/taskComponentMode';
import { TaskStatus } from '../../../../../models/task/taskStatus';
import { Task } from '../../../../../models/task/task';
import { PartnerService } from '../../../service/partner.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { CommonDialogNotificationComponent } from 'src/app/components/shared-module/common/common-dialog-notification/common-dialog-notification.component';

@Component({
  selector: 'app-partner-task',
  templateUrl: './partner-task.component.html',
  styleUrls: ['./partner-task.component.css']
})
export class PartnerTaskComponent implements OnInit, AfterViewInit {
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
    return TaskComponentMode.PARTNER;
  }

  reloadTaskInfo() {
    this.service.getMyTaskInfo(this.taskId).subscribe((data: Task) => {
      this.task = data;
      this.task.creatorId = this.auth.getCurrentId;
      if(this.taskComponent != null) {
        this.taskComponent.onLoadTaskEvent(this.task);
      }

      if(this.task.status == TaskStatus.REQUEST_TO_FINISH && this.task.dateAutoFinishTask != null && this.taskComponent != null) {
        this.taskComponent.timer();
      }
    });
  }

  reloadTaskRequests() {
    this.commonService.getTaskRequestsByTaskId(this.taskId).subscribe((data: TaskRequest[]) => {
      this.requests = data;
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
            this.taskComponent.onLoadTaskEvent(data);
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
    //       this.reloadTaskInfo();
    //       this.reloadTaskRequests();
    //     });
    //   }
    // });

    this.commonService.changeTaskRequestStatus(request).subscribe((resp: TaskRequest) => {
      if(resp != null) {
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

  //TODO duplication functionality
  removeRequestByPerformerHandler = (requestId: number) => {
    this.commonService.removeTaskRequestStatus(requestId).subscribe((resp: number) => {
      this.reloadTaskInfo();
      this.reloadTaskRequests();
    });
  }

}
