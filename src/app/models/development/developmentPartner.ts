import { GeoCityProperty } from '../map/geo/city/geoCityProperty';
import { ShortPassportInfo } from '../partnerInfo/shortPassportInfo';
import { ROLE } from '../../auth/role';
import { ROLE_TITILE_DISPLAY } from '../../components/admin/common/admin.descriptions';
import { DateTimeStr } from '../common/dateTimeStr';

export class DevelopmentPartner extends DateTimeStr {
    constructor() {
        super();
        this.roles = [];
        this.city = new GeoCityProperty();
        this.passportInfo = new ShortPassportInfo();
        this.translateRoles = [];
        this.amount = 0;
        this.income = 0;

        this.message = 'Готов взяться за выполнение';
    }

    id: number;
    fio: string;
    email: string;
    phoneNumber: string;
    username: string;
    password: string;
    confirmationPassword: string;
    city: GeoCityProperty;
    changedPassword: boolean;
    age: string;
    aboutMe: string;
    passportInfo: ShortPassportInfo;
    roles: ROLE[];
    amount: number;
    income: number;
    showPerformers: boolean;

    translateRoles: string[];

    //only ui
    message: string;

    static convertToObj(obj: DevelopmentPartner): DevelopmentPartner {
        if(obj == null) {
          return null;
        }

        let resp = new DevelopmentPartner()
        Object.assign(resp, obj);
        resp.city = GeoCityProperty.convertToObj(obj.city, null);
        resp.password = "";
        resp.confirmationPassword = "";
        resp.translateRoles = obj.roles.map(el => ROLE_TITILE_DISPLAY[el]);

        return resp;
    }
}
