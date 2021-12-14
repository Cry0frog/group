import { CommonService } from './../../../../common/services/common.service';
import { FilterTask } from 'src/app/models/filter/filterTask';
import { CalcMode } from './../../../../models/category/constructor/map/calcMode';
import { AcceptNotificationComponent } from './accept-notification/accept-notification.component';
import { LOCATION_TYPE_DISPLAY } from './../../../../common/category.description';
import { DEAL_STATE_TRANSLATE, DEAL_STATE_TOOLTIP } from './../../../../common/task.description';
import { WalletOneCommonPostParams } from './../../../../models/walletone/walletOneCommonPostParams';
import { PayService } from './../../../../services/pay.service';
import { PaymentTool } from './../../../../models/walletone/tools/paymentTool';
import { ChoosePayToolComponent } from './../create-task-content/choose-pay-tool/choose-pay-tool.component';
import { ChoosePerformerPayToolComponent } from './../create-task-content/choose-performer-pay-tool/choose-performer-pay-tool.component';
import { RequestCommentComponent } from './request-comment/request-comment.component';
import { SessionStorageService } from 'angular-web-storage';
import { HINTS } from './../../../../common/hints.description';
import { Router } from '@angular/router';
import { ChatArbitration } from './../../../../models/chat/arbitration/chatArbitration';
import { ChatService } from './../../service/chat.service';
import { MapHandlerComponent } from '../../map-handler/map-handler.component';
import { MapTaskProperty } from '../../../../models/task/properties/map/mapTaskProperty';
import { MapMode } from '../../map-handler/mapMode';
import { MapCategoryProperty } from '../../../../models/category/constructor/map/mapCategoryProperty';
import { BaseTaskProperty } from 'src/app/models/task/properties/baseTaskProperty';
import { CancelTaskComponent } from './cancel-task/cancel-task.component';
import { MatDialog } from '@angular/material';
import { TaskRequest } from '../../../../models/task/taskRequest';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { TaskComponentMode } from './taskComponentMode';
import { TaskStatus } from '../../../../models/task/taskStatus';
import { TASK_STATUS_TRANSLATE, TASK_STATUS_ACTION_TRANSLATE, MODE_TASK_PERFORMER_TRANSLATE,  } from '../../../../common/task.description';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Task } from 'src/app/models/task/task';
import { TaskRequestStatus } from 'src/app/models/task/taskRequestStatus';
import { TypeCategoryProperty } from 'src/app/models/category/constructor/typeCategoryProperty';
import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { ShortComment } from 'src/app/models/partner/shortComment';
import { OfferTaskComponent } from './offer-task/offer-task.component';
import { PAYOUT_TYPE_DISPLAY } from '../../../../common/category.description';
import { CancelRequestComponent } from './cancel-request/cancel-request.component';
import { CategoryPropertyPayoutTypes } from 'src/app/models/category/constructor/categoryPropertyPayoutTypes';
import { LocationType } from 'src/app/models/task/properties/map/locationType';
import { CommonDialogNotificationComponent } from '../../common/common-dialog-notification/common-dialog-notification.component';
import { PartnerInfoWithCity } from 'src/app/models/partnerInfo/partnerInfoWithCity';
import { MobileTooltipComponent } from '../../mobile-tooltip/mobile-tooltip.component';
import { UrlResolver } from 'src/app/components/partner/common/urlResolver';
import { ActiveUrls } from 'src/app/auth/activeUrls';
import { ChooseAmountComponent } from '../create-task-content/choose-amount/choose-amount.component';
import { EarlyCompletionTaskComponent } from './early-completion-task/early-completion-task.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  @Input() task: Task;
  @Input() taskId: number;
  @Input() taskRequests: TaskRequest[];
  @Input() mode: TaskComponentMode;
  @Input() newTaskRequest: TaskRequest;
  //TODO change to route handling ?
  @Output() switchToStatusEvent = new EventEmitter<TaskStatus>();

  @Output() sendRequestEvent = new EventEmitter<TaskRequest>();
  @Output() sendHandlingRequestEvent = new EventEmitter<TaskRequest>();
  @Output() removeRequestByPerformerEvent = new EventEmitter<number>();
  @Output() clickingOnLinkEvent = new EventEmitter();
  @ViewChild(MapHandlerComponent, {static: false}) mapComponent: MapHandlerComponent;

  taskStatusTranslates = TASK_STATUS_TRANSLATE;
  taskStatuses = TaskStatus;
  taskStatusActionTranslates = TASK_STATUS_ACTION_TRANSLATE;
  modeTaskPerformerTranslate = MODE_TASK_PERFORMER_TRANSLATE;
  payoutTypeDisplay = PAYOUT_TYPE_DISPLAY;
  locationTypeDisplay = LOCATION_TYPE_DISPLAY;
  taskComponentMode = TaskComponentMode;
  notPayedForCustomer = HINTS.notPayedForCustomer;
  notPayedForPerformer = HINTS.notPayedForPerformer;
  newComment: ShortComment;
  dealStateTranslates = DEAL_STATE_TRANSLATE;
  dealStateTooltip = DEAL_STATE_TOOLTIP;
  calcMode = CalcMode;

  resultCheck: number;
  openRequestComment: boolean;
  userId: number;

  requestMessage: string;
  showAdditionalMessageForFastTask: boolean;
  currentUrl: string;

  isWaitResponse: boolean;

  timerDays: string;
  timerHours: string;
  timerMinutes: string;
  timerSeconds: string;

  constructor(private authService: AuthService,
    private partnerService: PartnerService,
    private chatService: ChatService,
    private commonService: CommonService,
    private router: Router,
    public dialog: MatDialog,
    private sessionStorage: SessionStorageService,
    private payService: PayService) { }

  sortPropByOrder(properties: BaseTaskProperty[]) {
    if(properties == null) {
      return 0;
    }
    return properties.sort(
      (a: BaseTaskProperty, b: BaseTaskProperty) =>
        (a.refProperty.order > b.refProperty.order) ? 1
        : (a.refProperty.order === b.refProperty.order) ? 0
        : -1
    );
  }

  isCommonMode(): boolean {
    return this.mode == 2;
  }

  getDescriptionPay(payoutTypes: CategoryPropertyPayoutTypes): string {
    return payoutTypes == CategoryPropertyPayoutTypes.SECURE ? HINTS.securePay : HINTS.usualPay;
  }

  getMapMode(prop: MapCategoryProperty) {
    switch(prop.type) {
      case TypeCategoryProperty.COORDINATE:
        return MapMode.ADD_POINT;
      case TypeCategoryProperty.COORDINATE_PATH:
        return MapMode.ADD_PATH;
    }
  }

  timer() {
    this.refreshTimer();
    setTimeout(() => {
      this.timer();
    }, 1000);
  }

  refreshTimer() {
    if(this.task.dateAutoFinishTask != null) {

      this.task.dateAutoFinishTask.setSeconds(this.task.dateAutoFinishTask.getSeconds() - 1);
      this.timerHours = this.task.dateAutoFinishTask.getHours() < 10 ? `0${this.task.dateAutoFinishTask.getHours()}` : `${this.task.dateAutoFinishTask.getHours()}`;
      this.timerMinutes = this.task.dateAutoFinishTask.getMinutes() < 10 ? `0${this.task.dateAutoFinishTask.getMinutes()}` : `${this.task.dateAutoFinishTask.getMinutes()}`;
      this.timerSeconds = this.task.dateAutoFinishTask.getSeconds() < 10 ? `0${this.task.dateAutoFinishTask.getSeconds()}` : `${this.task.dateAutoFinishTask.getSeconds()}`;
      this.timerDays = this.task.dateAutoFinishTask.getDay() > 0 ? `${this.task.dateAutoFinishTask.getDay() - 1}` : `${this.task.dateAutoFinishTask.getDay()}`;

      if(this.task.dateAutoFinishTask.getDay() == 0 && this.task.dateAutoFinishTask.getHours() == 0 &&
        this.task.dateAutoFinishTask.getMinutes() == 0 && this.task.dateAutoFinishTask.getSeconds() == 0) {
          location.reload();
      }
    }
  }

  requestArbitration() {
    const dialogRef = this.dialog.open(EarlyCompletionTaskComponent, {
      width: '700px',
      data: this.task
    });
    dialogRef.afterClosed().subscribe(data => {
      if(data != null) {
        this.onPerformerCancelTask();
      }
    });
  }

  payForTask() {
    this.payService.payTask(this.taskId).subscribe((resp: WalletOneCommonPostParams) => {
      window.open(resp.url, '_self');
    });
  }

  checkDealStatus() {
    this.payService.checkDeal(this.taskId).subscribe(_ => {
      window.location.reload(true);
    });
  }

  isVisibleMap(locationType: LocationType): boolean {
    return locationType != LocationType.AT_PERFORMER && locationType != LocationType.REMOTELY;
  }

  isBadPerformer(): boolean {
    return this.authService.isBadPerformer();
  }

  isBadPartner(): boolean {
    return this.authService.isBadPartner();
  }

  isVisibleReadyToPay(request: TaskRequest): boolean {
    return this.authService.getCurrentId == this.task.creatorId || this.isOwnerTaskRequest(request);
  }

  goToFindTaskFilterByCategory(isRoot: boolean) {
    const filterTask = new FilterTask();
    if(isRoot) {
      filterTask.choosenCategoryIds.push(this.task.category.root.id);
    }
    else {
      filterTask.choosenCategoryIds.push(this.task.category.id);
    }
    this.sessionStorage.set(FilterTask.FILTER_TASK_PROP, JSON.stringify(filterTask));
    this.authService.navigateToFindTask();
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.currentUrl = UrlResolver.getMainSectionFromUrl(this.router.url);
    this.showAdditionalMessageForFastTask = false;
    this.requestMessage = 'Готов взяться за выполнение';
    this.openRequestComment = false;
    this.newComment = new ShortComment();
    this.getUserOfMyTaskAndCheckComment();

    if(this.router.routerState.snapshot.url.includes(PayService.UPDATE_STATUS_PART)) {
      this.payService.checkDeal(this.taskId).subscribe(_ => {
        window.open(window.location.href.replace(PayService.UPDATE_STATUS_PART, ''), '_self');
      });
    }
    console.log('' + this.taskId + '' + this.router);
    if(this.mode == TaskComponentMode.PARTNER) {
      const isFirstOpen = this.sessionStorage.get(Task.TASK_FIRST_OPEN);
      const savePerformer: PartnerInfoWithCity = PartnerInfoWithCity.convertToObj(this.sessionStorage.get('save_performer'));
      if(isFirstOpen != null && isFirstOpen != '') {
        if(savePerformer != null) {
          this.sessionStorage.remove('save_performer');
          this.sessionStorage.remove('save_partner_current_id');
          this.sessionStorage.remove('save_performer_category');
          this.sessionStorage.remove(Task.TASK_FIRST_OPEN);
          this.partnerService.offerTaskToPerformer(this.taskId, savePerformer.idPartner).subscribe(_ => {
            this.notifyAboutSuccessfullyOfferTask(this.task.name, savePerformer.fio)
          });
        }
        else {
          this.sessionStorage.remove(Task.TASK_FIRST_OPEN);
          setTimeout(() => {
            const dialogRef = this.dialog.open(OfferTaskComponent, {
              width: '750px',
              data: this.task.id,
              disableClose: true
            });
            dialogRef.afterClosed().subscribe((data: any) => {
              if(data != null) {
                this.router.navigate([`/performers/${this.task.id}`]);
              }
            });
          }, 1000);
        }
      }
    }

    this.redirectToUserTask(5);
  }

  get isMobileMode() {
    return this.authService.isMobileMode();
  }

  redirectToUserTask(i) {
    if(this.task.creatorId != null) {
      if(this.task.performerId != null) {
        if(this.authService.getCurrentId == this.task.performerId) {
          return this.router.navigateByUrl(`user/${this.authService.getCurrentId}/executor-tasks/${this.task.id}`);
        }
        else if(this.authService.getCurrentId == this.task.creatorId) {
          return this.router.navigateByUrl(`user/${this.authService.getCurrentId}/my-tasks/${this.task.id}`);
        }
      }
    }
    else if(i != 0){
      if(this.currentUrl != ActiveUrls.PARTNER_MY_TASKS && this.currentUrl != ActiveUrls.EXECUTOR_TASKS) {
        setTimeout(() => this.redirectToUserTask(--i), 200);
      }
    }
  }

  getTooltipMobile(text: string) {
    if(!this.isMobileMode || text == null) {
      return;
    }

    this.dialog.open(MobileTooltipComponent, {
      width: '250px',
      data: text,
      backdropClass: 'backdropBackground',
      panelClass: 'panel_class_mob_tooltip'
    });
  }

  private notifyAboutSuccessfullyOfferTask(taskName: string, performerFio: string) {
    const dialogNotification = this.dialog.open(CommonDialogNotificationComponent, {
      width: '850px',
      data: `Вы уведомили пользователя '${performerFio}',
        ожидайте ответа по задаче '${taskName}'`
    });
  }

  onLoadTaskEvent(task: Task) {
    const mapTask = task.getMapTaskProperty();

    if(task == null || mapTask == null || mapTask.points.length == 0){
      return;
    }

    const points = MapTaskProperty.setMapToCenterOfPoints(mapTask);

    if(this.mapComponent != null) {
      this.mapComponent.setMapCenter(points[0], points[1]);
    }
    setTimeout(() => {
      if(this.mapComponent != null) {
        this.mapComponent.setMapCenter(points[0], points[1]);
      }
    }, 300);
  }

  offerTask(id: number) {
    this.router.navigate([`/performers/${id}`]);
  }

  parseTime(request: TaskRequest) {
    return new Date(Date.parse(request.createdAt));
  }

  isNotFastTask() {
    return this.task != null && this.task.category != null && !this.task.category.fast;
  }

  isFastTask() {
    return this.task != null && this.task.category != null && this.task.category.fast;
  }

  isLogged(): Observable<boolean> {
    return this.authService.isLoggedIn;
  }

  isPerformer(): boolean {
    return this.authService.isPerformer();
  }

  isYourTask(): boolean {
    return this.authService.getCurrentId == this.task.creatorId;
  }

  isPerformerOfTask(): boolean {
    return this.authService.getCurrentId == this.task.performerId;
  }

  isNotAlreadySendRequest(): boolean {
    return this.taskRequests.filter(el =>
      el.user.id == this.authService.getCurrentId).length == 0;
  }

  isFinishedTask(): boolean {
    return this.task.status==TaskStatus.FINISHED
      || this.task.status==TaskStatus.FINISHED_IN_FAVOR_CUSTOMER
      || this.task.status==TaskStatus.FINISHED_IN_FAVOR_PERFORMER;
  }

  checkComment(): boolean {
    return this.resultCheck==0;
  }

  getUserOfMyTaskAndCheckComment() {
    if(this.mode==TaskComponentMode.PARTNER) {
      this.partnerService.getMyTaskWithPerformer(this.taskId).subscribe((data: Task) => {
        if(data.performerId!=undefined) {
          this.userId = data.performerId;
          this.checkUserComment();
        }
      });
    }
    else if(this.mode==TaskComponentMode.PERFORMER) {
      this.partnerService.getMyTaskWithPartner(this.taskId).subscribe((data: Task) => {
        if(data.creatorId!=undefined) {
          this.userId = data.creatorId;
          this.checkUserComment();
        }
      });
    }
  }

  checkUserComment() {
    this.partnerService.checkPartnerComment(this.taskId).subscribe((data: number) => {
      this.resultCheck = data;
    });
  }

  openDialogWithRequestComment() {
    if(this.checkComment()) {
      this.authService.getCurrentId == this.task.creatorId ? this.newComment.isPartner = true : this.newComment.isPartner = false;
      this.newComment.idCommented = this.userId;
      this.newComment.taskId = this.taskId;
      const dialogRef = this.dialog.open(RequestCommentComponent, {
        width: '600px',
        data: this.newComment
      });
      dialogRef.afterClosed().subscribe((data: any) => {
        this.openRequestComment = true;
        window.location.reload(true);
      });
    }
  }

  resetWait() {
    this.isWaitResponse = false;
  }

  switchToStatus(status: TaskStatus) {
    this.isWaitResponse = true;
    this.switchToStatusEvent.emit(status);
  }

  onPerformerCancelTask() {
    if(this.task.isProcessing()) {
      const dialogRef = this.dialog.open(CancelTaskComponent, {
        width: '550px',
        data: {}
      });
      dialogRef.afterClosed().subscribe((data: any) => {
        if(data != null) {
          this.switchToStatusEvent.emit(TaskStatus.CANCELED_BY_PERFORMER);
        }
      });
    }
    else {
      this.switchToStatusEvent.emit(TaskStatus.CANCELED_BY_PERFORMER);
    }

  }

  onPerformerFinishTask() {
    this.switchToStatusEvent.emit(TaskStatus.REQUEST_TO_FINISH);
  }

  onOwnerFinishTask() {
    this.switchToStatusEvent.emit(TaskStatus.FINISHED);
    this.task.status = TaskStatus.FINISHED;
    this.openDialogWithRequestComment();
  }

  onOwnerCancelTask() {
    this.switchToStatusEvent.emit(TaskStatus.CANCELED_BY_PARTNER);
  }

  onPerformerStartDiscussion() {
    console.log('onPerformerStartDiscussion: ' + this.task.id);
    this.goToRequestArbitration(this.task.id);
  }

  onOwnerStartDiscussion() {
    console.log('onOwnerStartDiscussion: ' + this.task.id);
    this.goToRequestArbitration(this.task.id);
  }

  private goToRequestArbitration(taskId: number) {
    this.chatService.getRequestArbitration(this.task.id).subscribe((data: ChatArbitration) => {
      this.router.navigate([`/user/${this.authService.getCurrentId}/arbitration/${data.id}`]);
    });
  }

  saveRedirectUrl() {
    this.sessionStorage.set(AuthService.backUrlName, `${ActiveUrls.FIND_TASK}/${this.task.id}`);
    return this.router.navigateByUrl('/login');
  }

  isPayerToolChoosen() {
    return this.task.payerPaymentMask != null;
  }

  isNotFoundPerformer(): boolean {
    return this.taskRequests.length == 0;
  }

  getTaskStatusDescr() {
    return this.task.paymentErrorDescr;
  }

  updatePayerTool() {
    const dialogRef = this.dialog.open(ChoosePayToolComponent, {
      width: '450px',
      data: this.task,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe((res) => {
      if(res != null) {
        window.location.reload(true);
      }
    });
  }

  sendRequest(event, isUsualRequest: boolean) {
    if(event != null) {
      event.preventDefault();
    }
    const request: TaskRequest = new TaskRequest();
    request.payoutType = this.task.payoutType;
    request.comment = this.requestMessage;
    request.taskId = this.task.id;
    if(this.task.payoutType != CategoryPropertyPayoutTypes.SECURE) {
      if(isUsualRequest) {
        request.beneficiaryPaymentToolId = -1;
        this.sendRequestEvent.emit(request);
      }
      else {
        this.sendRequestWithOwnPrice(request);
      }

      return;
    }

    if(isUsualRequest) {
      this.openDialogRefChoosePerformerPayTool(request)
    }
    else {
      this.sendRequestWithOwnPrice(request);
    }
  }

  sendRequestWithOwnPrice(request: TaskRequest) {
    const dialogRef = this.dialog.open(ChooseAmountComponent, {
      width: '600px',
      data: request,
    });
    dialogRef.afterClosed().subscribe((data: TaskRequest) => {
      if(data != null) {
        if(this.task.payoutType != CategoryPropertyPayoutTypes.SECURE) {
          request.beneficiaryPaymentToolId = -1;
          this.sendRequestEvent.emit(data);
        }
        else {
          this.openDialogRefChoosePerformerPayTool(data);
        }
      }
    });
  }

  openDialogRefChoosePerformerPayTool(request: TaskRequest) {
    const dialogRef = this.dialog.open(ChoosePerformerPayToolComponent, {
      width: '450px',
      data: this.task.id,
    });

    dialogRef.afterClosed().subscribe((res: PaymentTool) => {
      if(res != null) {
        request.beneficiaryPaymentToolId = res.PaymentToolId;
        this.sendRequestEvent.emit(request);
      }
    });
  }

  isOwnerTaskRequest(req: TaskRequest): boolean {
    return this.authService.getCurrentId == req.user.id;
  }

  isAllowToApproveByOwner(req: TaskRequest): boolean {
    return req.isSubmittedTaskRequest() && this.task.isPublished();
  }

  approveByCustomerRequestToPerform(request: TaskRequest) {
    request.totalPay = request.readyToPayPerformer;
    request.status = TaskRequestStatus.APPROVED_BY_CUSTOMER;
    this.sendHandlingRequestEvent.emit(request);
  }

  abandonPerformer(request: TaskRequest) {
    request.status = TaskRequestStatus.SUBMITTED;
    this.sendHandlingRequestEvent.emit(request);
  }

  acceptByPerformerRequest(request: TaskRequest) {
    request.status = TaskRequestStatus.ACCEPTED_BY_PERFORMER;
    this.sendHandlingRequestEvent.emit(request);
    if(this.task.payoutType == CategoryPropertyPayoutTypes.SECURE) {
      this.dialog.open(AcceptNotificationComponent, {
        width: '550px',
        data: {}
      });
    }
  }

  setNewPrice(request: TaskRequest) {
    request.ownerTask = this.authService.getCurrentId == this.task.creatorId;

    const copyRequest = new TaskRequest();
    Object.assign(copyRequest, request);

    const dialogRef = this.dialog.open(ChooseAmountComponent, {
      width: '600px',
      data: copyRequest,
    });
    dialogRef.afterClosed().subscribe((resp: TaskRequest) => {
      if(resp != null) {
        window.location.reload(true);
      }
    });
  }

  agreeCustomerPrice(request: TaskRequest) {
    request.readyToPayPerformer = request.readyToPayPartner;
    this.commonService.setNewPrice(request).subscribe((resp: any) => {
      window.location.reload(true);
    });
  }

  rejectByPerformerRequest(request: TaskRequest) {
    const dialogRef = this.dialog.open(CancelRequestComponent, {
      width: '550px',
      data: {}
    });
    dialogRef.afterClosed().subscribe((data: any) => {
      if(data != null) {
        request.status = TaskRequestStatus.REJECTED_BY_PERFORMER;
        this.sendHandlingRequestEvent.emit(request);
      }
    });
  }

  isTaskWithCoordPath(): boolean {
    const mapTaskProp = this.task.getMapTaskProperty();
    return mapTaskProp ? mapTaskProp.refMapProperty.isCoordinatePath() : false;
  }

  removeRequestByPerformer(request: TaskRequest) {
    this.removeRequestByPerformerEvent.emit(request.id);
  }

  getDistance(taskProp: MapTaskProperty) {
    if(taskProp != null && taskProp.pathWrapper != null && taskProp.pathWrapper.distance != null) {
      return Math.round(taskProp.pathWrapper.distance);
    }
    return '';
  }

  editTask() {
    if(this.currentUrl == ActiveUrls.EXECUTOR_TASKS) {
      this.router.navigateByUrl(`user/${this.authService.getCurrentId}/${ActiveUrls.EXECUTOR_TASKS}/update/${this.taskId}`);
    }
    else if(this.currentUrl == ActiveUrls.PARTNER_MY_TASKS) {
      this.router.navigateByUrl(`user/${this.authService.getCurrentId}/${ActiveUrls.PARTNER_MY_TASKS}/update/${this.taskId}`);
    }
    else {
      this.router.navigateByUrl(`${ActiveUrls.FIND_TASK}/update/${this.taskId}`);
    }
  }

  downloadFile(doc) {
    this.partnerService.downloadDoc(doc);
  }

  isEmptyProperties(taskProp: BaseTaskProperty): boolean {
    return taskProp.refProperty.isSimpleCategoryPropertyType() || taskProp.refProperty.isDateCategoryPropertyType() || taskProp.refProperty.isMapCategoryPropertyType();
  }
}
