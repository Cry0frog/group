import { GeoCityProperty } from './geoCityProperty';

export class GeoCityFeature {
  geometry: any;
  properties: GeoCityProperty;
  type: string;

  static convertToObj(obj: any): GeoCityFeature {
    if(obj == null) {
        return null;
    }
    
    const feature: GeoCityFeature = new GeoCityFeature();
    Object.assign(feature, obj);
    feature.properties = GeoCityProperty.convertToObj(obj.properties, obj.geometry);
    
    return feature;
  }
}