import { Component, OnInit, Inject } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { GeoCityResponse } from 'src/app/models/map/geo/city/geoCityResponse';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GeoService } from 'src/app/services/geo.service';
import { AdminService } from 'src/app/components/admin/service/admin.service';
import { IUserRoleMapper, ADD_ROLES } from 'src/app/components/admin/common/admin.descriptions';
import { DevelopmentPartner } from 'src/app/models/development/developmentPartner';
import { GeoCityProperty } from 'src/app/models/map/geo/city/geoCityProperty';
import { GeoCityFeature } from 'src/app/models/map/geo/city/geoCityFeature';
import { ROLE } from 'src/app/auth/role';

@Component({
  selector: 'app-edit-fake-users',
  templateUrl: './edit-fake-users.component.html',
  styleUrls: ['./edit-fake-users.component.css']
})
export class EditFakeUsersComponent implements OnInit {

  partCityName: string;
  cities: SelectItem[];
  geoCityResponse: GeoCityResponse;

  addRoles: IUserRoleMapper[] = ADD_ROLES;

  constructor(public dialogRef: MatDialogRef<EditFakeUsersComponent>,
    private geoService: GeoService,
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: DevelopmentPartner) {
      this.partCityName = '';
      this.cities = [];
      this.geoCityResponse = null;
    }

  ngOnInit() {
    this.adminService.getUsedSities().subscribe((data: GeoCityProperty[]) => {
      this.cities = data.map(el => ({ label: el.name, value: el }));
      if(this.data.city != null) {
        const citiesFilter = this.cities.filter(el => el.value.osm_id == this.data.city.osm_id);
        if(citiesFilter.length != 0) {
          const id = this.data.city.id;
          this.data.city = citiesFilter[0].value;
          this.data.city.id = id;
        }
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isAdminRole(role: ROLE): boolean {
    return role == ROLE.SUPER_USER;
  }

  changePassword(event) {
    this.data.changedPassword = true;
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