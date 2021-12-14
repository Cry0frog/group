import { BaseCategoryProperty } from './../category/constructor/baseCategoryProperty';
import { MapCategoryProperty } from './../category/constructor/map/mapCategoryProperty';
import { DealState } from './../walletone/deal/dealState';
import { GeoCityProperty } from './../map/geo/city/geoCityProperty';
import { ErrorHandler } from '../error/errorHandler';
import { ModeTaskPerformer } from './properties/date/modeTaskPerformer';
import { ShortUserInfo } from './shortUserInfo';
import { Offset } from './../../common/offset';
import { BaseTaskProperty } from 'src/app/models/task/properties/baseTaskProperty';
import { DateTaskProperty } from './properties/date/dateTaskProperty';
import { TYPE_CATEGORY_MAP_SECTION, TYPE_CATEGORY_DATE_SECTION,
  TypeCategoryProperty, TYPE_CATEGORY_SIMPLE_SECTION } from './../category/constructor/typeCategoryProperty';
import { CategoryPropertyPayoutTypes, REGULAR_PAYOUT_TYPES } from './../category/constructor/categoryPropertyPayoutTypes';
import { MapTaskProperty } from './properties/map/mapTaskProperty';
import { SimpleTaskProperty } from './properties/simple/simpleTaskProperty';
import { Category } from 'src/app/models/category/category';
import { TaskStatus } from './taskStatus';
import { ROLE } from 'src/app/auth/role';
import { CalcMode } from '../category/constructor/map/calcMode';
import { StatusUser } from '../auth/statusUser';
import { ImageWorkExample } from '../image_work_example/imageWorkExample';
import { TaskDoc } from './taskDoc';

export class Task extends ErrorHandler {
  public static TASK_FIRST_OPEN = 'task_first_open';

  constructor() {
    super();
    this.userInfo = new ShortUserInfo();
    this.blocked = false;
    this.category = new Category();
    this.images = [];
    this.docs = [];
  }

  static PROP_TYPE = "@type";

  id: number;
  status: TaskStatus;
  name: string;

  city: GeoCityProperty;
  category: Category;
  properties: BaseTaskProperty[];
  payoutType: CategoryPropertyPayoutTypes;

  getEmailAboutNewSuggestion: boolean;
  creatorId: number;
  performerId: number;

  readyToPay: number;
  hour: number;

  createdAt: Date;
  finishedAt: Date;

  commission: number;
  totalPay: number;
  dealState: DealState;

  payerPaymentMask: string;
  beneficiaryPaymentMask: string;
  paymentErrorCode: string;
  paymentErrorDescr: string;

  paymentApprove: boolean;
  userInfo: ShortUserInfo;

  visibleByRoles: ROLE[];

  blocked: boolean;
  blockedPartner: boolean;

  offset: string;

  statusUser: StatusUser;

  invalidStatus: boolean;

  images: ImageWorkExample[];
  docs: TaskDoc[];

  dateAutoFinishTask: Date;

  getPaymentErrorDescription(): string {
    return this.paymentErrorDescr;
  }

  getCancelPaymentDescription(): string {

    if(!this.isShowPayerCard()) {
      return null;
    }

    if(this.dealState == DealState.Canceling) {
      return 'Задача будет отменена и средства вернуться вам на карту в течение 3-х дней';
    }
    else if(this.dealState == DealState.CancelError) {
      return 'Ошибка при отмене задачи, повторите ёще раз, если не получится, обратитесь к администратору';
    }
    else {
      return 'Задача отменена, средства вернуться вам на карту в течение 3-х дней, если это не так, обратитесь в службу поддержки';
    }
  }

  getSortedPropertiesByOrder() {
    return this.properties.sort(
      (a: SimpleTaskProperty, b: SimpleTaskProperty) =>
        (a.refProperty.order > b.refProperty.order) ? 1
        : (a.refProperty.order === b.refProperty.order) ? 0
        : -1
    );
  }

  getMapTaskProperty(): MapTaskProperty {
    if(this.properties == null || this.properties.length == 0) {
      return null;
    }

    const els = this.properties.filter(el => TYPE_CATEGORY_MAP_SECTION.includes(el.refProperty.type));
    if(els.length == 0) {
      return null;
    }
    return <MapTaskProperty>els[0];
  }

  isAllowToPayCalc(): boolean {
    if(!this.category.showReadyToPay
      && (this.allowPayBasedOnMeter() || this.allowPayBasedOnHour())
    ) {
      return true;
    }
    return false;
  }

  allowPayBasedOnMeter(): boolean {
    const prop: MapTaskProperty = this.getMapTaskProperty();
    if(prop == null) {
      return false;
    }
    return (prop.choosenCalcMode == CalcMode.BASED_ON_METER || prop.choosenCalcMode == null)
      && this.isBuildPath();
  }

  allowPayBasedOnHour(): boolean {
    const prop: MapTaskProperty = this.getMapTaskProperty();
    if(prop == null) {
      return false;
    }
    return prop.choosenCalcMode == CalcMode.BASED_ON_HOUR
      && this.hour != null && this.hour > 0;
  }

  isBuildPath(): boolean {
    return this.properties.some((taskProp: BaseTaskProperty) => {
      if(TYPE_CATEGORY_MAP_SECTION.includes(taskProp.refProperty.type)) {
        const mapProp: MapTaskProperty = <MapTaskProperty>taskProp;
        return mapProp.pathWrapper != null;
      }
      return false;
    });
  }

  isShowPayerCard() {
    return this.payoutType == CategoryPropertyPayoutTypes.SECURE
      /*&& this.payerPaymentMask != null*/;
  }

  isShowBeneficiaryCard() {
    return this.payoutType == CategoryPropertyPayoutTypes.SECURE
      && this.beneficiaryPaymentMask != null;
  }

  isHide(): boolean {
    return this.status == TaskStatus.HIDE;
  }

  isOnHold(): boolean {
    return this.status == TaskStatus.ON_HOLD;
  }

  isPublished(): boolean {
    return this.status == TaskStatus.PUBLISHED;
  }

  isNotPayed(): boolean {
    return this.status == TaskStatus.NOT_PAYED;
  }

  isProcessing(): boolean {
    return this.status == TaskStatus.PROCESSING;
  }

  isPerformerSelected(): boolean {
    return this.status == TaskStatus.PERFORMER_SELECTED;
  }

  isPerformRequestToFinish(): boolean {
    return this.status == TaskStatus.REQUEST_TO_FINISH;
  }

  isFinished(): boolean {
    return this.status == TaskStatus.FINISHED
      || this.status == TaskStatus.FINISHED_IN_FAVOR_CUSTOMER
      || this.status == TaskStatus.FINISHED_IN_FAVOR_PERFORMER;
  }

  isFinishedInFavorCustomer(): boolean {
    return this.status == TaskStatus.FINISHED_IN_FAVOR_CUSTOMER;
  }

  isCancelInProgress(): boolean {
    return this.dealState == DealState.Canceling
      || this.dealState == DealState.CancelError;
  }

  isCanceledByOwner(): boolean {
    return this.status == TaskStatus.CANCELED_BY_PARTNER;
  }

  isCanceledByPerformer(): boolean {
    return this.status == TaskStatus.CANCELED_BY_PERFORMER;
  }

  isShowEditTask(): boolean {
    return this.status == TaskStatus.PUBLISHED
      || this.status == TaskStatus.HIDE
      || this.status == TaskStatus.ON_HOLD;
  }

  isRegularPayoutType(): boolean {
    return REGULAR_PAYOUT_TYPES.includes(this.payoutType)
      || this.payoutType == CategoryPropertyPayoutTypes.REGULAR;
  }

  isShowAdminNotice() {
    return this.category != null && this.category.showAdminNotice;
  }

  isAvailableToCheckDealStatus(): boolean {
    return this.dealState == DealState.Created
      || this.dealState == DealState.PaymentProcessing
      || this.dealState == DealState.Paid;
  }

  isNotEmptyMapFieldsForCalcPay(): boolean {
    const catProp: MapCategoryProperty = this.category.getMapCategoryProperty();
    const taskProp: MapTaskProperty = this.getMapTaskProperty();

    let result = true;

    if(catProp.showCategoryTransport && taskProp.transportCategory == null) {
      result = false;
    }

    if(catProp.showCategoryWeight && taskProp.weightCategory == null) {
      result = false;
    }

    if(taskProp.pathWrapper == null) {
      result = false;
    }

    return result;
  }

  prepareBeforeSave() {
    this.offset = Offset.getCurTimeZone();
    this.properties.forEach((el: BaseTaskProperty) => {
      el[Task.PROP_TYPE] = el.getClassName();
      if(TYPE_CATEGORY_DATE_SECTION.includes(el.refProperty.type)) {
        const dateProp: DateTaskProperty = <DateTaskProperty>el;
        if(!dateProp.isDatable()) {
          return;
        }

        dateProp.offset = Offset.getCurTimeZone();
        if(el.refProperty.type == TypeCategoryProperty.DATE) {
          dateProp.dateStart = dateProp.date1;
        }
        else if(el.refProperty.type == TypeCategoryProperty.DATETIME
            && dateProp.date1 != null && dateProp.time1 != null
        ) {
          dateProp.dateStart = new Date(dateProp.date1.getTime() + Offset.getOnlyTime(dateProp.time1));
        }
        else if(el.refProperty.type == TypeCategoryProperty.DATETIME_INTERVAL
            && dateProp.date1 != null && dateProp.time1 != null
            && dateProp.date2 != null && dateProp.time2 != null
        ) {
          dateProp.dateStart = new Date(dateProp.date1.getTime() + Offset.getOnlyTime(dateProp.time1));
          dateProp.dateEnd = new Date(dateProp.date2.getTime() + Offset.getOnlyTime(dateProp.time2));
        }
      }
    });

    if(this.category != null) {
      this.category.availablePayoutTypes = this.category.availablePayoutTypes
        .filter(el => el != CategoryPropertyPayoutTypes.REGULAR);
    }
  }

  prepareBeforeCalc() {
    this.offset = Offset.getCurTimeZone();
    this.properties.forEach((el: BaseTaskProperty) => {
      el[Task.PROP_TYPE] = el.getClassName();
    });

    if(this.category != null) {
      this.category.availablePayoutTypes = this.category.availablePayoutTypes
        .filter(el => el != CategoryPropertyPayoutTypes.REGULAR);
    }
  }

  static createEmptyTask(): Task {
    const task: Task = new Task();
    task.category = new Category();
    task.status = TaskStatus.HIDE;
    return task;
  }

  static createTaskBasedOnCategory(category: Category): Task {
    const task: Task = new Task();
    task.category = category;
    task.status = TaskStatus.HIDE;
    task.properties = [];
    task.hour = 1;
    category.properties.forEach((prop: BaseCategoryProperty) => {
      if(TYPE_CATEGORY_MAP_SECTION.includes(prop.type)) {
        const taskProp: MapTaskProperty = new MapTaskProperty();

        taskProp.points = [];
        taskProp.refProperty = prop;
        task.properties.push(taskProp);

        const mapProp: MapCategoryProperty = <MapCategoryProperty>prop;
        if(prop.type == TypeCategoryProperty.COORDINATE_PATH) {
          if(mapProp.calcMode == CalcMode.AT_CHOICE) {
            taskProp.choosenCalcMode = CalcMode.BASED_ON_METER;
          }
          else if(mapProp.calcMode == CalcMode.BASED_ON_HOUR) {
            taskProp.choosenCalcMode = CalcMode.BASED_ON_HOUR;
          }
          else {
            taskProp.choosenCalcMode = CalcMode.BASED_ON_METER;
          }
        }
      }
      else if(TYPE_CATEGORY_DATE_SECTION.includes(prop.type)) {
        const taskProp: DateTaskProperty = new DateTaskProperty();

        taskProp.modeTaskPerformer = ModeTaskPerformer.ON_DATE;
        taskProp.refProperty = prop;
        task.properties.push(taskProp);
      }
      else {
        const taskProp: SimpleTaskProperty = new SimpleTaskProperty();

        taskProp.refProperty = prop;
        task.properties.push(taskProp);
      }

    });

    return task;
  }

  static convertToObj(obj: any): Task {
    if(obj == null) {
      return null;
    }
    const task: Task = new Task();
    Object.assign(task, obj);
    if(task.properties != null) {
      const props = [];
      task.properties.forEach((prop: BaseTaskProperty) => {
        if(TYPE_CATEGORY_SIMPLE_SECTION.includes(prop.refProperty.type)) {
          props.push(SimpleTaskProperty.convertToObj(prop));
        }
        else if(TYPE_CATEGORY_DATE_SECTION.includes(prop.refProperty.type)) {
          props.push(DateTaskProperty.convertToObj(prop));
        }
        else if(TYPE_CATEGORY_MAP_SECTION.includes(prop.refProperty.type)) {
          props.push(MapTaskProperty.convertToObj(prop));
        }
        else {
          props.push(BaseTaskProperty.convertToObj(prop));
        }

      });
      task.properties = props;
    }

    if(obj.category != null) {
      task.category = Category.convertToObj(obj.category, true);
    }

    task.images = obj.images != null ? obj.images.map(image => ImageWorkExample.convertToObj(image)) : [];
    task.docs = obj.docs != null ? obj.docs.map(doc => TaskDoc.convertToObj(doc)) : [];

    if(obj.dateAutoFinishTask) {
      obj.dateAutoFinishTask = new Date(obj.dateAutoFinishTask);

      const currentDate = new Date();
      const diffDate = new Date();

      diffDate.setSeconds(obj.dateAutoFinishTask.getSeconds() - currentDate.getSeconds());
      diffDate.setMinutes(obj.dateAutoFinishTask.getMinutes() - currentDate.getMinutes());
      diffDate.setHours(obj.dateAutoFinishTask.getHours() - currentDate.getHours());
      diffDate.setDate(obj.dateAutoFinishTask.getDate() - currentDate.getDate());

      task.dateAutoFinishTask = diffDate;
    }

    return task;
  }

  isDealStatusCreated(): boolean {
    return this.dealState == DealState.Created;
  }

}
