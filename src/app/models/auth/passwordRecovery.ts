import { ErrorHandler } from '../error/errorHandler';

export class PasswordRecovery extends ErrorHandler{

    constructor() {
        super();
    }

    username: string;
    phoneNumber: string;
    password: string;
    confirmationPassword: string;
    verificationToken: string;
}