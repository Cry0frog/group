
export class GeoCityProperty {
  id: number;
  country: string;
  countryCode: string;
  extent: number[];
  name: string;

  osm_id: number;
  osm_key: string;
  osm_type: string;
  osm_value: string;
  state: string;
  city: string;
  street: string;
  housenumber: string;
  postcode: string;

  static convertToObj(obj: any, geometry: any): GeoCityProperty {
    if(obj == null) {
        return null;
    }

    const prop: GeoCityProperty = new GeoCityProperty();
    Object.assign(prop, obj);
    if(geometry != null) {
      prop.extent = geometry.coordinates;
    }

    return prop;
  }

  getDisplayName() {
    return this.name + (this.state != null ? (', ' + this.state) : '');
  }

  getDisplayAddrName() {
    console.log('getDisplayAddrName');
    let addr = '';
    if(this.city != null && this.street != null && this.housenumber != null) {
      addr = this.city + ', ' + this.street + ', ' + this.housenumber;
    }
    else {
      addr = this.city + ' ' + this.name + ', почтовый индекс: ' + this.postcode;
    }

    return addr;
    //return this.city + ', ' + (this.street) + ', ' + (this.housenumber);
  }

  getLon(): number {
    return (this.extent[0] + this.extent[2]) / 2;
  }

  getLat(): number {
    return (this.extent[1] + this.extent[3]) / 2;
  }
}