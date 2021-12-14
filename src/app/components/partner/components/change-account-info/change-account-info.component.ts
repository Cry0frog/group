import { GeoService } from './../../../../services/geo.service';
import { GeoCityFeature } from './../../../../models/map/geo/city/geoCityFeature';
import { PartnerInfoWithCity } from './../../../../models/partnerInfo/partnerInfoWithCity';
import { GeoCityProperty } from './../../../../models/map/geo/city/geoCityProperty';
import { GeoCityResponse } from './../../../../models/map/geo/city/geoCityResponse';
import { SelectItem } from 'primeng/api/selectitem';
import { Component, OnInit, Input } from '@angular/core';
import { PartnerService } from '../../service/partner.service';

@Component({
  selector: 'app-change-account-info',
  templateUrl: './change-account-info.component.html',
  styleUrls: ['./change-account-info.component.css']
})
export class ChangeAccountInfoComponent implements OnInit {

  @Input() dataPartnerInfo: PartnerInfoWithCity;
  @Input() isEditProfileInfo: boolean;

  partCityName: string;
  cities: SelectItem[];
  geoCityResponse: GeoCityResponse;
  cityProperty: GeoCityProperty;

  constructor(private partnerService: PartnerService,
    private geoService: GeoService,
  ) {
    this.partCityName = '';
    this.cities = [];
    this.geoCityResponse = null;
  }

  ngOnInit() {
    this.partnerService.getUsedSities().subscribe((data: GeoCityProperty[]) => {
      this.cities = data.map(el => ({ label: el.name, value: el }));
      const citiesFilter = this.cities.filter(el => el.value.osm_id == this.dataPartnerInfo.cityProperty.osm_id);
      if(citiesFilter.length != 0) {
        const id = this.dataPartnerInfo.cityProperty.id;
        this.dataPartnerInfo.cityProperty = citiesFilter[0].value;
        this.dataPartnerInfo.cityProperty.id = id;
      }
      else {
        this.cities = [{ label: this.dataPartnerInfo.cityProperty.name, value: this.dataPartnerInfo.cityProperty }];
      }
    });
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

  onChangeCity(event) {
    if(this.partCityName != event.target.value) {
      this.partCityName = event.target.value;
      this.refreshCitiesCandidates();
    }
  }
}
