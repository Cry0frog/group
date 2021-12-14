import { PointType } from './../../../models/task/properties/map/pointType';
import * as mapConfig from './stylesConfiguration';

declare var ol: any;

export interface IMarker {
  interaction: any;
  feature: any;
  index: number;
  pointType: PointType;
  id: number;
};

export class MapMarkers {

  constructor() {
    this.markers = [];
  }

  private markers: IMarker[];

  static getPinTypeByPointType(pointType: PointType) {
    switch(pointType) {
      case PointType.POINT:
        return mapConfig.pinGreen;
      case PointType.START:
        return mapConfig.pinGreen;
      case PointType.END:
        return mapConfig.pinRed;
      case PointType.INTERMEDIATE:
        return mapConfig.pinBlue;
      default:
        console.log('undefined result of getPinTypeByPointType for pointType: ' + pointType);
    }
  }

  clear() {
    this.markers = [];
  }

  getIconStyle(pointType: PointType) {
    return new ol.style.Style({
      image: new ol.style.Icon({
        scale: .07,
        src: MapMarkers.getPinTypeByPointType(pointType),
      })
    });
  }

  replaceImageForType(oldMarker: IMarker, newType: PointType) {
    if(oldMarker.feature.getStyle() != null
      && oldMarker.feature.getStyle().getImage() != null
      && oldMarker.feature.getStyle().getImage().getImage() != null
    ) {

      oldMarker.feature.setStyle(this.getIconStyle(PointType.INTERMEDIATE));
      /*const img = oldMarker.feature.getStyle().getImage().getImage();
      img.src = img.src.replace(
        MapMarkers.getPinTypeByPointType(oldMarker.pointType),
        MapMarkers.getPinTypeByPointType(newType)
      );*/
    }
  }

  pushMarker(marker: IMarker) {
    this.markers.push(marker);
  }

  pushStartMarker(marker: IMarker, oldMarker: IMarker) {
    marker.pointType = PointType.START;
    this.pushOrReplace(marker, oldMarker != null ? oldMarker.interaction.ol_uid: null);
  }

  pushEndMarker(marker: IMarker, oldMarker: IMarker) {
    marker.pointType = PointType.END;
    this.pushOrReplace(marker, oldMarker != null ? oldMarker.interaction.ol_uid: null);
  }

  private pushOrReplace(marker: IMarker, oldOl_uid) {
    const search = this.markers.filter(el => el.pointType == marker.pointType);

    if(search.length != 0) {
      this.replaceMarker(oldOl_uid, marker);
    }
    else {
      this.markers.push(marker);
    }
  }

  findByOl_uid(ol_uid): IMarker {
    const searched = this.markers.filter(marker =>
      marker.feature.ol_uid == ol_uid
      || marker.interaction.ol_uid == ol_uid);
    if(searched.length == 0) {
      return null;
    }
    return searched[0];
  }

  findIntermediatePoints(): IMarker[] {
    return this.markers.filter(marker => marker.pointType == PointType.INTERMEDIATE);
  }

  findStartMarker(): IMarker {
    return this.findMarker(this.markers, true, false);
  }

  findEndMarker(): IMarker {
    return this.findMarker(this.markers, false, true);
  }

  replaceMarker(ol_uid, newMarker: IMarker) {
    this.markers.every((item: IMarker, i) => {
      if(item.interaction.ol_uid != ol_uid) {
        return true;
      }

      this.markers[i] = newMarker;
      return false;
    });
  }

  private findMarker(markers: IMarker[], isStartPoint: boolean, isEndPoint: boolean): IMarker {
    let search = [];
    if(isStartPoint) {
      search = markers.filter(marker => marker.pointType == PointType.START);
    }
    else if(isEndPoint) {
      search = markers.filter(marker => marker.pointType == PointType.END);
    }

    if(search.length == 0) {
      return null;
    }
    return search[0];
  }

}
