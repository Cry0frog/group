import { Component, OnInit, ViewChild } from '@angular/core';
import { RegistrationRequest } from 'src/app/models/auth/registrationRequest';
import { SelectItem } from 'primeng/api/selectitem';
import { GeoService } from 'src/app/services/geo.service';
import { GeoCityProperty } from 'src/app/models/map/geo/city/geoCityProperty';
import { MapHandlerComponent } from '../../map-handler/map-handler.component';
import { GeoCityResponse } from 'src/app/models/map/geo/city/geoCityResponse';
import { GeoCityFeature } from 'src/app/models/map/geo/city/geoCityFeature';
import { MatDialog } from '@angular/material';
import { VerificationRequestComponent } from './verification-request/verification-request.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { Credential } from '../../../../models/auth/credential';
import { AuthService } from 'src/app/auth/auth.service';
import { InterviewComponent } from './interview/interview.component';
import { BackUrlLevel } from '../../common/backUrlLevel';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registrationRequest: RegistrationRequest;
  cities: SelectItem[];
  partCityName: string;
  selectedCity: GeoCityProperty;
  geoCityResponse: GeoCityResponse;

  surname: string;
  name: string;
  patronymic: string;

  isNullEmail: boolean;

  urlLoginVK: string;
  urlLoginGoogle: string;
  urlLoginFacebook: string;
  urlLoginYandex: string;

  @ViewChild(MapHandlerComponent, {static: false}) mapComponent: MapHandlerComponent;

  constructor(private partnerService: PartnerService,
    private authService: AuthService,
    private sessionStorage: SessionStorageService,
    private geoService: GeoService,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog) {
    this.cities = [];
    this.registrationRequest = new RegistrationRequest();
    this.selectedCity = new GeoCityProperty();

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
    if(backUrl != null && backUrl == BackUrlLevel.OWNER_APP) {
      this.sessionStorage.remove(AuthService.backUrlName);
    }
  }

  handleRegistrationRequestError(error: any) {
    this.registrationRequest.isError = true;
    this.registrationRequest.errors = error.errors;
    this.registrationRequest.verificationToken = null;
  }

  clearPartnerInfoError() {
    this.registrationRequest.isError = false;
    this.registrationRequest.errors = null;
    this.registrationRequest.verificationToken = null;
  }

  onChangeCity(event) {
    if(this.partCityName != event.target.value) {
      this.partCityName = event.target.value;
      this.refreshCitiesCandidates();
    }
  }

  refreshCitiesCandidates() {
    if(this.partCityName != null && this.partCityName != '') {
      this.geoService.geocodeCitiesByPartOfName(this.partCityName).subscribe((resp: GeoCityResponse) => {
        this.geoCityResponse = resp;
        this.cities = this.geoCityResponse.features.map((feature: GeoCityFeature) => {
          return {
            label: feature.properties.getDisplayName(),
            value: feature.properties
          };
        });
      });
    }
  }

  getVerificationRequest() {
    this.registrationRequest.city = this.selectedCity;

    const validSurname = this.surname ? this.surname.split(' ').join('') : '';
    const validName = this.name ? this.name.split(' ').join('') : '';
    const validPatronymic = this.patronymic ? this.patronymic.split(' ').join('') : '';

    if(validSurname != '') {
         this.registrationRequest.fio = validSurname + " ";
    }

    if(validName != '') {
         this.registrationRequest.fio = this.registrationRequest.fio + validName + " ";
    }

    if(validPatronymic != '') {
         this.registrationRequest.fio = this.registrationRequest.fio + validPatronymic;
    }

    if(this.registrationRequest.email == null) {
         this.isNullEmail = true;
         return;
    }

    this.partnerService.checkRegistration(this.registrationRequest).subscribe((checkRegistration: any) => {
      if(checkRegistration.ok != null && checkRegistration.ok == false) {
        this.handleRegistrationRequestError(checkRegistration.error);
        return;
      }
      else {
        this.clearPartnerInfoError();
      }

      if(this.registrationRequest.phoneNumber == null || this.registrationRequest.phoneNumber == "") {
        this.continuedRegistration(this.registrationRequest);
        return;
      }

      const dialogRef = this.dialog.open(VerificationRequestComponent, {
         width: '850px',
         data: this.registrationRequest
       });
      dialogRef.afterClosed().subscribe((data: RegistrationRequest) => {
        if(data != undefined) {
          data.isError = false;
          this.continuedRegistration(data);
        }
      });
    });
  }

  continuedRegistration(data) {
    this.partnerService.registration(data).subscribe((el: any) => {
      if(el.ok != null && el.ok == false) {
        this.handleRegistrationRequestError(el.error);
        return;
      }

      this.sessionStorage.remove('registration_content');

      if(el.errors == undefined) {
        const dialogRef = this.dialog.open(InterviewComponent, {
          width: '850px',
          data: el
        });
        dialogRef.afterClosed().subscribe(request => {
          this.loginAfterRegistration(this.registrationRequest);
          return;
        });
      }
    });
  }

  private loginAfterRegistration(data) {
    try {
      const savedCredential = new Credential();
      savedCredential.password = data.password;
      savedCredential.username = data.email;
      this.authService.authenticate(savedCredential, () => {});
      return;
    }
    catch (error) {
      this.router.navigateByUrl('/login');
    }
  }

}
