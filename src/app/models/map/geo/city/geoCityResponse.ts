import { SelectItem } from 'primeng/api/selectitem';
import { GeoCityFeature } from './geoCityFeature';

export class GeoCityResponse {
  
  features: GeoCityFeature[];

  static convertToObj(obj: any): GeoCityResponse {
    if(obj == null) {
        return null;
    }
    
    const resp: GeoCityResponse = new GeoCityResponse();
    Object.assign(resp, obj);
    if(obj.features != null) {
      resp.features = obj.features.map(feature => GeoCityFeature.convertToObj(feature));
    }
    else {
      resp.features = [];
    }

    return resp;
  }

  static prepareGeoCityFeaturesToCities(features: GeoCityFeature[]): SelectItem[] {
    return features.map((feature: GeoCityFeature) => {
      return {
        label: feature.properties.getDisplayName(),
        value: feature.properties
      };
    });
  }
}