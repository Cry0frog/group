import { AuthService } from '../../../../auth/auth.service';
import { Credential } from '../../../../models/auth/credential';
import { Component, OnInit } from '@angular/core';
import { OAuthProvider } from 'src/app/models/auth/oAuthProvider';
import { AuthProviderForUIType } from 'src/app/models/common/authProviderForUIType'
import { MatDialog } from '@angular/material';
import { FailedRegistrationData } from 'src/app/models/common/failedRegistrationData';
import { AddDataForLoginComponent } from '../add-data-for-login/add-data-for-login.component';
import { AuthProvide } from 'src/app/models/common/authProvide';
import { ActivatedRoute } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { BackUrlLevel } from '../../common/backUrlLevel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  credential: Credential;
  errorAuth: boolean;
  errorConfEmail: boolean;
  errorConfPhoneNumber: boolean;
  urlLoginGoogle: string;
  urlLoginVK: string;
  urlLoginYandex: string;
  urlLoginFacebook: string;

  failedRegistrationData: FailedRegistrationData;

  constructor(private authService: AuthService,
    private route: ActivatedRoute,
    private sessionStorage: SessionStorageService,
    public dialog: MatDialog) {
    this.errorAuth = false;
    this.errorConfEmail = false;
    this.errorConfPhoneNumber = false;
    this.failedRegistrationData = new FailedRegistrationData();
    this.urlLoginVK = "https://oauth.vk.com/authorize?" +
    "client_id=7384834&" +
    "display=page&" +
    "redirect_uri=https://gooddealonline.ru/login/VK&" +
    "scope=email,account,auth&" +
    "response_type=code&v=5.103"

    this.urlLoginGoogle = "https://accounts.google.com/o/oauth2/v2/auth?" +
    "scope=https://www.googleapis.com/auth/userinfo.email" +
    " https://www.googleapis.com/auth/userinfo.profile" +
    " https://www.googleapis.com/auth/user.birthday.read" +
    " https://www.googleapis.com/auth/user.phonenumbers.read&" +
    "response_type=code&"+
    "redirect_uri=https://gooddealonline.ru/login/Google&" +
    "client_id=23370062459-uaajl54h1doi3126t2pb8m6uajp7t87o.apps.googleusercontent.com"

    this.urlLoginYandex = "https://oauth.yandex.ru/authorize?" +
    "response_type=code&"+
    "client_id=e0bf1bed9bf94a7c8011da6b6a1eaefc"
    //+ "&redirect_uri=https://oauth.yandex.ru/verification_code";

    this.urlLoginFacebook = "https://www.facebook.com/dialog/oauth?" +
    "client_id=183597493058501&" +
    "redirect_uri=https://gooddealonline.ru/login/Facebook&" +
    "response_type=code"
  }

  ngOnInit() {

    const backUrl = this.sessionStorage.get(AuthService.backUrlName);
    if(backUrl == null) {
      this.sessionStorage.set(AuthService.backUrlName, BackUrlLevel.OWNER_APP);
    }

    const provide = this.route.snapshot.routeConfig.path;
    let code = this.route.snapshot.queryParams.code;
    const error = this.route.snapshot.queryParams.error;
    if(provide != null && code != null) {
      this.sessionStorage.set(AuthService.backUrlName, BackUrlLevel.OTHER_PROVIDE);
      if(provide == OAuthProvider.VK) {
        this.loginProvide(code, OAuthProvider.VK);
      }
      else if(provide == OAuthProvider.Google) {
        this.loginProvide(code, OAuthProvider.Google);
      }
      else if(provide == OAuthProvider.Yandex) {
        this.loginProvide(code, OAuthProvider.Yandex);
      }
      else if(provide == OAuthProvider.Facebook) {
        this.loginProvide(code, OAuthProvider.Facebook);
      }
    }

    if(error != null) {
      console.error(this.route.snapshot.queryParams.error_description);
    }

    this.authService.clearLoginData();
    this.credential = new Credential();
    this.authService.logoutWithoutRedirect();
    //this.credential.username = "user1Alex";
    //this.credential.password = "1234";
    //this.credential.username = "testCompany";
    //this.credential.password = "1234";
  }

  login(event) {
    if(event != null) {
      event.preventDefault();
    }
    this.authService.authenticate(this.credential,
      () => {
        this.errorAuth = true;
      }
    );
  }

  loginProvide(code: string, provide: OAuthProvider) {
    this.sessionStorage.remove(AuthService.backUrlName);
    this.authService.loginProvide(code, provide).subscribe((data: AuthProvide) => {
      if(data != null) {
        this.responseHandler(data, provide)
      }
    });
  }

  continueLoginProvide(failedRegistrationData: FailedRegistrationData, provide: OAuthProvider) {
    this.authService.continueLoginProvide(failedRegistrationData, provide).subscribe((data: AuthProvide) =>{
      if(data != null) {
        this.responseHandler(data, provide)
      }
    })
  }

  responseHandler(data: AuthProvide, provide: OAuthProvider) {
    const responce = AuthProvide.convertToObj(data);
    responce.authProviderForUITypes.forEach((status: AuthProviderForUIType) => {
      if(status == AuthProviderForUIType.NULL_EMAIL) {
        this.failedRegistrationData.nullEmail = true;
      }
      else if(status == AuthProviderForUIType.NULL_CITY) {
        this.failedRegistrationData.nullCity = true;
      }
      else if(status == AuthProviderForUIType.NULL_PHONE) {
        this.failedRegistrationData.nullPhone = true;
      }
      else if(status == AuthProviderForUIType.CONF_EMAIL) {
        this.failedRegistrationData.confEmail = true;
        this.errorConfEmail = true;
      }
      else if(status == AuthProviderForUIType.CONF_PHONE_NUMBER) {
        this.failedRegistrationData.confPhoneNumber = true;
        this.errorConfPhoneNumber = true;
      }
      else if(status == AuthProviderForUIType.OK) {
        this.authService.authenticateProvide(provide, data.token);
      }
    });

    if(this.failedRegistrationData.nullPhone || this.failedRegistrationData.nullEmail || this.failedRegistrationData.nullCity ||
      this.failedRegistrationData.confEmail || this.failedRegistrationData.confPhoneNumber) {
      this.addingDataForLoginProvide(provide);
    }
  }

  addingDataForLoginProvide(provide: OAuthProvider) {
    const dialogRef = this.dialog.open(AddDataForLoginComponent, {
      width: '550px',
      data: this.failedRegistrationData
    });
    dialogRef.afterClosed().subscribe((data: FailedRegistrationData) => {
      if(data != null) {
       this.continueLoginProvide(data, provide);
      }
    });
  }
}
