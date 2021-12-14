import { AdminService } from './../../../../admin/service/admin.service';
import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { SessionStorageService } from 'angular-web-storage';
import { AuthService } from './../../../../../auth/auth.service';
import { FieldActivity } from './../../../../../models/field-activity/fileldActivity';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Vacancy } from 'src/app/models/vacancy/vacancy';
import { FormControl } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { GeoCityProperty } from 'src/app/models/map/geo/city/geoCityProperty';
import { GeoCityResponse } from 'src/app/models/map/geo/city/geoCityResponse';
import { RU_CALENDAR } from '../../../../../common/localization';
import { GeoService } from 'src/app/services/geo.service';
import { EDUCATION_TYPE, VACANCY_STATUS, WORK_EXPERIENCE_TYPE, PLACE_WORK_TYPE,
  SCHEDULE_TYPE, EMPLOYMENT_TYPE } from '../../../common/jobModule.discription';
import { RegistrationNotComponent } from '../../../registration-not/registration-not.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ActiveUrls } from 'src/app/auth/activeUrls';
import { WorkExperienceType } from 'src/app/models/vacancy/workExperienceType';
import { EducationType } from 'src/app/models/vacancy/educationType';
import { ShortUserInfo } from 'src/app/models/task/shortUserInfo';
import { CommonService } from 'src/app/common/services/common.service';
import { MapMode } from '../../../map-handler/mapMode';
import { MapVacancyPropertyPoint } from 'src/app/models/vacancy/mapVacancyPropertyPoint';
import { GeoCityFeature } from 'src/app/models/map/geo/city/geoCityFeature';
import { MapVacancyHandlerComponent } from '../../../map-handler/map-vacancy-handler/map-vacancy-handler.component';
import { Dropdown } from 'primeng/dropdown';
import { PaymentsCreateVacancyComponent } from '../payments-create-vacancy/payments-create-vacancy.component';
import { AdminSetting } from 'src/app/models/auth/adminSetting';

@Component({
  selector: 'app-create-vacancy-content',
  templateUrl: './create-vacancy-content.component.html',
  styleUrls: ['./create-vacancy-content.component.css']
})
export class CreateVacancyContentComponent implements OnInit {
  @ViewChild(MapVacancyHandlerComponent, {static: false}) mapComponent: MapVacancyHandlerComponent;

  ru_calendar = RU_CALENDAR;
  educationTypes = EDUCATION_TYPE;
  vacancyStatuses = VACANCY_STATUS;
  workExperienceTypes = WORK_EXPERIENCE_TYPE;
  placeWorkTypes = PLACE_WORK_TYPE;
  scheduleTypes = SCHEDULE_TYPE;
  employmentTypes = EMPLOYMENT_TYPE;

  vacancy: Vacancy;
  fieldsActivity: FieldActivity[];
  childFieldsActivity: FieldActivity[];

  selRootFieldActivityId: number;
  selChildCategoryId: number;

  toppingFieldActivity =  new FormControl();
  toppingChildFieldActivity = new FormControl();

  partCityName: string;
  cities: SelectItem[];
  selectedCity: GeoCityProperty;
  geoCityResponse: GeoCityResponse;

  partAddrName: string;
  addresses: SelectItem[];
  geoAddrResponse: GeoCityResponse;
  selectedAddr: GeoCityProperty;

  isDisabledBtn: boolean;

  //oldPhoneNumber: string;

  addAddressMode: boolean;

  constructor(private geoService: GeoService,
    private authService: AuthService,
    private commmonService: CommonService,
    private partnerService: PartnerService,
    private sessionStorage: SessionStorageService,
    private adminService: AdminService,
    private dialog: MatDialog,
    public router: Router) {
    this.vacancy = new Vacancy();
    this.fieldsActivity = [];
    this.childFieldsActivity = [];
    this.cities = [];
  }

  ngOnInit() {
    this.getAllRootFieldsActivity();

    const savedVacancy = this.sessionStorage.get('create_content__saved_vacancy');
    if(savedVacancy != null && savedVacancy != '') {
      this.prepareData(savedVacancy);
    }

    if(this.authService.LoggedUser.authorities != null) {
      if(this.authService.isUser() && this.authService.getCurrentId != null) {
        this.partnerService.getCurrenUserInfoForTask(this.authService.getCurrentId)
          .subscribe((userInfo: ShortUserInfo) => {
            //this.oldPhoneNumber = userInfo.phoneNumber;
            if(this.vacancy != null) {
              this.vacancy.userInfo = userInfo;
            }
        });

        this.partnerService.getCityOfUser().subscribe((data: GeoCityProperty) => {
          this.selectedCity = data;
          this.cities = this.cities.concat(this.prepareGeoCityPropertiesToCities([data]));
          this.applyCityOfUser();
          this.setMapToCenterOfChoosenCity();
        });

        this.partnerService.getUsedSities().subscribe((data: GeoCityProperty[]) => {
          if(this.selectedCity != null && data.some(el => el.osm_id != this.selectedCity.osm_id)) {
            data.push(this.selectedCity);
          }

          this.cities = this.prepareGeoCityPropertiesToCities(data);
          this.applyCityOfUser();
        });

      }
    }

  }

  isUpdateVacancy(): boolean {
    return this.vacancy.id != null;
  }

  isNotEmptyPoints(): boolean {
    return this.vacancy != null && this.vacancy.points.length != 0;
  }

  removePointsHandler(points: MapVacancyPropertyPoint[]) {
    this.vacancy.points = this.vacancy.points.filter(point => !points.find(removePoint => point.index === removePoint.index) || !points.find(removePoint => point.id === removePoint.id));
  }

  getAllRootFieldsActivity() {
    this.commmonService.getAllRootFieldsActivity().subscribe(data => {
      if(data != null) {
        this.childFieldsActivity = FieldActivity.sortedArray(data);
      }
    })
  }

  isRequiredWorkExperience(): boolean {
    return this.vacancy.experienceType == WorkExperienceType.REQUIRED;
  }

  isShowEducation(): boolean {
    return this.vacancy.educationType == EducationType.HIGHER || this.vacancy.educationType == EducationType.SPECIALIZED_SECONDARY;
  }

  isShowBodyPage(): boolean {
    return this.selectedCity != null && this.selChildCategoryId != null;
  }

  saveeData(savedVacancy) {
    this.sessionStorage.set('create_content__saved_vacancy', JSON.stringify(savedVacancy));
    this.prepareData(this.sessionStorage.get('create_content__saved_vacancy'));
  }

  prepareData(savedVacancy) {
    this.sessionStorage.remove('create_content__saved_vacancy');
    this.vacancy = Vacancy.convertToObj(JSON.parse(savedVacancy));
    //this.selRootFieldActivityId = savedVacancy.fieldActivity.root.id;
    this.selChildCategoryId = this.vacancy.fieldActivity.id;
    //this.selectedRootFieldActivity();
    this.selecthildFieldActivityByTimer(5);

    if(this.vacancy.city != null && this.vacancy.city.name != null) {
      this.partCityName = this.vacancy.city.name;
      this.selectedCity = this.vacancy.city;
      this.cities = this.prepareGeoCityPropertiesToCities([this.selectedCity]);
    }

    if(this.vacancy.id != null && this.vacancy.points.length != 0) {
      this.setMapToCenterOfPoints();
    }
    else {
      this.setMapToCenterOfChoosenCity();
    }

    if(this.vacancy.points != null && this.vacancy.points.length != 0) {
      this.setAddressByPoint();
    }
  }

  selecthildFieldActivityByTimer(i) {
    setTimeout(() => {
      if(this.childFieldsActivity.length != 0) {
        this.selectedChildFieldActivity();
      }
      else if(i != 0) {
        this.selecthildFieldActivityByTimer(--i)
      }
    }, 200)
  }

  setMapToCenterOfPoints() {
    const points = this.vacancy.setMapToCenterOfPoints();
    if(this.mapComponent != null) {
      this.mapComponent.setMapCenter(points[0], points[1]);
    }
    setTimeout(() => {
      if(this.mapComponent != null) {
        this.mapComponent.setMapCenter(points[0], points[1]);
      }
    }, 300);
  }

  setMapToCenterOfChoosenCity() {
    if(this.selectedCity != null && this.selectedCity.extent != null) {
      if(this.selectedCity.extent.length >= 4) {
        this.setMapCenter((this.selectedCity.extent[0] + this.selectedCity.extent[2]) / 2 ,
          (this.selectedCity.extent[1] + this.selectedCity.extent[3]) / 2,
          5
        );
      }
      else {
        this.setMapCenter(this.selectedCity.extent[0], this.selectedCity.extent[1], 5);
      }

    }
    else {
        setTimeout(() => {this.mapComponent.setCentreByGeoposition();}, 200);
    }
  }

  setMapCenter(lon: number, lat: number, i) {
    if(this.mapComponent != null) {
      this.mapComponent.setMapCenter(lon, lat);
    }
    else {
      setTimeout(() => {
        this.setMapCenter(lon, lat, --i);
      }, 150);
    }
  }

  setAddressByPoint() {
    this.vacancy.points.forEach(point => this.geocodePlace(point, false));
  }

  selectedRootFieldActivity() {
    if(this.selRootFieldActivityId != null) {
      this.selChildCategoryId = null;
      const root = this.fieldsActivity.find(field => field.id === this.selRootFieldActivityId);
      this.childFieldsActivity = FieldActivity.sortedArray(root.children);
    }
  }

  selectedChildFieldActivity() {
    if(this.selChildCategoryId != null) {
      const child = this.childFieldsActivity.find(field => field.id === this.selChildCategoryId);
      this.vacancy.fieldActivity = child;
    }
  }

  getPlacholderForName(): string {
    return this.vacancy.fieldActivity != null && this.vacancy.fieldActivity.nameExample ? this.vacancy.fieldActivity.nameExample : "Название вакансии"
  }

  getPlacholderForDecrtiption(): string {
    return this.vacancy.fieldActivity != null && this.vacancy.fieldActivity.description != null ? this.vacancy.fieldActivity.description: "Описание";
  }

  getPlacholderForSkills(): string {
    return this.vacancy.fieldActivity != null && this.vacancy.fieldActivity.skills != null ? this.vacancy.fieldActivity.skills: "Требования";
  }

  childCategoriesNotEmpty(): boolean {
    return this.childFieldsActivity != null && this.childFieldsActivity.length != 0;
  }

  getMapMode() {
    return MapMode.ADD_POINT;
  }

  deleteAddress(point) {
    this.vacancy.points = point.index ? this.vacancy.points.filter(el => el.index != point.index) : this.vacancy.points.filter(el => el.id != point.id);
    setTimeout(() => this.mapComponent.onChangePoints(),100);
  }

  goToPoint(point: MapVacancyPropertyPoint) {
    this.mapComponent.setMapCenter(parseFloat(point.lon),
      parseFloat(point.lat)
    );
  }

  updateAddressHandler(point: MapVacancyPropertyPoint) {
    const elems = this.vacancy.points.filter(el => el.index == point.index);
    if(elems == null || elems.length == 0) {
      return;
    }

    const changedPoint = elems[0];
    changedPoint.lat = point.lat;
    changedPoint.lon = point.lon;
    this.geocodePlace(changedPoint, false);
  }

  onChangeAddress = (event) => {
    if(event.code == 'Enter') {
      this.addAddresWhenSelAddLoad();
      return;
    }
    if(this.partAddrName != event.target.value) {
      this.partAddrName = event.target.value;
      this.refreshAddressCandidates();
    }
  };

  onClick(event) {
    if(event.target.tagName == 'SPAN') {
      this.addAddresWhenSelAddLoad();
    }
  }

  addAddresWhenSelAddLoad() {
    setTimeout(() => {
      if(this.selectedAddr != null) {
        this.addAddress(this.selectedAddr);
        this.selectedAddr = null;
        this.partAddrName = null;
      }
      else {
        setTimeout(() => {
          this.addAddress(this.selectedAddr);
          this.selectedAddr = null;
          this.partAddrName = null;
        }, 200);
      }
    }, 100);
  }

  addAddress(cityProp: GeoCityProperty) {
    this.addAddressMode = false;
    const point: MapVacancyPropertyPoint = new MapVacancyPropertyPoint();
    point.addr = this.selectedAddr.getDisplayAddrName();

    let index = 0, counter = 0;
    if(this.vacancy.points != null && this.vacancy.points.length != 0) {
      const lastAddr: MapVacancyPropertyPoint = this.vacancy.points.reduce(
        (prev: MapVacancyPropertyPoint, cur: MapVacancyPropertyPoint) => {
          return (prev.index > cur.index) ? prev: cur;
      });
      index = lastAddr.index + 1;
      counter = lastAddr.order + 1;
    }

    point.index = index;
    point.order = counter;
    point.geoCityPropertyAddr = cityProp;
    point.selectedItems = this.addresses;
    if(cityProp.extent.length == 4) {
      //@ts-ignore
      point.lon = (cityProp.extent[0] + cityProp.extent[2]) / 2;
      //@ts-ignore
      point.lat = (cityProp.extent[1] + cityProp.extent[3]) / 2;
    }
    else {
      //@ts-ignore
      point.lon = cityProp.extent[0];
      //@ts-ignore
      point.lat = cityProp.extent[1];
    }


    this.vacancy.points.push(point);
    this.mapComponent.onChangePoints();
  }

  refreshAddressCandidates() {
    if(this.partAddrName != null && this.partAddrName != '') {
      this.geoService.geocodeAddressByPartOfName(this.partAddrName, this.selectedCity, true).subscribe((resp: GeoCityResponse) => {
        this.geoAddrResponse = resp;
        const prep  = this.prepareGeoAddrFeaturesToAddr(this.geoAddrResponse.features, this.partAddrName);
        this.addresses = prep.sort((e: SelectItem, b: SelectItem) => {
          if(e.value.city == b.value.city) {
            if(e.value.street == b.value.street) {
              return e.value.street == b.value.street ? 0 :
                (e.value.street > b.value.street ? 1 : -1);
            }
            else {
              return e.value.street > b.value.street ? 1 : -1;
            }
          }
          else {
            return e.value.city > b.value.city ? 1 : -1;
          }
        });
      });
    }
  }

  addAddressHandler(point: MapVacancyPropertyPoint) {
    this.geocodePlace(point, true);
  }

  geocodePlace(point: MapVacancyPropertyPoint, isAdd) {
    this.geoService.geocodePlace(parseFloat(point.lat), parseFloat(point.lon)).subscribe(obj => {
      if(obj.address != null && obj.address.city != null
        && obj.address.house_number != null
      ) {
        if(obj.address.street != null) {
          point.addr = obj.address.city + ', ' + obj.address.street + ', ' + obj.address.house_number;
        }
        if(obj.address.road != null) {
          point.addr = obj.address.city + ', ' + obj.address.road + ', ' + obj.address.house_number;
        }
        else {
          point.addr = obj.display_name;
        }
      }
      else {
        point.addr = obj.display_name;
      }

      this.setGeoCityPropertyAddr(point, isAdd, obj);
    });
  }

  setGeoCityPropertyAddr(point, isAdd, obj) {
    this.geoService.geocodeAddressByPartOfName(`${obj.address.state} ${obj.address.road} ${obj.address.house_number ? obj.address.house_number : obj.address.neighbourhood}`,
     this.selectedCity, true).subscribe((resp: GeoCityResponse) => {
      if(resp.features.length != 0) {
        point.selectedItems  = this.prepareGeoAddrFeaturesToAddr(resp.features, point.addr);
        point.selectedItems = point.selectedItems.filter(el => el.value.postcode == obj.address.postcode);
        const addres =  point.selectedItems.find(el => el.value.osm_id == obj.osm_id);
        point.geoCityPropertyAddr = addres != null ? addres.value : point.selectedItems[0].value;
        if(isAdd) {
          this.vacancy.points.push(point);
        }
      }
    });
  }

  prepareGeoAddrFeaturesToAddr(features: GeoCityFeature[], fakeFilter: string): SelectItem[] {
    let preparedFeatures = features.map((feature: GeoCityFeature) => {
      return {
        label: feature.properties.getDisplayAddrName(),
        value: feature.properties,
        fakeFilter: fakeFilter
      };
    });
    return preparedFeatures;
  }


  onUpdateChangeAddress = (event, point) => {
    if(event.code == 'Enter') {
      this.changeAdress(point);
      return;
    }
    if(this.partAddrName != event.target.value) {
      this.partAddrName = event.target.value;
      this.refreshAddressCandidatesPoint(point);
    }
  }

  onClickUpdate(event, point, dropdown: Dropdown) {
    if(dropdown != null) {
      dropdown.filterValue = point.addr;
    }

    if(event.target.tagName == 'SPAN') {
      this.changeAdress(point);
    }
  }

  refreshAddressCandidatesPoint(point: MapVacancyPropertyPoint) {
    if(this.partAddrName != null && this.partAddrName != '') {
      this.geoService.geocodeAddressByPartOfName(this.partAddrName, this.selectedCity, true).subscribe((resp: GeoCityResponse) => {
        this.geoAddrResponse = resp;
        const prep  = this.prepareGeoAddrFeaturesToAddr(this.geoAddrResponse.features, this.partAddrName);
        point.selectedItems = prep.sort((e: SelectItem, b: SelectItem) => {
          if(e.value.city == b.value.city) {
            if(e.value.street == b.value.street) {
              return e.value.street == b.value.street ? 0 :
                (e.value.street > b.value.street ? 1 : -1);
            }
            else {
              return e.value.street > b.value.street ? 1 : -1;
            }
          }
          else {
            return e.value.city > b.value.city ? 1 : -1;
          }
        });
      });
    }
  }

  changeAdress(point: MapVacancyPropertyPoint) {
    const cityProp: GeoCityProperty =  point.geoCityPropertyAddr;
    this.vacancy.points = this.vacancy.points.filter(el => el.index != point.index);
    if(cityProp.extent.length == 4) {
      //@ts-ignore
      point.lon = (cityProp.extent[0] + cityProp.extent[2]) / 2;
      //@ts-ignore
      point.lat = (cityProp.extent[1] + cityProp.extent[3]) / 2;
    }
    else {
      //@ts-ignore
      point.lon = cityProp.extent[0];
      //@ts-ignore
      point.lat = cityProp.extent[1];
    }

    this.vacancy.points.push(point);
    this.mapComponent.onChangePoints();
  }

  onChooseCity(event) {
    this.setMapToCenterOfChoosenCity();
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
        this.cities = GeoCityResponse.prepareGeoCityFeaturesToCities(this.geoCityResponse.features);
      });
    }
  }

  prepareGeoCityPropertiesToCities(features: GeoCityProperty[]): SelectItem[] {
    return features.map((feature: GeoCityProperty) => {
      return {
        label: feature.getDisplayName(),
        value: feature
      };
    });
  }

  applyCityOfUser() {
    if(this.selectedCity != null && this.cities != null && this.cities.length != 0) {
      const citiesFilter = this.cities.filter(el => el.value.osm_id == this.selectedCity.osm_id);
      if(citiesFilter.length != 0) {
        const id = this.selectedCity.id;
        this.selectedCity = citiesFilter[0].value;
        this.selectedCity.id = id;
      }
    }
  }

  checkAuth() {
    const dialogRef = this.dialog.open(RegistrationNotComponent, {
      width: '850px',
      data: "Чтобы создать вакансию или откликнуться на нее просим вас зарегистрироваться или пройти авторизацию (если у вас уже существует аккаунт)"
    });
    dialogRef.afterClosed().subscribe((data: any) => {
      if(data != null) {
        //this.task.prepareBeforeSave();
        this.sessionStorage.set('create_content__saved_vacancy', JSON.stringify(this.vacancy));
        this.sessionStorage.set(AuthService.backUrlName, ActiveUrls.NEW_VACANCY);
        this.router.navigateByUrl(ActiveUrls.LOGIN);
      }

      this.isDisabledBtn = false;
    });
  }

  handleVacancyCreationError(error: any) {
    this.vacancy.isError = true;
    this.vacancy.errors = error.errors;
  }

  createVacancy() {
    this.vacancy.errors = [];
    this.isDisabledBtn = true;
    this.vacancy.city = this.selectedCity;

    if(this.authService.LoggedUser.authenticated == null || this.authService.LoggedUser.authenticated == false) {
      this.checkAuth();
      return;
    }

    this.partnerService.createVacancy(this.vacancy).subscribe(data => {
      if(data == null) {
        return;
      }

      if(data.ok != null && data.ok == false) {
        this.isDisabledBtn = false;
        this.handleVacancyCreationError(data.error);
        return;
      }

      this.router.navigate([`user/${this.authService.getCurrentId}/${ActiveUrls.PARTNER_VACANCY}/${data.id}`]);
    });
  }
}
