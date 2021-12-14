import { GeoCityFeature } from './../../../../../../models/map/geo/city/geoCityFeature';
import { AdminService } from './../../../../service/admin.service';
import { GeoCityProperty } from './../../../../../../models/map/geo/city/geoCityProperty';
import { GeoService } from './../../../../../../services/geo.service';
import { GeoCityResponse } from '.././../../../../../models/map/geo/city/geoCityResponse';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ShortPartner } from 'src/app/models/partner/shortPartner';
import { ADD_ROLES, IUserRoleMapper } from '../../../../common/admin.descriptions';
import { ROLE } from 'src/app/auth/role';
import { FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api/selectitem';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  partCityName: string;
  cities: SelectItem[];
  geoCityResponse: GeoCityResponse;

  addRoles: IUserRoleMapper[] = ADD_ROLES;

  constructor(public dialogRef: MatDialogRef<AddUserComponent>,
    private geoService: GeoService,
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: ShortPartner) {}


  ngOnInit() {
    this.adminService.getUsedSities().subscribe((data: GeoCityProperty[]) => {
      this.cities = data.map(el => ({ label: el.name, value: el }));
      if(this.data.cityProperty != null) {
        const citiesFilter = this.cities.filter(el => el.value.osm_id == 
          this.data.cityProperty.osm_id);
        if(citiesFilter.length != 0) {
          const id = this.data.cityProperty.id;
          this.data.cityProperty = citiesFilter[0].value;
          this.data.cityProperty.id = id;
        }
      }
    });
  }

  isMember(): boolean {
    return this.data.roles.includes(ROLE.MEMBER_ANOTHER) || this.data.roles.includes(ROLE.MEMBER_PERFORMER) || this.data.roles.includes(ROLE.MEMBER_STORE);
  }

  isDisableAddRole(role: ROLE): boolean {
    return role == ROLE.MEMBER_ANOTHER || role == ROLE.MEMBER_PERFORMER || role == ROLE.MEMBER_STORE;
  }

  isNotAdminRole(shortPartner: ShortPartner): boolean {
    return !shortPartner.roles.includes(ROLE.SUPER_USER);
  }

  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('confirmpassword');
    return password === confirmPassword ? null : { passwordNotMatch: true };
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

  changePassword(event) {
    this.data.changedPassword = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isDisableRole(role) {
    if(role == ROLE.SUPER_USER) {
      return ROLE.SUPER_USER;
    }
  }

  isDisableChoosingRole(): boolean {
    return this.isSelectAdmin();
  }

  isSelectAdmin() {
    return this.data.roles.filter((el: ROLE) =>
      el == ROLE.SUPER_USER).length != 0;
  }

  isDisableUpdateRole(role: ROLE): boolean {
    if(role == ROLE.SUPER_USER || role == ROLE.PARTNER || role == ROLE.PERFORMER) {
      return true;
    }

    return false;
  }

  onOptionChange(event) {
    if (event.isUserInput == true && event.source.selected == true) {
      if(event.source.value == "SUPER_USER") {
        Promise.resolve(null).then(el => {
          this.data.roles = [event.source.value];
        });
      }
      else if(event.source.value != "SUPER_USER") {
        Promise.resolve(null).then(el => {
          this.data.roles = this.data.roles.filter(el => ROLE[el] != ROLE.SUPER_USER );
          this.data.roles = this.data.roles;
        });
      }
    }
  }
}
