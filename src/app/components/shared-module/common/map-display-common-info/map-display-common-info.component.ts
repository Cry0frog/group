import { Component, OnInit, Input } from '@angular/core';
import { MapTaskProperty } from 'src/app/models/task/properties/map/mapTaskProperty';
import { MapMarkers, IMarker } from '../../map-handler/mapMarkers';
import { MapTaskPropertyPoint } from 'src/app/models/task/properties/map/mapTaskPropertyPoint';
import { PointType } from 'src/app/models/task/properties/map/pointType';
import * as mapConfig from '../../map-handler/stylesConfiguration';
import { TypeCategoryProperty } from 'src/app/models/category/constructor/typeCategoryProperty';

declare var ol: any;
declare var ContextMenu: any;

@Component({
  selector: 'app-map-display-common-info',
  templateUrl: './map-display-common-info.component.html',
  styleUrls: ['./map-display-common-info.component.css']
})
export class MapDisplayCommonInfoComponent implements OnInit {

  @Input() mapProperty: MapTaskProperty;

  constructor() { }

  longitude: number;
  latitude: number;
  zoom = 12;
  host: string = 'http://localhost:8090';

  map: any;
  baseLayer: any;
  vectorLayer: any;
  view: any;
  contextmenu: any;

  info: any;
  target: any;

  mapMarkers: MapMarkers;
  orderCounter: number;
  indexCounter: number;

  private setLongitude() {
    if(this.mapProperty.points.length != 0) {
      this.mapProperty.points.forEach((point: MapTaskPropertyPoint) => {
        if(point.pointType == PointType.START || point.pointType == PointType.POINT || point.pointType == PointType.INTERMEDIATE) {
          this.longitude = Number(point.lon);
        }
      });
    }
    else {
      this.longitude = 39.200269;
    }
  }

  private setLatitude() {
    if(this.mapProperty.points.length != 0) {
      this.mapProperty.points.forEach((point: MapTaskPropertyPoint) => {
        if(point.pointType == PointType.START || point.pointType == PointType.POINT || point.pointType == PointType.INTERMEDIATE) {
          this.latitude = Number(point.lat);
        }
      });
    }
    else {
      this.latitude = 51.660781;
    }
  }

  private center = (obj) => {
    this.view.animate({
      duration: 700,
      center: obj.coordinate
    });
  };

  private contexMenuOpenEvent = (evt) => {
    var feature =	this.map.forEachFeatureAtPixel(evt.pixel, ft => ft);

    if(feature && feature.get('type') === 'removable') {
      this.contextmenu.clear();
    }
    else {
      this.contextmenu.clear();
      this.contextmenu.extend(this.contextmenuItems);
      this.contextmenu.extend(this.contextmenu.getDefaultItems());
    }
  };

  contextmenuItems = [
    {
      text: 'Центрировать',
      classname: 'bold',
      icon: mapConfig.centerIcon,
      callback: this.center
    }
  ];

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
    this.setLongitude();
    this.setLatitude();

    this.mapInit();

    this.orderCounter = 0;
    this.indexCounter = 0;

    this.info = document.getElementById('info');
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
        //url: `${this.host}/osm_tiles/{z}/{x}/{y}.png`
        url: `https://tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png`
      })
    });
    this.map = new ol.Map({
      target: 'map',
      view: this.view,
      layers: [this.baseLayer, this.vectorLayer]
    });

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
      })
    });

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

    this.map.once('postrender', (event) => {
      setTimeout(() => {
          this.onChangePoints();
        },
      2000);
    });
  }

  setMapCenter(lon: number, lat: number) {
    this.setCenter([lon, lat]);
  }

  onChangePoints() {
    this.mapMarkers = new MapMarkers();
    if(this.mapProperty.refProperty.type == TypeCategoryProperty.COORDINATE) {
      //this.clearAllElements();
      this.mapProperty.points.forEach((el: MapTaskPropertyPoint) => {
        let coords = [el.lon, el.lat];
        coords = this.convertFromLonLatToGeodetic(coords);

        this.mapMarkers.pushMarker(this.marker(el.pointType, coords, el.index, el.id));
      });
    }
    else if(this.mapProperty.refProperty.type == TypeCategoryProperty.COORDINATE_PATH) {
      this.mapProperty.points.forEach((el: MapTaskPropertyPoint) => {
        let coords: number[] = [parseFloat(el.lon), parseFloat(el.lat)];
        coords = this.convertFromLonLatToGeodetic(coords);
        coords[0] = Math.abs(coords[0]);
        coords[1] = Math.abs(coords[1]);
        this.mapMarkers.pushMarker(this.marker(el.pointType, coords, el.index, el.id));
      });
    }
    this.refreshMap();
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

    //dragInteraction.on('modifyend', this.dragInteractionHandle, feature);
    this.map.addInteraction(dragInteraction);
    this.vectorLayer.getSource().addFeature(feature);

    return {
      interaction: dragInteraction,
      feature: feature,
      index: index,
      pointType: pointType,
      id: id
    };
  }

  private displayFeatureInfo(feature, index) {
    const pixel = this.map.getPixelFromCoordinate(
      feature.getGeometry().getCoordinates()
    );

    this.info.style.left = pixel[0] + this.target.offsetLeft + 'px';
    this.info.style.top = (pixel[1] + this.target.offsetTop - 50) + 'px';

    if(feature) {
      const point = this.mapProperty.findPointByIndex(index);
      var text = point.addr;
      this.info.style.display = 'none';

      //info.setAttribute('[(ngModel)]', 'point.addr')
      this.info.innerHTML = text;
      this.info.style.display = 'block';
      this.target.style.cursor = "pointer";
    }
    else {
      this.hideFeatureInfo();
    }
  }

  private hideFeatureInfo() {
    this.info.style.display = 'none';
    this.target.style.cursor = "";
  }

  private refreshMap() {
    this.hideFeatureInfo();
  }
}
