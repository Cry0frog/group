import { StatusUser } from './../auth/statusUser';
import { ShortCategory } from './../partner/shortCategory';
import { GeoCityProperty } from '../map/geo/city/geoCityProperty';
import { ErrorHandler } from '../error/errorHandler';

export class ObligatoryPerformerInfo extends ErrorHandler {
  constructor() {
    super();
    this.cityProperty = new GeoCityProperty();
    this.shortCategories = [];
  }

  cityProperty: GeoCityProperty;
  phoneNumber: string;
  aboutMe: string;
  email: string;
  shortCategories: ShortCategory[];

  verificationToken: string;
  isEditPhoneNumber: boolean;
  statusUser: StatusUser;
}
