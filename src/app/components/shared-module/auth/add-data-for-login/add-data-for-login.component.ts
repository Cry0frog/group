import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FailedRegistrationData } from 'src/app/models/common/failedRegistrationData';
import { SelectItem } from 'primeng/api/selectitem';
import { GeoCityResponse } from 'src/app/models/map/geo/city/geoCityResponse';
import { GeoCityProperty } from 'src/app/models/map/geo/city/geoCityProperty';
import { GeoService } from 'src/app/services/geo.service';
import { GeoCityFeature } from 'src/app/models/map/geo/city/geoCityFeature';

@Component({
  selector: 'app-add-data-for-login',
  templateUrl: './add-data-for-login.component.html',
  styleUrls: ['./add-data-for-login.component.css']
})
export class AddDataForLoginComponent implements OnInit {
  partCityName: string;
  cities: SelectItem[];
  geoCityResponse: GeoCityResponse;
  cityProperty: GeoCityProperty;

  failedRegistrationData: FailedRegistrationData;

  constructor(public dialogRef: MatDialogRef<AddDataForLoginComponent>,
    private geoService: GeoService,
    @Inject(MAT_DIALOG_DATA) public data: FailedRegistrationData) { 
      this.partCityName = '';
      this.cities = [];
      this.geoCityResponse = null;
    }

  ngOnInit() {
    this.failedRegistrationData = new FailedRegistrationData();
  }

  onNoClick(): void {
    return this.dialogRef.close();
  }

  refreshCitiesCandidates() {
    if(this.partCityName != null && this.partCityName != '') {
      this.geoService.geocodeCitiesByPartOfName(this.partCityName).subscribe((resp: GeoCityResponse) => {
        this.geoCityResponse = resp;
        this.cities = this.prepareGeoCityFeaturesToCities(this.geoCityResponse.features);
      });
    }
  }

  onChangeCity(event) {
    if(this.partCityName != event.target.value) {
      this.partCityName = event.target.value;
      this.refreshCitiesCandidates();
    }
  }

  prepareGeoCityFeaturesToCities(features: GeoCityFeature[]): SelectItem[] {
    return features.map((feature: GeoCityFeature) => {
      return {
        label: feature.properties.getDisplayName(),
        value: feature.properties
      };
    });
  }

}
