import { MapVacancyPropertyPoint } from 'src/app/models/vacancy/mapVacancyPropertyPoint';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IMarker, MapMarkers } from '../mapMarkers';
import { MapMode } from '../mapMode';
import { PointType } from 'src/app/models/task/properties/map/pointType';
import { MapActions } from '../mapAction';
import * as mapConfig from '../stylesConfiguration';

declare var ol: any;
declare var ContextMenu: any;

@Component({
  selector: 'app-map-vacancy-handler',
  templateUrl: './map-vacancy-handler.component.html',
  styleUrls: ['./map-vacancy-handler.component.css']
})
export class MapVacancyHandlerComponent implements OnInit {
  @Input() mapMode: MapMode;
  @Input() mapPoints: MapVacancyPropertyPoint[];
  @Output() addAddressEvent = new EventEmitter<MapVacancyPropertyPoint>();
  @Output() updateAddressEvent = new EventEmitter<MapVacancyPropertyPoint>();
  @Output() deleteAddressEvent = new EventEmitter<MapVacancyPropertyPoint[]>();

  constructor() {
    this.currentCoordinate = [];
  }

  longitude: number = 39.200269;
  latitude: number = 51.660781;
  zoom = 11;
  //host: string = 'http://localhost:8090';
  host: string = 'https://gooddealonline.ru';

  map: any;
  baseLayer: any;
  vectorLayer: any;
  view: any;
  contextmenu: any;

  routeFeature: any;
  time: string;
  weight: string;

  info: any;
  target: any;

  mapMarkers: MapMarkers;
  orderCounter: number;
  indexCounter: number;

  iPhonePressTimer: any;
  iPhonePressPosition: any;

  isIOSMode: boolean;

  currentCoordinate: number[];

  private center = (obj) => {
    this.view.animate({
      duration: 700,
      center: obj.coordinate
    });
  };

  private clearCurrentPath = (obj) => {
    this.deleteAddressEvent.emit(this.mapPoints);
    this.clearAllElements();
  }

  private changePoint = (marker: IMarker, obj): IMarker => {

    if(marker != null) {
      this.removePointOnMap(marker, marker.feature);
    }

    marker = this.marker(marker.pointType, obj.coordinate, marker.index, marker.id);
    const coords = this.convertFromGeodeticToLonLat(obj.coordinate);
    this.updateAddressEvent.emit({
        lon: coords[0],
        lat: coords[1],
        addr: 'index: ' + this.indexCounter + ', address: ' + coords,
        index: marker.index,
        order: -1,
        id: marker.id
      } as MapVacancyPropertyPoint
    );

    return marker;
  }

  private addCoordPoint = (obj) => {
    let marker = this.marker(PointType.POINT, obj.coordinate, this.indexCounter, null);
    this.mapMarkers.pushMarker(marker);

    this.sendAddressChange(PointType.POINT, obj);
  }

  private sendAddressChange(type: PointType, obj) {
    const coords = this.convertFromGeodeticToLonLat(obj.coordinate);
    this.addAddressEvent.emit({
        lon: coords[0],
        lat: coords[1],
        addr: 'index: ' + this.indexCounter + ', address: ' + coords,
        order: this.orderCounter++,
        index: this.indexCounter++
      } as MapVacancyPropertyPoint
    );
  }

  private removeMarker = (obj) => {
    const marker = this.mapMarkers.findByOl_uid(obj.data.marker.ol_uid);
    if(marker != null) {
      this.deleteAddressEvent.emit(marker.id == null ?
        this.mapPoints.filter(point => point.index == marker.index) :
        this.mapPoints.filter(point => point.id == marker.id)
      );
      this.removePointOnMap(marker, obj.data.marker);
    }
    this.refreshMap();
  };

  private removePointOnMap(marker: IMarker, point: any) {
    if(marker.feature.ol_uid == point.ol_uid) {
      this.clearInteraction(marker.interaction);
      marker = null;

      this.vectorLayer.getSource().removeFeature(point);
      point = null;
    }
  }

  private clearInteraction(interaction) {
    this.map.removeInteraction(interaction);
  }

  private touchstart = (evt) => {
    this.clearIPhonePressTimer(true, null);
    this.iPhonePressPosition = this.map.getEventPixel(evt);
    this.iPhonePressTimer = window.setTimeout(() => {
      this.iPhonePressPosition = null;
      evt.preventDefault();
      this.currentCoordinate = this.map.getEventCoordinate(evt);
      var pixel = this.map.getEventPixel(evt);
      this.handleMapRightClick(pixel);
    }, 300);
}

  handleMapRightClick(pixel) {
    let feature =	this.map.forEachFeatureAtPixel(pixel, ft => ft);
    // if(feature) {
    //   this.mapMode = MapMode.DELETE_POINT;
    // }

    //@ts-ignore
    const styleBlock = document.querySelector(".context").style;
    styleBlock.display = 'block';
    styleBlock.top = `${pixel[1]}px`;
    styleBlock.left = `${pixel[0]}px`;
  }

  handlerMapActions(mapActions: MapActions) {
    if(mapActions != null) {
      this.closeContext();

      switch(mapActions) {
        case MapActions.CENTRE:
          return this.center({coordinate: [this.currentCoordinate[0], this.currentCoordinate[1]]});
        case MapActions.ADD_POINT:
          return this.addCoordPoint({coordinate: [this.currentCoordinate[0], this.currentCoordinate[1]]})
        case MapActions.DELETE_ALL:
          return this.clearCurrentPath({coordinate: [this.currentCoordinate[0], this.currentCoordinate[1]]});
        case MapActions.DELETE:
          return this.removeMarker({coordinate: [this.currentCoordinate[0], this.currentCoordinate[1]]});
        case MapActions.ZOOM_IN:
          //@ts-ignore
          return document.querySelector('.ol-zoom-in').click();
        case MapActions.ZOOM_OUT:
          //@ts-ignore
          return document.querySelector('.ol-zoom-out').click();
      }
    }
  }

  closeContext() {
    //@ts-ignore
    document.querySelector(".context").style.display = 'none';
  }

  private contexMenuOpenEvent = (evt) => {
    var feature =	this.map.forEachFeatureAtPixel(evt.pixel, ft => ft);

    if(feature && feature.get('type') === 'removable') {
      this.contextmenu.clear();
      this.removeMarkerItem.data = { marker: feature };

      if(this.mapMode != MapMode.ADD_PATH) {
        this.contextmenu.push(this.removeMarkerItem);
      }
    }
    else {
      this.contextmenu.clear();
      this.contextmenu.extend(this.contextmenuItems);
      this.contextmenu.extend(this.contextmenu.getDefaultItems());
    }
  };

  contextmenuItems = [
    {
      text: '????????????????????????',
      classname: 'bold',
      icon: mapConfig.centerIcon,
      callback: this.center
    }
  ];

  contextMenuClearAll: string = '???????????????? ??????';
  contextMenuClearPath = [
    {
      text: this.contextMenuClearAll,
      classname: '',
      icon: mapConfig.pinRed,
      callback: this.clearCurrentPath
    },
  ];

  contextMenuAddPointElements = [
    {
      text: '???????????????? ??????????',
      classname: '',
      icon: mapConfig.pinGreen,
      callback: this.addCoordPoint
    }
  ];

  removeMarkerItem = {
    text: '??????????????',
    classname: 'marker',
    callback: this.removeMarker,
    data: null
  };

  private styleHandler = (feature) => {
    const myStyle = mapConfig.stylesMap[feature.get('type')];
    if (myStyle instanceof Function) {
      return myStyle(feature);
    }
    return myStyle;
  };

  setCenter = (coordinate) => {
    this.view.setCenter(ol.proj.fromLonLat([coordinate[0], coordinate[1]]));
  };

  ngOnInit() {
    let user = navigator.userAgent.toLowerCase();
    if(user.indexOf("ipad") != -1 || user.indexOf("iphone") != -1) {
      this.isIOSMode = true;
    }

    this.mapInit();

    this.orderCounter = 0;
    this.indexCounter = 0;

    this.target = document.getElementById('map');

    this.mapMarkers = new MapMarkers();
    Promise.resolve(null).then(el => {
      this.onChangePoints();
    });
  }

  private mapInit() {
    this.view = new ol.View({
      center: ol.proj.fromLonLat([this.longitude, this.latitude]),
      zoom: this.zoom
    });
    this.vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector(),
      style: this.styleHandler
    }),
    this.baseLayer = new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: `${this.host}/osm_tiles/{z}/{x}/{y}.png`
        //url: `https://tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png`
      })
    });
    this.map = new ol.Map({
      target: 'map',
      view: this.view,
      layers: [this.baseLayer, this.vectorLayer]
    });

    if(this.mapMode == MapMode.ADD_POINT) {
      this.contextmenuItems = this.contextmenuItems.concat(this.contextMenuAddPointElements);
      this.contextmenuItems = this.contextmenuItems.concat(this.contextMenuClearPath);
    }

    this.contextmenu = new ContextMenu({
      width: 220,
      items: this.contextmenuItems
    });

    this.map.addControl(this.contextmenu);
    this.contextmenu.on('open', this.contexMenuOpenEvent);
    this.map.on('click', (evt) => {
      let feature = this.map.forEachFeatureAtPixel(evt.pixel, (feature, one) => {
        const marker = this.mapMarkers.findByOl_uid(feature.ol_uid);
        if(marker != null) {
          this.displayFeatureInfo(feature, marker.index);
        }

        return feature;
      });
    });

    if(this.isIOSMode) {
      this.map.getViewport().addEventListener("touchstart", this.touchstart, false);
      this.map.getViewport().addEventListener("touchend", () => {
          this.clearIPhonePressTimer(true, null);
      }, false);
      this.map.getViewport().addEventListener("touchcancel", () => {
        this.clearIPhonePressTimer(true, null);
      }, false);
      this.map.getViewport().addEventListener("touchmove", (event) => {
        this.clearIPhonePressTimer(false, event);
      }, false);
      this.map.on('pointerdrag',(event) => {
        this.clearIPhonePressTimer(false, event);
      });
      this.map.on('pointermove', (event) => {
        this.clearIPhonePressTimer(false, event);
      });
      this.map.on('moveend', (event) => {
        this.clearIPhonePressTimer(true, event);
      });
    }

    this.map.once('postrender', (event) => {
      setTimeout(() => {
          this.onChangePoints();
        },
      2000);
    });
  }

  setCentreByGeoposition() {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition((pos) => {
      var crd = pos.coords;
      this.setCenter([crd.longitude, crd.latitude]);
    }, (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }, options);
  }

  clearIPhonePressTimer(force, event) {
    if(force) {
        clearTimeout(this.iPhonePressTimer);
    } else {
      if(this.iPhonePressPosition && event && event.pixel) {
        var pixel = event.pixel;
        if(this.iPhonePressPosition[0] > pixel[0] + 20 || this.iPhonePressPosition[0] < pixel[0] - 20 ||
          this.iPhonePressPosition[1] > pixel[1] + 20 || this.iPhonePressPosition[1] < pixel[1] - 20) {
          this.iPhonePressPosition = null;
          clearTimeout(this.iPhonePressTimer);
        }
      }
    }
  }

  private clearAllElements() {
    const features = this.vectorLayer.getSource().getFeatures();
    features.forEach((feature) => {
      this.vectorLayer.getSource().removeFeature(feature);
    });
    this.mapMarkers.clear();
  }

  setMapCenter(lon: number, lat: number) {
    this.setCenter([lon, lat]);
  }


  onChangePoints() {
    this.mapMarkers = new MapMarkers();
    this.clearAllElements();
    this.mapPoints.forEach((el: MapVacancyPropertyPoint) => {
      let coords = [el.lon, el.lat];
      coords = this.convertFromLonLatToGeodetic(coords);
      this.mapMarkers.pushMarker(this.marker(PointType.POINT, coords, el.index, el.id));
    });

    this.refreshMap();
  }

  private convertFromGeodeticToLonLat(coordinate) {
    return ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
  }

  private convertFromLonLatToGeodetic(coordinate) {
    const prepCoordinate = [parseFloat(coordinate[0]), parseFloat(coordinate[1])];

    const coords = ol.proj.transform(prepCoordinate, 'EPSG:4326', 'EPSG:3857');
    coords[0] = Math.abs(coords[0]);
    coords[1] = Math.abs(coords[1]);
    return coords;
  }

  private marker(pointType: PointType, coordinate, index, id): IMarker {
    const feature = new ol.Feature({
      type: 'removable',
      geometry: new ol.geom.Point(coordinate)
    });

    feature.setStyle(this.mapMarkers.getIconStyle(pointType));
    var dragInteraction = new ol.interaction.Modify({
      features: new ol.Collection([feature]),
      style: null,
      pixelTolerance: 20
    });

    dragInteraction.on('modifyend', this.dragInteractionHandle, feature);
    this.map.addInteraction(dragInteraction);
    this.vectorLayer.getSource().addFeature(feature);

    return {
      interaction: dragInteraction,
      feature: feature,
      index: index,
      pointType: pointType,
      id
    };
  }

  private displayFeatureInfo(feature, index) {
    const pixel = this.map.getPixelFromCoordinate(
      feature.getGeometry().getCoordinates()
    );

    if(feature) {
      const point = this.mapPoints.find(el => el.index == index);
      var text = point.addr;
      this.target.style.cursor = "pointer";
    }
    else {
      this.hideFeatureInfo();
    }
  }

  private hideFeatureInfo() {
    // this.info.style.display = 'none';
    this.target.style.cursor = "";
  }

  private refreshMap() {
    this.hideFeatureInfo();
  }

  private dragInteractionHandle = (event) => {
    const oldMarker = this.mapMarkers.findByOl_uid(event.target.ol_uid);
    if(oldMarker == null) {
      return;
    }

    const newMarker = this.changePoint(
      oldMarker,
      { coordinate: oldMarker.feature.values_.geometry.flatCoordinates}
    );

    this.mapMarkers.replaceMarker(oldMarker.interaction.ol_uid, newMarker);
    const point = this.mapPoints.find(el => el.index == newMarker.index);
    if(point != null) {
      const coord = this.convertFromGeodeticToLonLat(newMarker.feature.values_.geometry.flatCoordinates);
      point.lon = coord[0];
      point.lat = coord[1];
      point.addr = 'index: ' + point.index + ', address: ' + coord;
    }

    this.refreshMap();
  };

}

