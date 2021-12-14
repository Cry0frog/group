import { CalcMode } from './calcMode';
import { BaseCategoryProperty } from './../baseCategoryProperty';
import { TypeCategoryProperty } from './../typeCategoryProperty';

export class MapCategoryProperty extends BaseCategoryProperty {

  getClassName() {
    return 'MapCategoryProperty'; //(<any>this).constructor.name;
  }

  /*only for COORDINATE*/
  showSelectPlaceForService: boolean;
  /**/

  /*only for COORDINATE_PATH*/
  buildRout: boolean;
  showCategoryTransport: boolean;
  showCategoryWeight: boolean;
  showCategoryProduct: boolean;
  showPorterOption: boolean;
  showPassengerOption: boolean;

  useCityArea: boolean;
  calcMode: CalcMode;
  /**/

  static createEmptyMapProperty(orderCounter: number): MapCategoryProperty {
    const prop = new MapCategoryProperty();
    prop.type = TypeCategoryProperty.COORDINATE_PATH;
    prop.order = orderCounter;
    prop.buildRout = true;
    prop.useCityArea = false;
    return prop;
  }
}