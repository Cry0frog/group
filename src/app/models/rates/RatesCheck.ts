import { CalcMode } from './../category/constructor/map/calcMode';
import { ProductCategory } from './../task/properties/map/productCategory';
import { WeightCategory } from '../task/properties/map/weightCategory';
import { TransportCategory } from './../task/properties/map/transportCategory';

export class RatesCheck {

  constructor() {
    this.distance = 0;
    this.date = new Date();
  }

  osmId: number;
  lon: number;
  lat: number;
  distance: number;
  hour: number;

  transportCategory: TransportCategory;
  weightCategory: WeightCategory;
  productCategory: ProductCategory;
  calcMode: CalcMode;
  urgently: boolean;
  date: Date;
  offset: string;
}