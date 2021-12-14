import { PointType } from './pointType';
import { GeoCityProperty } from 'src/app/models/map/geo/city/geoCityProperty';
import { SelectItem } from 'primeng/api';

export class MapTaskPropertyPoint {
  id: number;
  order: number;
  pointType: PointType;

  lat: string;
  lon: string;

  addr: string;

  home: string;
  corps: string;
  apartmentOrOffice: string;

  //ignore
  index: number;
  geoCityPropertyAddr: GeoCityProperty;
  selectedItems: SelectItem[]

  isStartPoint(): boolean {
    return this.pointType == PointType.START;
  }

  isIntermediatePoint(): boolean {
    return this.pointType == PointType.INTERMEDIATE;
  }

  isEndPoint(): boolean {
    return this.pointType == PointType.END;
  }

  isPoint(): boolean {
    return this.pointType == PointType.POINT;
  }

  static convertToObj(obj: any): MapTaskPropertyPoint {
    if(obj == null) {
      return null;
    }
    const point = new MapTaskPropertyPoint();
    Object.assign(point, obj);

    return point;
  }
}