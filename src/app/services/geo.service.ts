import { MapCategoryProperty } from './../models/category/constructor/map/mapCategoryProperty';
import { GeoCityProperty } from './../models/map/geo/city/geoCityProperty';
import { GeoCityFeature } from './../models/map/geo/city/geoCityFeature';
import { map, catchError } from 'rxjs/operators';
import { GeoCityResponse } from './../models/map/geo/city/geoCityResponse';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../auth/auth.service';
import { BaseHandlerService } from './../common/services/service.base.handler';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeoService extends BaseHandlerService {

  //GeoCityTags: string = 'osm_tag=place:city&osm_tag=place:town&osm_tag=place:village&osm_tag=place:hamlet&osm_tag=boundary:administrative';
  //GeoCityTags: string = 'osm_tag=place:city&osm_tag=place:town&osm_tag=place:village&osm_tag=place:hamlet';

  GeoCityTags: string = 'osm_tag=place:city&osm_tag=place:town&osm_tag=place:village&osm_tag=place:hamlet';
  //GeoCityUrl: string = `/geocode_p/api?${this.GeoCityTags}&q=`;
  //GeoCityUrl: string = `/api/geo/city/api?${this.GeoCityTags}&q=`;
  GeoCityUrl: string = `/api/geo/city?cityPartName=`;

  //AddrTags0: string = 'osm_tag=!place:city&osm_tag=!place:locality&osm_tag=!place:village&osm_tag=!mountain_pass&osm_tag=!highway&osm_tag=!waterway&osm_tag=!natural&osm_tag=!landuse';
//AddrTags0: string = '&osm_tag=!place:locality&osm_tag=!place:village&osm_tag=!natural&osm_tag=!landuse';
  AddrTags0: string = 'osm_tag=!place:city&osm_tag=!waterway&osm_tag=!highway&osm_tag=!mountain_pass';

  AddrTags1: string = 'osm_tag=!place:city&osm_tag=!highway:primary&osm_tag=!place:locality&osm_tag=!place:village';
  AddrTags2: string = '&osm_tag=!landuse:construction&osm_tag=!landuse:residential&osm_tag=!landuse:industrial&osm_tag=!landuse:garages&osm_tag=!landuse:recreation_ground&osm_tag=!landuse:commercial';
  AddrTags3: string = '&osm_tag=!highway:trunk&osm_tag=!highway:secondary&osm_tag=!boundary:administrative&osm_tag=!highway:residential&osm_tag=!highway:unclassified';
  AddrTags4: string = '&osm_tag=!highway:tertiary&osm_tag=!highway:primary_link&osm_tag=!shop:car_repair';
  AddrTags5: string = '&osm_tag=!highway:bus_stop&osm_tag=!shop:mall&osm_tag=!highway:path&osm_tag=!historic:archaeological_site';
  AddrTags6: string = '&osm_tag=!waterway:stream&osm_tag=!waterway:drystream&osm_tag=!waterway:river&osm_tag=!place:quarter';
  AddrTags7: string = '&osm_tag=!amenity:fast_food&osm_tag=!amenity:townhall&osm_tag=!leisure:park';
  AddrTags8: string = '&osm_tag=!mountain_pass:yes&osm_tag=!natural:peak&osm_tag=!natural:peak';
  AddrTags9: string = '&osm_tag=!highway:construction&osm_tag=!natural:water&osm_tag=!highway:trunk_link';
  AddrTags10: string = '&osm_tag=!building:entrance&osm_tag=!highway:secondary_link&osm_tag=!building:yes';
  AddrTags11: string = '&osm_tag=!landuse:railway&osm_tag=!shop:yes&osm_tag=!amenity:cinema&osm_tag=!place:neighbourhood';
  AddrTags12: string = '&osm_tag=!amenity:fuel&osm_tag=!shop:hardware&osm_tag=!building:retail&osm_tag=!shop:car';
  AddrTags13: string = '&osm_tag=!shop:doityourself&osm_tag=!man_made:monitoring_station&osm_tag=!highway:track&osm_tag=!shop:computer';
  AddrTags14: string = '&osm_tag=!place:farm&osm_tag=!amenity:cafe&osm_tag=!shop:hairdresser&osm_tag=!amenity:taxi&osm_tag=!landuse:military&osm_tag=!landuse:cemetery';
  AddrTags15: string = '&osm_tag=!amenity:restaurant&osm_tag=!amenity:police&osm_tag=!leisure:pitch&osm_tag=!tourism:theme_park&osm_tag=!amenity:payment_terminal';
  AddrTags16: string = '&osm_tag=!craft:photographer&osm_tag=!amenity:car_wash&osm_tag=!amenity:terminal';
  AddrTags17: string = '&osm_tag=!amenity:internet_cafe&osm_tag=!shop:clothes&osm_tag=!amenity:animal_breeding';
  AddrTags18: string = '&osm_tag=!amenity:pharmacy&osm_tag=!leisure:sports_centre&osm_tag=!amenity:nightclub';
  AddrTags19: string = '&osm_tag=!club:chess&osm_tag=!tourism:alpine_hut';

  AddrTags20: string = '&osm_tag=!club:chess&osm_tag=!tourism:alpine_hut&osm_tag=!tourism:isolated_dwelling&osm_tag=!highway:living_street&osm_tag=!waterway:living_street&osm_tag=!highway:road&osm_tag=!amenity:toilets&osm_tag=!historic:memorial&osm_tag=!shop:convenience&osm_tag=!amenity:public_building&osm_tag=!place:island&osm_tag=!place:town&osm_tag=!place:postcode&osm_tag=!place:isolated_dwelling&osm_tag=!landuse:farmyard&osm_tag=!landuse:allotments&osm_tag=!landuse:quarry&osm_tag=!landuse:reservoir&osm_tag=!landuse:farmland&osm_tag=!landuse:landfill&osm_tag=!landuse:forest&osm_tag=!landuse:churchyard&osm_tag=!landuse:religious&osm_tag=!landuse:meadow&osm_tag=!landuse:retail&osm_tag=!highway:platform&osm_tag=!highway:pedestrian&osm_tag=!highway:motorway&osm_tag=!highway:proposed&osm_tag=!highway:tertiary_link&osm_tag=!railway:station&osm_tag=!natural:spring&osm_tag=!amenity:school&osm_tag=!highway:raceway&osm_tag=!natural:wetland&osm_tag=!amenity:place_of_worship&osm_tag=!railway:halt&osm_tag=!natural:valley&osm_tag=!natural:strait&osm_tag=!natural:cape&osm_tag=!railway:stop'
  AddrTags21: string = '&osm_tag=!place:hamlet&osm_tag=!place:suburb&osm_tag=!highway:service&osm_tag=!highway:footway&osm_tag=!tourism:attraction&osm_tag=!natural:glacier&osm_tag=!tourism:hotel&osm_tag=!shop:beauty';

  AddrTags22: string = '&osm_tag=!historic:monument&osm_tag=!tourism:artwork&osm_tag=!railway:tram&osm_tag=!man_made:bridge&osm_tag=!amenity:atm&osm_tag=!shop:mobile_phone&osm_tag=!office:government&osm_tag=!amenity:dentist&osm_tag=!building:service&osm_tag=!shop:kiosk&osm_tag=!boundary:protected_area&osm_tag=!man_made:reservoir_covered&osm_tag=!railway:tram_stop&osm_tag=!amenity:community_centre&osm_tag=!amenity:social_facility&osm_tag=!amenity:post_box';
  AddrTags23: string = '&osm_tag=!shop:pet&osm_tag=!building:barn&osm_tag=!amenity:bank&osm_tag=!shop:jewelry&osm_tag=!natural:scrub&osm_tag=!building:warehouse&osm_tag=!shop:supermarket&osm_tag=!building:farm_auxiliary&osm_tag=!leisure:track&osm_tag=!shop:copyshop&osm_tag=!amenity:university&osm_tag=!amenity:bar&osm_tag=!amenity:pub&osm_tag=!amenity:kindergarten';
  AddrTags24: string = '&osm_tag=!shop:interior_decoration&osm_tag=!shop:tobacco&osm_tag=!club:sport&osm_tag=!building:construction&osm_tag=!shop:florist&osm_tag=!amenity:parking&osm_tag=!man_made:tower&osm_tag=!historic:submarine&osm_tag=!tourism:motel&osm_tag=!shop:car_parts&osm_tag=!historic:aircraft&osm_tag=!emergency:water_tank&osm_tag=!amenity:ferry_terminal&osm_tag=!man_made:bunker_silo&osm_tag=!man_made:works&osm_tag=!amenity:post_office&osm_tag=!building:cowshed&osm_tag=!natural:cave_entrance&osm_tag=!shop:furniture&osm_tag=!building:shed';
  AddrTags25: string = '&osm_tag=!office:company&osm_tag=!natural:wood&osm_tag=!amenity:courthouse&osm_tag=!building:church&osm_tag=!natural:cliff&osm_tag=!natural:heath&osm_tag=!amenity:mortuary&osm_tag=!building:commercial&osm_tag=!place:allotments&osm_tag=!shop:kitchen&osm_tag=!amenity:prison&osm_tag=!building:school&osm_tag=!historic:ruins&osm_tag=!amenity:vending_machine&osm_tag=!building:industrial&osm_tag=!building:university&osm_tag=!military:observation_post&osm_tag=!shop:newsagent&osm_tag=!amenity:arts_centre&osm_tag=!natural:bay&osm_tag=!shop:bakery&osm_tag=!building:transportation&osm_tag=!amenity:hospital&osm_tag=!amenity:bus_station';
  AddrTags26: string = '&osm_tag=!shop&osm_tag=!craft&osm_tag=!office&osm_tag=!amenity&osm_tag=!club&osm_tag=!man_made&osm_tag=!leisure';
  AddrTags27: string = '';
  AddrTags28: string = '&limit=60';

  GeoAddrTags: string = `${this.AddrTags0}${this.AddrTags28}`;
  //GeoAddrTags: string = `${this.AddrTags1}${this.AddrTags2}${this.AddrTags3}${this.AddrTags4}${this.AddrTags5}${this.AddrTags6}${this.AddrTags7}${this.AddrTags8}${this.AddrTags9}${this.AddrTags10}${this.AddrTags11}${this.AddrTags12}${this.AddrTags13}${this.AddrTags14}${this.AddrTags15}${this.AddrTags16}${this.AddrTags17}${this.AddrTags18}${this.AddrTags19}${this.AddrTags20}${this.AddrTags21}${this.AddrTags22}${this.AddrTags23}${this.AddrTags24}${this.AddrTags25}${this.AddrTags26}${this.AddrTags27}${this.AddrTags28}`;
/*
  AddrTags1: string = 'osm_tag=shop:car_repair&osm_tag=office:company&osm_tag=amenity:bank';
  AddrTags2: string = '&osm_tag=building:commercial&osm_tag=amenity:cafe';
  GeoAddrTags: string = `${this.AddrTags1}${this.AddrTags2}`;*/

  GeoAddrUrl: string = `/geocode_p/api?${this.GeoAddrTags}&q=`;

  GeoNom: string = `/nominatim/reverse.php?format=json&zoom=18&addressdetails=1&`;

  constructor(private http: HttpClient,
    protected auth: AuthService
  ) {
      super(auth);
  }

  geocodeCitiesByPartOfName(partName: string): Observable<GeoCityResponse> {
    const urlEncode = encodeURIComponent(partName);
    return this.http.get<GeoCityResponse>(`${this.GeoCityUrl}${urlEncode}`).pipe(
      map((response: GeoCityResponse) => GeoCityResponse.convertToObj(response)),
      catchError(this.handleGeoError('geocodeCitiesByPartOfName', null))
    );
  }

  geocodeAddressByPartOfName(partName: string,
      geoCity: GeoCityProperty,
      useCityArea: boolean
  ): Observable<GeoCityResponse> {
    const urlEncode = encodeURIComponent(partName);
    return this.http.post<GeoCityResponse>(`/api/geo/addr?addrPartName=${urlEncode}&useCityArea=${useCityArea}`, geoCity).pipe(
      map((response: GeoCityResponse) => GeoCityResponse.convertToObj(response)),
      catchError(this.handleGeoError('geocodeCitiesByPartOfName', null))
    );
  }

  geocodePlace(lat: number, lon: number): Observable<any> {
    return this.http.get<GeoCityResponse>(`${this.GeoNom}lat=${lat}&lon=${lon}`).pipe(
      catchError(this.handleGeoError('geocodePlace', null))
    );
  }

  protected handleGeoError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log('handle error: ' + operation);
      if(error.status != 500 && error.status != 400 && error.status != 401 && error.status != 200) {
        alert('status: ' + error.status + ', handle error: ' + operation);
      }

      this.auth.logout();
      return of(result as T);
    };
  }

}
