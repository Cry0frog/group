import { ROLE } from 'src/app/auth/role';
import { ErrorHandler } from '../error/errorHandler';
import { ShortPassportInfo } from './shortPassportInfo';
import { StatusUser } from '../auth/statusUser';
import { ImageWorkExample } from '../image_work_example/imageWorkExample';
import { Resume } from '../resume/resume';

export class PartnerInfo extends ErrorHandler {

  constructor() {
    super();
    this.passportInfo = new ShortPassportInfo();
    this.roles = [];
    this.images = [];
    this.resume = new Resume();
  }

  idPartner:number;

  fio: string;
  city: string;
  age: string;
  phoneNumber: string;
  aboutMe: string;
  email: string;

  completedTasks: number;
  createTasks: number;
  finishedTasks: number;
  inProcessTasks: number;
  averageRating: number;
  numberOfReviews: number;

  recommendedPerformer: boolean;
  passportInfo: ShortPassportInfo;
  emptyPassport: boolean;
  isEditPhoneNumber: boolean;
  statusUser: StatusUser;
  categoriesName: string[];
  getNotificationsAboutNewTaskMyCity: boolean;
  dateLastActivity: Date;

  roles: ROLE[];

  images: ImageWorkExample[];
  onlineStatus: string;
  notOnline: boolean;
  resume: Resume; 

  //only ui
  verificationToken: string;
  isShowCategoriesNames: boolean;
  isShowAboutMe: boolean;

  isMemberAnother(): boolean {
    return this.roles.includes(ROLE.MEMBER_ANOTHER);
  }

  isMemberStore(): boolean {
    return this.roles.includes(ROLE.MEMBER_STORE);
  }

  isMemberPerformer(): boolean {
    return this.roles.includes(ROLE.MEMBER_PERFORMER);
  }

  isLegalEntityFull(): boolean {
    return this.roles.includes(ROLE.LEGAL_ENTITY_FULL);
  }

  get tooltipMemberPerformer(): string {
    return "Партнёр - исполнитель";
  }

  get tooltipMemberStore(): string {
    return "Партнёр - магазин";
  }

  get tooltipMemberAnother(): string {
    return "Партнёр GD";
  }

  static convertToObj(obj: any): PartnerInfo {
    if(obj == null) {
      return null;
    }
    const partnerInfo: PartnerInfo = new PartnerInfo();
    Object.assign(partnerInfo, obj);

    partnerInfo.images = obj.images != null ? obj.images.map(el => ImageWorkExample.convertToObj(el)) : [];

    if(obj.resume != null) {
      partnerInfo.resume = Resume.convertToObj(obj.resume);
    }

    return partnerInfo;
  }
}
