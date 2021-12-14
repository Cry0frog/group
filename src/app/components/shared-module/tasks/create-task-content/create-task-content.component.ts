import { RegionalHourCost } from './../../../../models/rates/regionalHourCost';
import { CalcMode } from './../../../../models/category/constructor/map/calcMode';
import { FAST_MODE_TASK_PERFORMER_MAPPER, PRODUCT_CATEGORY_MAPPER,
  ICalcModeMapper, AVAILABLE_CALC_MODE_MAPPER } from './../../../../common/task.description';
import { ChoosePayToolComponent } from './choose-pay-tool/choose-pay-tool.component';
import { ILocationTypeMapper } from './../../../../common/category.description';
import { Validators, FormControl } from '@angular/forms';
import { GeoCityProperty } from './../../../../models/map/geo/city/geoCityProperty';
import { GeoCityFeature } from './../../../../models/map/geo/city/geoCityFeature';
import { GeoCityResponse } from './../../../../models/map/geo/city/geoCityResponse';
import { GeoService } from './../../../../services/geo.service';
import { Router } from '@angular/router';
import { HINTS } from '../../../../common/hints.description';
import { ShortUserInfo } from '../../../../models/task/shortUserInfo';
import { PaymentCalc } from '../../../../models/payment/paymentCalc';
import { SessionStorageService } from 'angular-web-storage';
import { RU_CALENDAR } from '../../../../common/localization';
import { PathWrapper } from '../../../../models/map/pathWrapper';
import { MapHandlerComponent } from '../../map-handler/map-handler.component';
import { MapTaskPropertyPoint } from '../../../../models/task/properties/map/mapTaskPropertyPoint';
import { LocationType } from '../../../../models/task/properties/map/locationType';
import { TYPE_CATEGORY_MAP_SECTION } from '../../../../models/category/constructor/typeCategoryProperty';
import { MatDialog } from '@angular/material';
import { TASK_STATUS_MAPPER, WEIGHT_CATEGORY_MAPPER, TRANSPORT_CATEGORY_MAPPER, MODE_TASK_PERFORMER_MAPPER } from '../../../../common/task.description';
import { PartnerService } from '../../../partner/service/partner.service';
import { CategoryPropertyPayoutTypes, REGULAR_PAYOUT_TYPES } from '../../../../models/category/constructor/categoryPropertyPayoutTypes';
import { CATEGORY_PROPERTY_PAYOUT_TYPES_MAPPER, ICategoryPropertyPayoutTypesMapper,
  GLOBAL_CATEGORY_PROPERTY_PAYOUT_TYPES_MAPPER, REGULAR_CATEGORY_PROPERTY_PAYOUT_TYPES_MAPPER
} from '../../../../common/category.description';
import { MapMode } from '../../map-handler/mapMode';
import { MapTaskProperty } from '../../../../models/task/properties/map/mapTaskProperty';
import { MapCategoryProperty } from '../../../../models/category/constructor/map/mapCategoryProperty';
import { Category } from 'src/app/models/category/category';
import { TypeCategoryProperty } from '../../../../models/category/constructor/typeCategoryProperty';
import { LOCATION_TYPE_MAPPER} from '../../../../common/category.description';
import { Component, OnInit, Input, OnChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { Task } from 'src/app/models/task/task';
import { BaseTaskProperty } from 'src/app/models/task/properties/baseTaskProperty';
import { AuthService } from 'src/app/auth/auth.service';
import { TaskStatus } from 'src/app/models/task/taskStatus';
import { PointType } from 'src/app/models/task/properties/map/pointType';
import { SelectItem } from 'primeng/api/selectitem';
import { ITaskRoleMapper, VISIBLE_ROLES } from '../../common/task.dtscriptions';
import { ROLE } from 'src/app/auth/role';
import { VerificationRequestComponent } from '../../auth/registration/verification-request/verification-request.component';
import { Dropdown } from 'primeng/dropdown';
import { RegistrationNotComponent } from '../../registration-not/registration-not.component';
import { ActiveUrls } from 'src/app/auth/activeUrls';
import { MobileTooltipComponent } from '../../mobile-tooltip/mobile-tooltip.component';
import { ModeTaskPerformer } from 'src/app/models/task/properties/date/modeTaskPerformer';
import { TaskDoc } from 'src/app/models/task/taskDoc';
import { HttpEvent, HttpEventType } from '@angular/common/http';

const defaultLocationType: LocationType = LocationType.AT_CUSTOMER;

@Component({
  selector: 'app-create-task-content',
  templateUrl: './create-task-content.component.html',
  styleUrls: ['./create-task-content.component.css']
})
export class CreateTaskContentComponent implements OnInit, OnChanges {
  @Input() categories: Category[];
  @Input() childCategories: Category[];
  @Input() selCategory: Category;
  @Input() isPreview: boolean;
  @Input() isAdmin: boolean;
  @Input() basedTask: Task;

  @ViewChild(MapHandlerComponent, {static: false}) mapComponent: MapHandlerComponent;
  @Output() chooseCategoryEvent = new EventEmitter<number>();

  hintModeTaskPerformer = HINTS.modeTaskPerformer;
  hintFastTask = HINTS.modeFastTaskPerformer;
  calcPayWarning = HINTS.calcPayWarning;
  hintSecurePay = HINTS.securePay;
  hintUsualPay = HINTS.usualPay;
  ru_calendar = RU_CALENDAR;
  locationTypeMapper = LOCATION_TYPE_MAPPER;
  taskStatusMapper = TASK_STATUS_MAPPER;
  globalCategoryPropertyPayoutTypes = GLOBAL_CATEGORY_PROPERTY_PAYOUT_TYPES_MAPPER;
  regularCategoryPropertyPayoutTypes = REGULAR_CATEGORY_PROPERTY_PAYOUT_TYPES_MAPPER;
  modeTaskPerformerMapper = MODE_TASK_PERFORMER_MAPPER;

  transportCategoryMapper = TRANSPORT_CATEGORY_MAPPER;
  weightCategoryMapper = WEIGHT_CATEGORY_MAPPER;
  productCategoryMapper = PRODUCT_CATEGORY_MAPPER;
  visibleByRoles: ITaskRoleMapper[] = VISIBLE_ROLES;
  calcMode = CalcMode;
  availableCalcModeMapper: ICalcModeMapper[] = AVAILABLE_CALC_MODE_MAPPER;

  userInfo: ShortUserInfo;

  task: Task;
  selParentCategoryId: string;
  selCategoryId: string;

  isShowDistance: boolean;
  distance: number;
  isCalculated: boolean;

  partCityName: string;
  cities: SelectItem[];
  selectedCity: GeoCityProperty;
  //userDefCity: GeoCityProperty;
  geoCityResponse: GeoCityResponse;
  myNumeric;

  isDisabledBtn: boolean;

  partAddrName: string;
  addresses: SelectItem[];
  geoAddrResponse: GeoCityResponse;
  selectedAddr: GeoCityProperty;

  toppingCategory = new FormControl();
  toppingChildCategory = new FormControl();
  toppingOrderExecutionMode = new FormControl();
  hourMessage: string;
  oldPhoneNumber: string;
  errorStatusNotVerify: boolean;
  addAddressMode: boolean;
  isMobilePhoneApple: boolean;

  eventProgress: number;
  isUploadFileUpdate: boolean;

  topingAddr = new FormControl();

  isMapAvailableForLocationTypes: LocationType[] = [LocationType.AT_CUSTOMER,
    LocationType.NOT_FUNDAMENTALY];

  constructor(private service: PartnerService,
      public dialog: MatDialog,
      private sessionStorage: SessionStorageService,
      private authService: AuthService,
      private router: Router,
      private geoService: GeoService
  ) {
    this.isCalculated = false;
    this.isMobilePhoneApple = false;
    this.userInfo = new ShortUserInfo();
    this.partCityName = '';
    this.cities = [];
    this.geoCityResponse = null;
    this.selParentCategoryId = '-1';
    this.eventProgress;

    let numericRegex = /^[0-9]+$/;
    this.myNumeric = new FormControl('', [
      Validators.required,
      Validators.pattern(numericRegex), // <-- Here's how you pass in the custom validator using regex.
    ]);
  }

  ngOnInit() {
    let user = navigator.userAgent.toLowerCase();
    this.isMobilePhoneApple = (user.indexOf("ipad") != -1 || user.indexOf("iphone") != -1) ? true : false;

    if(this.sessionStorage.get(AuthService.SCROLL_VALUE)) {
      this.sessionStorage.remove(AuthService.SCROLL_VALUE);
      setTimeout(() => {
        window.scrollTo(0, document.getElementById('work_examples').offsetTop)
      }, 500);
    }

    this.isShowDistance = false;
    if(this.isPreview) {
      //preview mode
      this.selParentCategoryId = this.categories[0].id + '';
      this.selCategoryId = this.selCategory.id + '';
      this.categories[0].children = this.childCategories;
      Promise.resolve(null).then(el => {
        this.recCall(10);
      });
    }
    //this.tryApplyingTaskFromStorage();
    if(this.authService.LoggedUser.authorities != null) {
      if(this.authService.isUser() && this.authService.getCurrentId != null) {
        this.service.getCurrenUserInfoForTask(this.authService.getCurrentId)
          .subscribe((userInfo: ShortUserInfo) => {
            this.userInfo = userInfo;
            this.oldPhoneNumber = userInfo.phoneNumber;
        });

        this.service.getCityOfUser().subscribe((data: GeoCityProperty) => {
          this.selectedCity = data;
          this.cities = this.cities.concat(this.prepareGeoCityPropertiesToCities([data]));
          this.applyCityOfUser();
        });
        this.service.getUsedSities().subscribe((data: GeoCityProperty[]) => {
          if(this.selectedCity != null && data.some(el => el.osm_id != this.selectedCity.osm_id)) {
            data.push(this.selectedCity);
          }

          this.cities = this.prepareGeoCityPropertiesToCities(data);
          this.applyCityOfUser();
        });
        Promise.resolve(null).then(el => {
          this.recCallForTopping(10);
        });
      }
    }
    this.recCallInitialParentCategoryId(10);
  }

  get isMobileMode() {
    return this.authService.isMobileMode();
  }

  getTooltipMobile(text: string) {
    if(!this.isMobileMode) {
      return;
    }

    this.dialog.open(MobileTooltipComponent, {
      width: '250px',
      maxHeight: '500px',
      data: text,
      backdropClass: 'backdropBackground',
      panelClass: 'panel_class_mob_tooltip'
    });
  }

  applyTask() {
    this.sessionStorage.set('create_content__saved_task', JSON.stringify(this.basedTask));
    this.tryApplyingTaskFromStorage(this.categories);
  }

  recCallInitialParentCategoryId(i: number) {
    if(i <= 0) {
      return;
    }

    setTimeout(() => {
      if(this.categories != null && this.categories.length != 0) {
        this.initialParentCategoryId();
      }
      else {
        this.recCallInitialParentCategoryId(--i);
      }
    }, 150);
  }

  recCallForTopping(i: number) {
    if(i <= 0) {
      return;
    }

    setTimeout(() => {
      if(this.categories != null && this.categories.length != 0) {
        this.toppingCategory.setValue(parseInt(this.selParentCategoryId));
        this.toppingChildCategory.setValue(parseInt(this.selCategoryId));
      }
      else {
        this.recCallForTopping(--i);
      }

    }, 150);
  }

  recCall(i: number) {
    if(i <= 0) {
      return;
    }

    setTimeout(() => {
      if(this.categories != null && this.categories.length != 0) {
        this.categories[0].folder ? this.onChangeChildCategory() : this.onChangeParentCategory();
      }
      else {
        this.recCall(--i);
      }
    }, 150);
  }

  getTransportCategoryMapper() {
    if(this.selCategory != null) {
      if(this.selCategory.availableTransportCategories != null
        && this.selCategory.availableTransportCategories.length != 0
      ) {
        return this.transportCategoryMapper.filter(
          el => this.selCategory.availableTransportCategories.includes(el.value)
        );
      }
      else {
        return this.transportCategoryMapper;
      }
    }
    else {
      return [];
    }
  }

  getWeightCategoryMapper() {
    if(this.selCategory != null) {
      if(this.selCategory.availableWeightCategories != null
        && this.selCategory.availableWeightCategories.length != 0
      ) {
        return this.weightCategoryMapper.filter(
          el => this.selCategory.availableWeightCategories.includes(el.value)
        );
      }
      else {
        return this.weightCategoryMapper;
      }
    }
    else {
      return [];
    }
  }

  getCategoryProductMapper() {
    if(this.selCategory != null) {
      if(this.selCategory.availableProductCategories != null
        && this.selCategory.availableProductCategories.length != 0
      ) {
        return this.productCategoryMapper.filter(
          el => this.selCategory.availableProductCategories.includes(el.value)
        );
      }
      else {
        return this.productCategoryMapper;
      }
    }
    else {
      return [];
    }
  }

  initialParentCategoryId() {
    const parentId = this.sessionStorage.get("сategory_Id");
    if(parentId != null) {
      this.selParentCategoryId = parentId;
      this.onChangeParentCategory()
      this.sessionStorage.remove("сategory_Id")

      const childId = this.sessionStorage.get("child_сategory_Id");
      if(childId != null) {
        setTimeout(() => {
          this.selCategoryId = childId;
          this.onChangeChildCategory();
          this.sessionStorage.remove("child_сategory_Id")
        }, 200);
      }
    }
  }

  isLegalEntityFull(): boolean {
    return this.authService.LoggedUser.authorities == null ? false : this.authService.isLegalEntityFull();
  }

  isBadPartner(): boolean {
    return this.authService.LoggedUser.authorities == null ? false : this.authService.isBadPartner();
  }

  isDisableRole(role: ROLE): boolean {
    return !this.task.isRegularPayoutType() && role == ROLE.LEGAL_ENTITY_FULL;
  }

  isCoordinateProp(): boolean {
    const res = this.task.properties.some((el: BaseTaskProperty) => el.refProperty.type == TypeCategoryProperty.COORDINATE ? true : false)
    return res;
  }

  isNotEmptyPoints(): boolean {
    const mapProps = this.task.properties.filter(el => el instanceof MapTaskProperty);
    if(mapProps.length != 0) {
      //@ts-ignore
      const mapProp: MapTaskProperty = mapProps[0];
      if(mapProp.points.length != 0) {
        return true;
      }
    }

    return false;
  }

  disabledModeTaskPerformer(): boolean {
    return this.isUpdateTaskMode() && this.modeTaskPerformerMapper.map(el => {return el.value}).includes(ModeTaskPerformer.URGENTLY);
  }

  selectVisibleRole(event) {
    if(!event._selected && event.value == ROLE.LEGAL_ENTITY_FULL && !this.isLegalEntityFull() && this.task.payoutType == CategoryPropertyPayoutTypes.REGULAR_ACCOUNT) {
      this.task.payoutType = CategoryPropertyPayoutTypes.REGULAR_NOT_PRINCIPAL;
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

  refreshCitiesCandidates() {
    if(this.partCityName != null && this.partCityName != '') {
      this.geoService.geocodeCitiesByPartOfName(this.partCityName).subscribe((resp: GeoCityResponse) => {
        this.geoCityResponse = resp;
        this.cities = GeoCityResponse.prepareGeoCityFeaturesToCities(this.geoCityResponse.features);
      });
    }
  }

  refreshAddressCandidates() {
    if(this.partAddrName != null && this.partAddrName != '') {
      const mapProp = this.task.category.getMapCategoryProperty();
      const useCityArea = this.selectedCity != null && mapProp != null && mapProp.useCityArea;
      this.geoService.geocodeAddressByPartOfName(this.partAddrName, this.selectedCity, useCityArea).subscribe((resp: GeoCityResponse) => {
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

  onChangeCity(event) {
    if(this.partCityName != event.target.value) {
      this.partCityName = event.target.value;
      this.refreshCitiesCandidates();
    }
  }

  onChooseCity(event) {
    this.setMapToCenterOfChoosenCity();
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

  onChooseAddress(event) {}

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

  deleteAddress(point) {
    const mapProps = this.task.properties.filter(el => el instanceof MapTaskProperty);
    if(mapProps != null && mapProps.length != 0) {
      //@ts-ignore
      const mapProp: MapTaskProperty = mapProps[0];
      mapProp.points = point.index ? mapProp.points.filter(el => el.index != point.index) : mapProp.points.filter(el => el.id != point.id);
      this.mapComponent.onChangePoints();
    }
  }

  goToPoint(point: MapTaskPropertyPoint) {
    this.mapComponent.setMapCenter(parseFloat(point.lon),
      parseFloat(point.lat)
    );
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

  refreshAddressCandidatesPoint(point: MapTaskPropertyPoint) {
    if(this.partAddrName != null && this.partAddrName != '') {
      const mapProp = this.task.category.getMapCategoryProperty();
      const useCityArea = this.selectedCity != null && mapProp != null && mapProp.useCityArea;
      this.geoService.geocodeAddressByPartOfName(this.partAddrName, this.selectedCity, useCityArea).subscribe((resp: GeoCityResponse) => {
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

  isShowPassenger(taskProp) {
    if(taskProp.refProperty.showPassengerOption) {
      taskProp.passengerCount = 1;
    }

    return taskProp.refProperty.showPassengerOption;
  }

  changeAdress(point: MapTaskPropertyPoint) {
    const cityProp: GeoCityProperty =  point.geoCityPropertyAddr;
    const mapProps = this.task.properties.filter(el => el instanceof MapTaskProperty);
    if(mapProps != null && mapProps.length != 0) {
      //@ts-ignore
      const mapProp: MapTaskProperty = mapProps[0];
      mapProp.points = mapProp.points.filter(el => el.index != point.index);

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

      mapProp.points.push(point);

      if(mapProp.refProperty.type == TypeCategoryProperty.COORDINATE_PATH) {
        this.mapComponent.changeOldPoint(point);
      }
      else if(mapProp.refProperty.type == TypeCategoryProperty.COORDINATE){
        this.mapComponent.onChangePoints();
      }
    }
  }

  addAddress(cityProp: GeoCityProperty) {
    this.addAddressMode = false;
    const mapProps = this.task.properties.filter(el => el instanceof MapTaskProperty);
    if(mapProps != null && mapProps.length != 0) {
      //@ts-ignore
      const mapProp: MapTaskProperty = mapProps[0];
      const point: MapTaskPropertyPoint = new MapTaskPropertyPoint();
      point.addr = this.selectedAddr.getDisplayAddrName();

      let index = 0, counter = 0;
      if(mapProp.points != null && mapProp.points.length != 0) {
        const lastAddr: MapTaskPropertyPoint = mapProp.points.reduce(
          (prev: MapTaskPropertyPoint, cur: MapTaskPropertyPoint) => {
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
      if(mapProp.refProperty.type == TypeCategoryProperty.COORDINATE) {
        point.pointType = PointType.POINT;
      }
      else {
        if(mapProp.points.length == 0) {
          point.pointType = PointType.START;
        }
        else {
          if(mapProp.points.length > 1) {
            mapProp.points.forEach(el => {
              if(el.pointType == PointType.END) {
                el.pointType = PointType.INTERMEDIATE;
              }
            });
          }
          point.pointType = PointType.END;
        }
      }

      mapProp.points.push(point);
      this.mapComponent.onChangePoints();
    }
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

  setMapToCenterOfPoints(mapProp: MapTaskProperty) {
    if(mapProp == null || mapProp.points.length == 0){
      return;
    }

    const points = MapTaskProperty.setMapToCenterOfPoints(mapProp);
    if(this.mapComponent != null) {
      this.mapComponent.setMapCenter(points[0], points[1]);
    }
    setTimeout(() => {
      if(this.mapComponent != null) {
        this.mapComponent.setMapCenter(points[0], points[1]);
      }
    }, 300);
  }

  setAddressByPoint(mapProp) {
    mapProp.points.forEach(point => this.geocodePlace(point, mapProp, false));
  }

  setCentreByLocationPosition() {
  }

  ngOnChanges() {
    //this.debugSelectTestCat();
  }

  childCategoriesNotEmpty(): boolean {
    return this.childCategories != null && this.childCategories.length != 0;
  }

  debugSelectTestCat() {
    const testCatName = 'Категория 2.2.1 LONG_STRING COORDINATE_PATH DATETIME_INTERVAL category TS, weightProduct';
    //const testCatName = 'Категория 1 STRING COORDINATE DATE';
    /*
    this.selCategory = this.categories.filter(el => el.name == testCatName).length != 0
      ? this.categories.filter(el => el.name == testCatName)[0]
      : null;*/

    if(this.selCategory != null) {
      this.selParentCategoryId = '' + this.selCategory.id;
      this.onChangeParentCategory();
    }
  }

  sortById(categories: Category[]) {
    return categories.sort((a: Category, b: Category) =>
      (a.order > b.order) ? 1
      : (a.order === b.order) ? 0
      : -1
    );
  }

  changeLocationType(taskProp: MapTaskProperty) {
    Promise.resolve(null).then(el => {
      taskProp.points = [];
      if(this.mapComponent != null) {
        this.mapComponent.onChangePoints();
      }
      if(this.selectedCity != null) {
        if(this.selectedCity.extent.length == 4) {
          this.setMapCenter((this.selectedCity.extent[0] + this.selectedCity.extent[2]) / 2 ,
            (this.selectedCity.extent[1] + this.selectedCity.extent[3]) / 2,
            5
          );
        }
        else {
          this.setMapCenter(this.selectedCity.extent[0], this.selectedCity.extent[1], 5);
        }
      }
    });
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

  tryApplyingTaskFromStorage(categories: Category[]) {
    const savedTask = this.sessionStorage.get('create_content__saved_task');
    if(savedTask != null && savedTask != '') {
      const restoredTask: Task = Task.convertToObj(JSON.parse(savedTask));
      this.sessionStorage.remove('create_content__saved_task');
      if(restoredTask.status != TaskStatus.PUBLISHED &&
        restoredTask.status != TaskStatus.HIDE
      ) {
        restoredTask.status = TaskStatus.PUBLISHED;
      }

      if(restoredTask.category.root == null) {
        this.selParentCategoryId = restoredTask.category.id + '';
        this.selCategoryId = this.selParentCategoryId;
        this.selCategory = restoredTask.category;

        this.toppingCategory.setValue(this.selCategoryId);
      }
      else {
        this.selParentCategoryId = restoredTask.category.root.id + '';
        this.selCategoryId = restoredTask.category.id + '';
        const rootSelCategory = categories.filter(el => el.id == restoredTask.category.root.id)[0];
        this.selCategory = rootSelCategory.children.filter(el => el.id == restoredTask.category.id)[0];
        this.childCategories = rootSelCategory.children;

        setTimeout(
          () => {
            this.toppingCategory.setValue(rootSelCategory.id);
            this.toppingChildCategory.setValue(parseInt(this.selCategoryId));
          },
          100
        );
      }

      this.task = restoredTask;

      if(this.task.visibleByRoles.length == 0) {
        if(this.task.payoutType == CategoryPropertyPayoutTypes.SECURE) {
          this.task.visibleByRoles = [ROLE.PERFORMER];
        }
        else {
          this.task.visibleByRoles = [ROLE.PERFORMER, ROLE.LEGAL_ENTITY_FULL];
        }
      }

      //this.cities = this.prepareGeoCityPropertiesToCities(data);
      if(this.task.city != null) {
        this.cities = this.prepareGeoCityPropertiesToCities([GeoCityProperty.convertToObj(this.task.city, null)]);
        setTimeout(
          () => {
            this.selectedCity = this.task.city;
          },
          100
        );
      }

      this.selectedCity = this.task.city;
      if(this.selCategory.fast) {
        this.modeTaskPerformerMapper = FAST_MODE_TASK_PERFORMER_MAPPER;
        this.hintModeTaskPerformer = HINTS.modeFastTaskPerformer;
      }
      else {
        this.modeTaskPerformerMapper = MODE_TASK_PERFORMER_MAPPER;
        this.hintModeTaskPerformer = HINTS.modeTaskPerformer;
      }

      const mapProp = this.task.getMapTaskProperty();

      this.choosePayoutTypes();

      if (this.task.id != null) {
        this.setMapToCenterOfPoints(mapProp);
      }
      else {
        this.setMapToCenterOfChoosenCity();
      }

      if(mapProp != null) {
        this.setAddressByPoint(mapProp);
      }
    }
  }

  fileChanged(event) {
    if(event != null) {
      const fd = new FormData();
      fd.append('image', event, event.name);

      if(this.task.id == null) {
        const doc = new TaskDoc(fd, event.name,  this.task.docs.length + 1);
        this.task.docs.push(doc);
      }
      else {
        this.eventProgress = 0;
        this.isUploadFileUpdate = true;
        this.service.saveDoc(fd, this.task.id).subscribe(
          (event: HttpEvent<any>) => {
            this.httpResponseHandler(event);

            if(event.type == HttpEventType.Response) {
              this.isUploadFileUpdate = false;
              this.getAllTaskDocs();
            }
          }
        );
      }

    }
  }

  deleteDoc(doc) {
    if(this.task.id == null) {
      this.task.docs = this.task.docs.filter(doc => doc.order != doc.order);
    }
    else {
      this.service.deleteDoc(doc.id).subscribe(el => {
        this.getAllTaskDocs();
      });
    }
  }

  choosePayoutTypes() {
    if(!this.isUpdateTaskMode()) {
      if(this.task.category.availablePayoutTypes.includes(CategoryPropertyPayoutTypes.SECURE)) {
        this.task.payoutType = CategoryPropertyPayoutTypes.SECURE;
        this.chooseGlobalPayoutTypeByType(this.task.payoutType);
        this.task.visibleByRoles = [ROLE.PERFORMER];
      }
      else {
        this.task.payoutType = CategoryPropertyPayoutTypes.REGULAR;
        this.chooseGlobalPayoutTypeByType(this.task.payoutType);
        this.task.visibleByRoles = [ROLE.PERFORMER, ROLE.LEGAL_ENTITY_FULL];
      }
    }
    else {
      if(this.task.payoutType == CategoryPropertyPayoutTypes.SECURE) {
        this.chooseGlobalPayoutTypeByType(this.task.payoutType);
      }
      else {
        this.chooseGlobalPayoutTypeByType(this.task.payoutType);
      }
    }
  }

  onChangeParentCategory() {
    if(this.selParentCategoryId != null && this.selParentCategoryId != '') {
      this.toppingCategory.setValue(parseInt(this.selParentCategoryId));
      const selCategory = this.categories.filter(el => el.id == parseInt(this.selParentCategoryId))[0];
      if(selCategory.folder) {
        this.childCategories = selCategory.children;

        this.selCategory = null;
        this.selCategoryId = null;
        this.task = null;

        return;
      }

      this.childCategories = null;
      this.createTaskBasedOnCategory(selCategory);
      if(selCategory.fast) {
        this.modeTaskPerformerMapper = FAST_MODE_TASK_PERFORMER_MAPPER;
        this.hintModeTaskPerformer = HINTS.modeFastTaskPerformer;
      }
      else {
        this.modeTaskPerformerMapper = MODE_TASK_PERFORMER_MAPPER;
        this.hintModeTaskPerformer = HINTS.modeTaskPerformer;
      }

      //TYPE_CATEGORY_MAP_SECTION
      /*this.selCategory.properties = this.selCategory.properties.filter((prop: BaseCategoryProperty) => {
        return TYPE_CATEGORY_DATE_SECTION.includes(prop.type);
      });*/
    }
  }

  getTooltip(categoty: Category): string {
    return categoty.fast ? this.hintFastTask : this.hintModeTaskPerformer;
  }

  onChangeChildCategory() {
    if(this.selCategoryId != null && this.selCategoryId != '') {
      this.chooseCategoryEvent.emit(parseInt(this.selParentCategoryId));
      this.toppingChildCategory.setValue(parseInt(this.selCategoryId));

      if(this.childCategories != null) {
        const selCategory = this.childCategories.filter(el => el.id == parseInt(this.selCategoryId))[0];
        this.createTaskBasedOnCategory(selCategory);

        if(selCategory.fast) {
          this.modeTaskPerformerMapper = FAST_MODE_TASK_PERFORMER_MAPPER;
          this.hintModeTaskPerformer = HINTS.modeFastTaskPerformer;
        }
        else {
          this.modeTaskPerformerMapper = MODE_TASK_PERFORMER_MAPPER;
          this.hintModeTaskPerformer = HINTS.modeTaskPerformer;
        }
      }
    }
  }

  createTaskBasedOnCategory(selCategory: Category) {
    this.task = Task.createTaskBasedOnCategory(selCategory);

    this.task.getEmailAboutNewSuggestion = !this.isAdmin ? true : false;
    this.task.userInfo = this.userInfo;
    this.choosePayoutTypes();
    const mapProps: BaseTaskProperty[] = this.task.properties.filter((taskProp: BaseTaskProperty) =>
      TYPE_CATEGORY_MAP_SECTION.includes(taskProp.refProperty.type)
    );

    if(mapProps.length != 0) {
      const mapProp: MapTaskProperty = <MapTaskProperty>mapProps[0];
      mapProp.transportCategory = null;
      mapProp.weightCategory = null;
      mapProp.porterCount = 0;
      if(mapProp.refProperty.type == TypeCategoryProperty.COORDINATE) {
        mapProp.locationType = defaultLocationType;
      }
      else if(mapProp.refProperty.type == TypeCategoryProperty.COORDINATE_PATH) {
      }
    }

    this.task.status = TaskStatus.PUBLISHED;
    this.selCategory = selCategory;
    this.setMapToCenterOfChoosenCity();
  }

  chooseGlobalPayoutTypeByType(type: CategoryPropertyPayoutTypes) {
    Promise.resolve(null).then(el => {
      setTimeout(() => {
        if(!this.isUpdateTaskMode()) {
          if(!this.isLegalEntityFull()) {
            // @ts-ignore
            document.querySelectorAll('#globalAvailablePayoutTypeContainer #' + type)[0].checked = true;
          }
          else {
            // @ts-ignore
            document.querySelector('#globalAvailablePayoutTypeContainer #' + CategoryPropertyPayoutTypes.REGULAR).click();
          }
        }
        else {
          if(this.task.payoutType == CategoryPropertyPayoutTypes.SECURE) {
            // @ts-ignore
            document.querySelectorAll('#globalAvailablePayoutTypeContainer #' + type)[0].checked = true;
          }
          else {
            // @ts-ignore
            document.querySelector('#globalAvailablePayoutTypeContainer #' + CategoryPropertyPayoutTypes.REGULAR).click();
          }
        }

      }, 500);
    });
  }

  disabledRegularAccount(type): boolean {
    if(type.value == CategoryPropertyPayoutTypes.REGULAR_ACCOUNT && !this.isLegalEntityFull() && !this.task.visibleByRoles.includes(ROLE.LEGAL_ENTITY_FULL)) {
      return true;
    }

    return false;
  }

  getMapMode(prop: MapCategoryProperty) {
    switch(prop.type) {
      case TypeCategoryProperty.COORDINATE:
        return MapMode.ADD_POINT;
      case TypeCategoryProperty.COORDINATE_PATH:
        return MapMode.ADD_PATH;
    }
  }

  updateAddressHandler(point: MapTaskPropertyPoint) {

    if(this.isUpdateTaskMode()) {
      return;
    }

    this.task.properties.forEach(el => {
      if(TYPE_CATEGORY_MAP_SECTION.includes(el.refProperty.type)) {
        const prop = (<MapTaskProperty>el);

        const elems = prop.points.filter(el => el.index == point.index);
        if(elems == null || elems.length == 0) {
          return;
        }

        const changedPoint = elems[0];
        changedPoint.lat = point.lat;
        changedPoint.lon = point.lon;
        this.geocodePlace(changedPoint, prop, false);
      }
    });

  }

  addAddressHandler(point: MapTaskPropertyPoint) {

    if(this.isUpdateTaskMode()) {
      return;
    }

    this.task.properties.forEach(el => {
      if(TYPE_CATEGORY_MAP_SECTION.includes(el.refProperty.type)) {
        const prop = (<MapTaskProperty>el);
        if(point.pointType == PointType.END) {
          prop.points.filter(p => p.pointType == PointType.END)
            .forEach(oldEndPoint => {
              oldEndPoint.pointType = PointType.INTERMEDIATE;
            }
          );
        }
        this.geocodePlace(point, prop, true);
      }
    });
  }

  setGeoCityPropertyAddr(point, prop, isAdd, obj) {
    const mapProp = this.task.category.getMapCategoryProperty();
    const useCityArea = this.selectedCity != null && mapProp != null && mapProp.useCityArea;
    this.geoService.geocodeAddressByPartOfName(`${obj.address.state} ${obj.address.road} ${obj.address.house_number ? obj.address.house_number : obj.address.neighbourhood}`,
     this.selectedCity, useCityArea).subscribe((resp: GeoCityResponse) => {
      if(resp.features.length != 0) {
        point.selectedItems  = this.prepareGeoAddrFeaturesToAddr(resp.features, point.addr);
        point.selectedItems = point.selectedItems.filter(el => el.value.postcode == obj.address.postcode);
        const addres =  point.selectedItems.find(el => el.value.osm_id == obj.osm_id);
        point.geoCityPropertyAddr = addres != null ? addres.value : point.selectedItems[0].value;
        if(isAdd) {
          prop.points.push(point);
        }
      }
    });
  }

  geocodePlace(point: MapTaskPropertyPoint, prop, isAdd) {
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

      this.setGeoCityPropertyAddr(point, prop, isAdd, obj);
    });
  }

  showRouteInfoHandler(pathWrapper: PathWrapper) {
    if(pathWrapper == null) {
      this.isShowDistance = false;
    }
    else {
      this.isShowDistance = true;
      this.distance = Math.round(pathWrapper.distance);
    }
  }

  changeAddressHandler(changePoint: MapTaskPropertyPoint) {
    this.task.properties.forEach(el => {
      if(TYPE_CATEGORY_MAP_SECTION.includes(el.refProperty.type)) {
        (<MapTaskProperty>el).points.every((point: MapTaskPropertyPoint) => {
          if(point.index == changePoint.index) {
            point.lat = changePoint.lat;
            point.lon = changePoint.lon;
            point.addr = changePoint.addr;
            point.order = changePoint.order;

            return false;
          }
          return true;
        });
      }
    });
  }

  pathRefreshedHandler(event) {
    // if(event == 1) {
    //   this.task.getMapTaskProperty().notValidPath = false;
    //   this.payCalc();
    // }
    // else {
    //   this.task.getMapTaskProperty().notValidPath = true;
    // }

    this.payCalc();

  }

  isUpdateTaskMode(): boolean {
    return this.task != null ? this.task.id != null : false;
  }

  applyHourMessage() {
    if(this.task.isBuildPath() && this.task.allowPayBasedOnHour()) {
      const taskProp: MapTaskProperty = this.task.getMapTaskProperty();
      if(taskProp != null) {
        const startPoint: MapTaskPropertyPoint = taskProp.getStartPoint();
        if(startPoint != null) {
          this.service.getMessageForMinHour(startPoint).subscribe((regionalHourCost: RegionalHourCost) => {
            this.hourMessage = regionalHourCost != null ? regionalHourCost.message : null;
          })
          return;
        }
      }
    }

    this.hourMessage = null;
  }

  onChangePayable() {
    this.payCalc();
  }

  isMapAvailableToLocationStatus(taskProp: MapTaskProperty): boolean {
    return this.isMapAvailableForLocationTypes.includes(taskProp.locationType) //|| this.isMapAvailableForLocationTypes.includes(taskProp);
  }

  isAnyonePath(): boolean {
    const res = this.task.properties.some((el: BaseTaskProperty) => {
      if(el.refProperty.type == TypeCategoryProperty.COORDINATE_PATH) {
        return true;
      }
      return false;
    })
    return res;
  }

  getMapper(type: CategoryPropertyPayoutTypes): string {
    return CATEGORY_PROPERTY_PAYOUT_TYPES_MAPPER.filter(el => type == el.value)[0].viewValue;
  }

  getPreparedAvailablePayoutTypes(availablePayoutTypes: CategoryPropertyPayoutTypes[]): ICategoryPropertyPayoutTypesMapper[] {
    let mappers: ICategoryPropertyPayoutTypesMapper[] = [];

    if(!this.isUpdateTaskMode()) {
      if(availablePayoutTypes.includes(CategoryPropertyPayoutTypes.SECURE) && !this.isLegalEntityFull()) {
        mappers.push(GLOBAL_CATEGORY_PROPERTY_PAYOUT_TYPES_MAPPER.filter(el => CategoryPropertyPayoutTypes.SECURE == el.value)[0]);
      }

      if(availablePayoutTypes.filter(type => REGULAR_PAYOUT_TYPES.includes(type)).length != 0) {
        mappers.push(GLOBAL_CATEGORY_PROPERTY_PAYOUT_TYPES_MAPPER.filter(el => CategoryPropertyPayoutTypes.REGULAR == el.value)[0]);
      }
    }
    else {
      if(this.task.payoutType == CategoryPropertyPayoutTypes.SECURE) {
        mappers.push(GLOBAL_CATEGORY_PROPERTY_PAYOUT_TYPES_MAPPER.filter(el => CategoryPropertyPayoutTypes.SECURE == el.value)[0]);
      }
      else {
        mappers.push(GLOBAL_CATEGORY_PROPERTY_PAYOUT_TYPES_MAPPER.filter(el => CategoryPropertyPayoutTypes.REGULAR == el.value)[0]);
      }
    }

    return mappers;
  }

  getPreparedAvailableLocationTypes(availableLocationTypes: LocationType[]) {
    let mappers: ILocationTypeMapper[] = [];

    mappers = !this.isUpdateTaskMode() ? this.locationTypeMapper.filter(el => availableLocationTypes.includes(el.value))
      : this.locationTypeMapper.filter(el => this.task.getMapTaskProperty().locationType.includes(el.value));

    return mappers;
  }

  onPayoutSelect(type: CategoryPropertyPayoutTypes) {
    let roles = [];
    if(type != CategoryPropertyPayoutTypes.REGULAR) {
      this.task.payoutType = type;
      roles = [ROLE.PERFORMER];
    }
    else {
      this.task.payoutType = CategoryPropertyPayoutTypes.REGULAR_NOT_PRINCIPAL;
      roles = [ROLE.PERFORMER, ROLE.LEGAL_ENTITY_FULL];
    }

    if(!this.isUpdateTaskMode()) {
      this.task.visibleByRoles = roles;
    }
  }

  onChangeReadyToPay() {
    this.service.payCalc(this.task).subscribe((paymentCalc: PaymentCalc) => {
      this.task.commission = paymentCalc.commission;
    });
  }

  payCalc() {
    this.applyHourMessage();
    if(!this.task.isAllowToPayCalc() || !this.task.isNotEmptyMapFieldsForCalcPay()) {
      return;
    }

    this.isCalculated = false;
    this.service.payCalc(this.task).subscribe((paymentCalc: PaymentCalc) => {
      this.isCalculated = true;
      this.task.readyToPay = paymentCalc.calcPay;
      this.task.commission = paymentCalc.commission;
    });
  }

  isSecurePayout(): boolean {
    return this.task.payoutType == CategoryPropertyPayoutTypes.SECURE;
  }

  isStatusNotVerify(): boolean {
    return this.authService.isStatusNotVerify();
  }

  handleTaskCreationError(error: any) {
    this.task.isError = true;
    this.task.errors = error.errors;
  }

  createTask() {
    this.task.userInfo = this.userInfo;

    if(this.authService.LoggedUser.authenticated == null || this.authService.LoggedUser.authenticated == false) {
      this.checkAuth();
      return;
    }

    if(this.task.userInfo.phoneNumber == "") {
      this.task.userInfo.phoneNumber = null;
    }

    if(this.task.userInfo.phoneNumber != null) {
      if(this.isStatusNotVerify()) {
        this.openDialogVerificationRequest();
      }
      else if(this.oldPhoneNumber != this.task.userInfo.phoneNumber) {
        this.openDialogVerificationRequest();
      }
      else {
        this.continueCreateTask();
      }
    }
    else if(this.isStatusNotVerify()) {
      this.errorStatusNotVerify = true;
      return;
    }
    else {
      this.continueCreateTask();
    }
  }

  openDialogVerificationRequest() {
    const dialogRef = this.dialog.open(VerificationRequestComponent, {
      width: '850px',
      data: this.task.userInfo
    });
    dialogRef.afterClosed().subscribe((data: ShortUserInfo) => {
      if(data != undefined && data.verificationToken != null) {
        this.continueCreateTask();
      }
    });
  }

  getAllTaskDocs() {
    this.service.getTaskDocs(this.task.id).subscribe(data => {
      this.task.docs = data;
    });
  }

  checkAuth() {
    const dialogRef = this.dialog.open(RegistrationNotComponent, {
      width: '850px',
      data: "Чтобы действовать в качестве заказчика или исполнителя просим вас зарегистрироваться или пройти авторизацию (если у вас уже существует аккаунт)"
    });
    dialogRef.afterClosed().subscribe((data: any) => {
      if(data != null) {
        this.task.city = this.selectedCity;
        this.task.prepareBeforeSave();
        this.sessionStorage.set('create_content__saved_task', JSON.stringify(this.task));
        this.sessionStorage.set(AuthService.backUrlName, ActiveUrls.NEW_TASK);
        this.router.navigateByUrl(ActiveUrls.LOGIN);
      }
    });
  }

  continueCreateTask() {
    this.isDisabledBtn = true;
    this.task.isError = false;
    this.task.city = this.selectedCity;

    this.service.addTask(this.task).subscribe((data: any) => {
      this.isDisabledBtn = false;
      if(data == null) {
        return;
      }

      if(data.ok != null && data.ok == false) {
        this.handleTaskCreationError(data.error);
        return;
      }

      if(data.blocked) {
        return this.authService.logout();
      }

      if(data.blockedPartner) {
        return this.authService.updateRolesForBlocking([ROLE.BAD_PARTNER]);
      }

      this.sessionStorage.set(Task.TASK_FIRST_OPEN, true);
      this.sessionStorage.remove('create_content__saved_task');

      if(data.statusUser != null) {
        this.authService.updateStatus(data.statusUser)
      }

      this.addAllAttachments(0, data);
    });
  }

  completionCreateTask(data) {
    if(this.task.payoutType == CategoryPropertyPayoutTypes.SECURE) {
      const dialogRef = this.dialog.open(ChoosePayToolComponent, {
        width: '450px',
        data: data,
        disableClose: true
      });

      dialogRef.afterClosed().subscribe((res) => {
        if(res != null) {
          this.router.navigate([`/user/${this.authService.getCurrentId}/my-tasks/${data.id}`]);
        }
      });
    }
    else {
      this.router.navigate([`/user/${this.authService.getCurrentId}/my-tasks/${data.id}`]);
    }
  }

  addAllAttachments(i, data) {
    if(this.task.images != null && this.task.images.length != 0) {
      const image = this.task.images[i];
      if(image != null) {
        this.service.updatePartnerImageCross(image.croppedImg.file, this.authService.getCurrentId, data.id, image).subscribe(el => {
          if(this.task.images[this.task.images.length - 1].order == image.order) {
            this.addAllDocs(0, data)
          }
          else {
            this.addAllAttachments(++i, data);
          }
        });
      }
    }
    else {
      this.addAllDocs(0, data);
    }
  }

  addAllDocs(i, data) {
    if(this.task.docs != null && this.task.docs.length != 0) {
      const doc = this.task.docs[i];
      if(doc != null) {
        this.service.saveDocCross(doc.file, data.id).subscribe(el => {
          if(this.task.docs[this.task.docs.length - 1].order == doc.order) {
            this.completionCreateTask(data);
          }
          else {
            this.addAllDocs(++i, data);
          }
        });
      }
    }
    else {
      this.completionCreateTask(data);
    }
  }

  private httpResponseHandler(event) {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        if (event.total) {
          this.eventProgress = Math.round((event.loaded / event.total) * 100);
        }
        break;
      case HttpEventType.Response:
        this.eventProgress = 100;
    }
  }
}
