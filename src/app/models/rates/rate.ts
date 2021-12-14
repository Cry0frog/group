import { CalcMode } from './../category/constructor/map/calcMode';
import { ProductCategory } from './../task/properties/map/productCategory';
import { DistanceType } from './../task/properties/map/distanceType';
import { DISTANCE_TYPE_TRANSLATE, PRODUCT_CATEGORY_TRASLATE, CALC_MODE_TRANSLATE } from './../../common/task.description';
import { TransportCategory } from './../task/properties/map/transportCategory';
import { WeightCategory } from '../task/properties/map/weightCategory';
import { RateType } from './rateType';
import { RATE_TYPE_DISPLAY} from '../../components/admin/common/admin.descriptions';
import { TRANSPORT_CATEGORY_TRASLATE, WEIGHT_CATEGORY_TRASLATE } from 'src/app/common/task.description';

export class Rate {

  id: number;

  hard: boolean;
  type: RateType;
  startRate: Date;
  cost: number;
  description: string;

  timeWindowStart: Date;
  timeWindowEnd: Date;
  /*choosen props*/
  weightCategory: WeightCategory;
  transportCategory: TransportCategory;
  productCategory: ProductCategory;

  distanceType: DistanceType;
  /*only for filter by table*/
  translateType: string;
  additionalInfo: string;
  calcMode: CalcMode;

  isConsiderCalcMode(): boolean {
    return this.isWeightCategoryRate() 
      || this.isTransportCategoryRate()
      || this.isProductCategoryRate();
  }

  isDistanceType(): boolean {
    return this.type == RateType.DISTANCE;
  }

  isWeightCategoryRate(): boolean {
    return this.type == RateType.WEIGHT_CATEGORY;
  }

  isTransportCategoryRate(): boolean {
    return this.type == RateType.TRANSPORT_CATEGORY;
  }

  isProductCategoryRate(): boolean {
    return this.type == RateType.PRODUCT_CATEGORY;
  }

  static convertToObj(obj: any): Rate {
    if(obj == null) {
      return null;
    }
    const rate: Rate = new Rate();
    Object.assign(rate, obj);
    rate.startRate = new Date(Date.parse(obj.startRate));

    rate.translateType = RATE_TYPE_DISPLAY[obj.type];

    if(obj.type == RateType.TRANSPORT_CATEGORY) {
      rate.additionalInfo =
        (obj.calcMode != null ? CALC_MODE_TRANSLATE[obj.calcMode] + ', ': '') +
        TRANSPORT_CATEGORY_TRASLATE[obj.transportCategory];
    } 
    else if(obj.type == RateType.WEIGHT_CATEGORY) {
      rate.additionalInfo = 
        (obj.calcMode != null ? CALC_MODE_TRANSLATE[obj.calcMode] + ', ': '') +
        WEIGHT_CATEGORY_TRASLATE[obj.weightCategory];
    }
    else if(obj.type == RateType.DISTANCE) {
      rate.additionalInfo = DISTANCE_TYPE_TRANSLATE[obj.distanceType];
    }
    else if(obj.type == RateType.PRODUCT_CATEGORY) {
      rate.additionalInfo = 
        (obj.calcMode != null ? CALC_MODE_TRANSLATE[obj.calcMode] + ', ': '') +
        PRODUCT_CATEGORY_TRASLATE[obj.productCategory];
    }

    return rate;
  }
}