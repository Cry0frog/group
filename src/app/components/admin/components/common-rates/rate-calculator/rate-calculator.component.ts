import { CalcMode } from './../../../../../models/category/constructor/map/calcMode';
import { PRODUCT_CATEGORY_MAPPER, WEIGHT_CATEGORY_MAPPER, TRANSPORT_CATEGORY_MAPPER, CALC_MODE_SHORT_MAPPER } from './../../../../../common/task.description';
import { RU_CALENDAR } from './../../../../../common/localization';
import { RateService } from './../../../service/rate.service';
import { Offset } from 'src/app/common/offset';
import { SelectItem } from 'primeng/api/selectitem';
import { AdminService } from './../../../service/admin.service';
import { GeoCityResponse } from 'src/app/models/map/geo/city/geoCityResponse';
import { GeoService } from 'src/app/services/geo.service';
import { RatesCheck } from './../../../../../models/rates/RatesCheck';
import { GeoCityProperty } from 'src/app/models/map/geo/city/geoCityProperty';
import { PaymentCalc } from './../../../../../models/payment/paymentCalc';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rate-calculator',
  templateUrl: './rate-calculator.component.html',
  styleUrls: ['./rate-calculator.component.css']
})
export class RateCalculatorComponent implements OnInit {
  calc: PaymentCalc;
  selectedCity: GeoCityProperty;
  ratesCheck: RatesCheck;
  geoCityResponse: GeoCityResponse;

  ru_calendar = RU_CALENDAR;
  partCityName: string;
  cities: SelectItem[];

  transportCategoryMapper = TRANSPORT_CATEGORY_MAPPER;
  weightCategoryMapper = WEIGHT_CATEGORY_MAPPER;
  productCategoryMapper = PRODUCT_CATEGORY_MAPPER;
  calcModeMapper = CALC_MODE_SHORT_MAPPER;
  calcMode = CalcMode;

  constructor(private geoService: GeoService,
    private adminService: AdminService,
    private rateService: RateService
  ) {
    this.ratesCheck = new RatesCheck();
    this.ratesCheck.calcMode = CalcMode.BASED_ON_METER;
    this.ratesCheck.distance = null;
    this.cities = [];
  }

  ngOnInit() {
    this.reloadAllUsedCities();
  }

  reloadAllUsedCities() {
    this.adminService.getUsedSities().subscribe((data: GeoCityProperty[]) => {
      this.cities = data.map((city: GeoCityProperty) => {
        return {
          label: city.getDisplayName(),
          value: city
        }
      });
    });
  }

  isCannotCalc(): boolean {
    return this.ratesCheck.hour == null && this.ratesCheck.distance == null;
  }

  checkCalc() {
    if(this.isCannotCalc()) {
      return;
    }

    if(this.selectedCity != null && this.selectedCity.osm_id != null) {
      //@ts-ignore
      this.ratesCheck.osmId = this.selectedCity.osm_id;

      if(this.selectedCity.extent.length == 4) {
        this.ratesCheck.lon = (this.selectedCity.extent[0] + this.selectedCity.extent[2]) / 2;
        this.ratesCheck.lat = (this.selectedCity.extent[1] + this.selectedCity.extent[3]) / 2;
      }
      else {
        this.ratesCheck.lon = this.selectedCity.extent[0];
        this.ratesCheck.lat = this.selectedCity.extent[1];
      }

    }
    this.ratesCheck.offset = Offset.getCurTimeZone();
    this.rateService.checkPayCalc(this.ratesCheck).subscribe((calc: PaymentCalc) => {
      this.calc = calc;
    })
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

  onCalcModeChange() {
    this.ratesCheck.distance = null;
    this.ratesCheck.hour = null;
  }
}
