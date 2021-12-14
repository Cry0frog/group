import { GeoCityProperty } from '../map/geo/city/geoCityProperty';
import { ErrorHandler } from '../error/errorHandler';


export class RegistrationRequest extends ErrorHandler{

    constructor() {
        super();
    }

    email: string;
    password: string;
    confirmationPassword: string;
    phoneNumber: string;
    fio: string;
    age: string;
    verificationToken: string;
    city: GeoCityProperty
    promoCode: string;

    agreeToProcessingPersonalData: boolean;
    agreePrivacyPolicy: boolean;
}
