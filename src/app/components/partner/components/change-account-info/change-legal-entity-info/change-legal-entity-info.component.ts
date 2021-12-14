import { GeoCityFeature } from 'src/app/models/map/geo/city/geoCityFeature';
import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { GeoService } from 'src/app/services/geo.service';
import { GeoCityProperty } from 'src/app/models/map/geo/city/geoCityProperty';
import { GeoCityResponse } from 'src/app/models/map/geo/city/geoCityResponse';
import { SelectItem } from 'primeng/api';
import { LegalEntityInfo } from 'src/app/models/legal-entity-info/legalEntityInfo';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-legal-entity-info',
  templateUrl: './change-legal-entity-info.component.html',
  styleUrls: ['./change-legal-entity-info.component.css']
})
export class ChangeLegalEntityInfoComponent implements OnInit {
  partCityName: string;
  cities: SelectItem[];
  geoCityResponse: GeoCityResponse;
  cityProperty: GeoCityProperty;

  @Input() data: LegalEntityInfo;
  @Input() isEditProfileInfo: boolean;

  constructor(private geoService: GeoService,
    private partnerService: PartnerService) {
      this.partCityName = '';
      this.cities = [];
      this.geoCityResponse = null;
    }

  ngOnInit() {
    this.partnerService.getUsedSities().subscribe((data: GeoCityProperty[]) => {
      this.cities = data.map(el => ({ label: el.name, value: el }));
      const citiesFilter = this.cities.filter(el => el.value.osm_id == this.data.city.osm_id);
      if(citiesFilter.length != 0) {
        const id = this.data.city.id;
        this.data.city = citiesFilter[0].value;
        this.data.city.id = id;
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
