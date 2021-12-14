import { GeoCityProperty } from './../map/geo/city/geoCityProperty';

export class FailedRegistrationData {
    constructor() {
        this.city = new GeoCityProperty();
        this.nullCity = false;
        this.nullEmail = false;
        this.nullPhone = false;
        this.confEmail = false;
        this.confPhoneNumber = false;
    }
    
    email: string;
    phoneNumber: string;
    city: GeoCityProperty;

    //only ui
    nullEmail: boolean;
    nullCity: boolean;
    nullPhone: boolean;
    confEmail: boolean;
    confPhoneNumber: boolean;
}