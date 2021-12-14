import { SelectItem } from 'primeng/api/selectitem';
import { GeoCityProperty } from "../map/geo/city/geoCityProperty";

export class MapVacancyPropertyPoint {
  constructor() {
    this.selectedItems = [];
    this.geoCityPropertyAddr = new GeoCityProperty();
  }

  id: number;
  order: number;
  lat: string;
  lon: string;

  addr: string;
  home: string;
  corps: string;
  apartmentOrOffice: string;

  // only ui
  index: number;
  geoCityPropertyAddr: GeoCityProperty;
  selectedItems: SelectItem[]

  static convertToObj(obj): MapVacancyPropertyPoint {
    const dto = new MapVacancyPropertyPoint();
    Object.assign(dto, obj);
    return dto;
  }

}
