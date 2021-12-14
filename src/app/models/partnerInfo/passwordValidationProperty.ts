import { ErrorHandler } from '../error/errorHandler';

export class PasswordValidationProperty extends ErrorHandler {

    constructor() {
        super();  
    }

    oldPassword: string;
    newPassword: string;
    confirmationNewPassword: string;
}