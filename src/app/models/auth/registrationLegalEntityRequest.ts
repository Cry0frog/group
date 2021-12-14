import { ErrorHandler } from '../error/errorHandler';
import { GeoCityProperty } from '../map/geo/city/geoCityProperty';

export class RegistrationLegalEntityRequest extends ErrorHandler{

    constructor() {
        super();
    }

    email: string;
    password: string;
    confirmationPassword: string;
    phoneNumber: string;
    ogrn: string;
    inn: string;
    verificationToken: string;
    city: GeoCityProperty;
    address: string;
    nameOrganization: string;
    agreeToProcessingPersonalData: boolean;
    agreePrivacyPolicy: boolean;
}