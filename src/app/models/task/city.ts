import { GeoCityProperty } from './../map/geo/city/geoCityProperty';

export class City {
  id: number;
  name: string;
  osm_id: number;
  state: string;
  extent: number[];

  static createBasedGeoCityFeature(feature: GeoCityProperty): City {
    const city: City = new City();
    city.name = feature.name;
    city.osm_id = feature.osm_id;
    city.state = feature.state;
    city.extent = feature.extent;

    return city;
  }
}