import { CalcMode } from './../../../category/constructor/map/calcMode';
import { ProductCategory } from './productCategory';
import { TRANSPORT_CATEGORY_TRASLATE, WEIGHT_CATEGORY_TRASLATE, PRODUCT_CATEGORY_TRASLATE } from './../../../../common/task.description';
import { MapCategoryProperty } from './../../../category/constructor/map/mapCategoryProperty';
import { PathWrapper } from './../../../map/pathWrapper';
import { MapTaskPropertyPoint } from './mapTaskPropertyPoint';
import { LocationType } from './locationType';
import { BaseTaskProperty } from '../baseTaskProperty';
import { TransportCategory } from './transportCategory';
import { WeightCategory } from './weightCategory';
import { PointType } from './pointType';
import { Task } from '../../task';
import { TypeCategoryProperty } from 'src/app/models/category/constructor/typeCategoryProperty';

export class MapTaskProperty extends BaseTaskProperty {

  constructor() {
    super();
    this.points = [];
  }

  getClassName() {
    return 'MapTaskProperty';// (<any>this).constructor.name;
  }

  //only for type COORDINATE
  locationType: LocationType;

  points: MapTaskPropertyPoint[];
  pathWrapper: PathWrapper;

  transportCategory: TransportCategory;
  weightCategory: WeightCategory;
  productCategory: ProductCategory;
  choosenCalcMode: CalcMode;

  porterSelected: boolean;
  porterCount: number;

  passengerCount: number;
  notValidPath: boolean;

  get refMapProperty(): MapCategoryProperty {
    return <MapCategoryProperty>this.refProperty;
  }

  getDisplayTransportCategory(): string {
    return TRANSPORT_CATEGORY_TRASLATE[this.transportCategory];
  }

  getDisplayWeightCategory(): string {
    return WEIGHT_CATEGORY_TRASLATE[this.weightCategory];
  }

  getDisplayProductCategory(): string {
    return PRODUCT_CATEGORY_TRASLATE[this.productCategory];
  }

  getPointsSortedByOrder() {
    return this.points.sort(
      (a: MapTaskPropertyPoint, b: MapTaskPropertyPoint) =>
        (a.order > b.order) ? 1
        : (a.order === b.order) ? 0
        : -1
    );
  }

  getStartPoint(): MapTaskPropertyPoint {
    if(this.points == null || this.points.length < 2) {
      return null;
    }

    const els = this.points.filter(el => el.pointType == PointType.START);
    return els.length != 0 ? els[0] : null;
  }

  findPointByIndex(index: number): MapTaskPropertyPoint {
    if(this.points == null) {
      return null;
    }
    const search = this.points.filter(el => el.index == index);
    if(search.length == 0) {
      return null;
    }
    return search[0];
  }

  static convertToObj(obj: any): MapTaskProperty {
    if(obj == null) {
      return null;
    }
    const taskProp = new MapTaskProperty();
    Object.assign(taskProp, obj);
    if(obj.refProperty != null) {
      const catProp = new MapCategoryProperty();
      Object.assign(catProp, obj.refProperty);

      taskProp.refProperty = catProp;
    }
    if(obj.points != null) {
      taskProp.points = taskProp.points.map(el => MapTaskPropertyPoint.convertToObj(el));
    }
    return taskProp;
  }

  static setMapToCenterOfPoints(mapTask: MapTaskProperty) {
    let lon; let lat;

    if(mapTask.points.length >= 2) {
      if (mapTask.refProperty.type == TypeCategoryProperty.COORDINATE) {
        lon = (Number(mapTask.points[0].lon) + Number(mapTask.points[mapTask.points.length - 1].lon)) / 2;
        lat = (Number(mapTask.points[0].lat) + Number(mapTask.points[mapTask.points.length - 1].lat)) / 2;
      }
      else if (mapTask.refProperty.type == TypeCategoryProperty.COORDINATE_PATH) {
        const pointStart = mapTask.points.filter(point => point.pointType == PointType.START)[0];
        const pointEnd = mapTask.points.filter(point => point.pointType == PointType.END)[0];
        lon = (Number(pointStart.lon) + Number(pointEnd.lon)) / 2;
        lat = (Number(pointStart.lat) + Number(pointEnd.lat)) / 2;
      }
    }
    else {
      lon = Number(mapTask.points[0].lon);
      lat = Number(mapTask.points[0].lat);
    }
    return [lon, lat];
  }
}
