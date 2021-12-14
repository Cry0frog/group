import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { SelectItem } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { Credential } from 'src/app/models/auth/credential';
import { RegistrationLegalEntityRequest } from 'src/app/models/auth/registrationLegalEntityRequest';
import { GeoCityFeature } from 'src/app/models/map/geo/city/geoCityFeature';
import { GeoCityProperty } from 'src/app/models/map/geo/city/geoCityProperty';
import { GeoCityResponse } from 'src/app/models/map/geo/city/geoCityResponse';
import { GeoService } from 'src/app/services/geo.service';
import { VerificationRequestComponent } from '../verification-request/verification-request.component';
import { InterviewComponent } from '../interview/interview.component';

@Component({
  selector: 'app-registration-legal',
  templateUrl: './registration-legal.component.html',
  styleUrls: ['./registration-legal.component.css']
})
export class RegistrationLegalComponent implements OnInit {

  regLegalEntityRequest: RegistrationLegalEntityRequest;
  partCityName: string;
  cities: SelectItem[];
  selectedCity: GeoCityProperty;
  geoCityResponse: GeoCityResponse;

  isNullEmail: boolean;

  constructor(private partnerService: PartnerService,
    private authService: AuthService,
    private sessionStorage: SessionStorageService,
    private geoService: GeoService,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog) {
      this.regLegalEntityRequest = new RegistrationLegalEntityRequest();
      this.cities = [];
      this.selectedCity = new GeoCityProperty();
  }

  ngOnInit() {
    this.sessionStorage.remove(AuthService.backUrlName);
  }

  handleRegistrationLegalEntityRequestError(error: any) {
    this.regLegalEntityRequest.isError = true;
    this.regLegalEntityRequest.errors = error.errors;
    this.regLegalEntityRequest.verificationToken = null;
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
    this.regLegalEntityRequest.city = this.selectedCity;

    if(this.regLegalEntityRequest.email == null) {
      this.isNullEmail = true;
      return;
    }

    this.partnerService.checkRegistrationLegalEntity(this.regLegalEntityRequest).subscribe((el: any) => {
      if(el.ok != null && el.ok == false) {
        this.handleRegistrationLegalEntityRequestError(el.error);
        return;
      }

      if(this.regLegalEntityRequest.phoneNumber == null || this.regLegalEntityRequest.phoneNumber == "") {
        this.continuedLegalEntityRegistration(this.regLegalEntityRequest);
        return;
      }

      const dialogRef = this.dialog.open(VerificationRequestComponent, {
        width: '850px',
        data: this.regLegalEntityRequest
      });
      dialogRef.afterClosed().subscribe((data: RegistrationLegalEntityRequest) => {
        if(data != undefined) {
          this.continuedLegalEntityRegistration(data);
        }
      });
    });
  }

  continuedLegalEntityRegistration(data) {
    data.isError = false;
    this.partnerService.registrationLegalEntity(data).subscribe((el: any) => {
      if(el.ok != null && el.ok == false) {
        this.handleRegistrationLegalEntityRequestError(el.error);
        return;
      }

      this.sessionStorage.remove('registration_legal_entity_content');

      if(el.errors == undefined) {
        const dialogRef = this.dialog.open(InterviewComponent, {
          width: '850px',
          data: el
        });
        dialogRef.afterClosed().subscribe(request => {
          this.loginAfterRegistration(this.regLegalEntityRequest);
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
    catch(error) {
      this.router.navigateByUrl('/login');
    }
  }

}
