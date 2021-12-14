import { RegionalCoefficient } from './../../../../../models/rates/regionalCoefficient';
import { RateService } from './../../../service/rate.service';
import { Component, OnInit } from '@angular/core';
import * as mapConfig from '../../../../shared-module/map-handler/stylesConfiguration';

declare var ol: any;

@Component({
  selector: 'app-region-rates',
  templateUrl: './region-rates.component.html',
  styleUrls: ['./region-rates.component.css']
})
export class RegionRatesComponent implements OnInit {

  map: any;
  baseLayer: any;
  vectorLayer: any;
  view: any;

  longitude: number = 39.200269;
  latitude: number = 44.660781;
  zoom = 5;
  host: string = 'https://gooddealonline.ru';
  coefficients: RegionalCoefficient[];
  highlight;
  choosen;
  choosenRegionalCoefficient: RegionalCoefficient;

  constructor(private rateService: RateService) {
    this.coefficients = [];
  }

  updateRegionalCoefficient() {
    if(this.choosenRegionalCoefficient.osmId == null) {
      alert('Проблема с данными региона: ' + this.choosenRegionalCoefficient.description);
      return;
    }
    this.rateService.addRegionalCoefficient(this.choosenRegionalCoefficient).subscribe((regCoef: RegionalCoefficient) => {
      if(!this.coefficients.some(el => el.osmId == regCoef.osmId)) {
        this.coefficients.push(regCoef);
      }

      this.choosenRegionalCoefficient.id = regCoef.id;
      const els = this.map.getLayers().getArray().filter(el => el.type == 'VECTOR');
      if(els.length == 0) {
        return;
      }
      els[0].getSource().dispatchEvent('change');
    });
  }

  ngOnInit() {
    this.reloadCoefficient();
  }

  reloadCoefficient() {
    this.rateService.getAllRegionalCoefficients().subscribe((coefficients: RegionalCoefficient[]) => {
      this.coefficients = coefficients;
      this.mapInit();
    });
  }

  private styleHandler = (feature) => {
    const myStyle = mapConfig.stylesMap[feature.get('type')];
    if (myStyle instanceof Function) {
      return myStyle(feature);
    }
    return myStyle;
  };

  getCoefficientByOsmId(feature): number {
    const osmId = Math.abs(parseInt(feature.values_.osm_id));
    const els = this.coefficients.filter(el => el.osmId == osmId);
    if(els.length == 0) {
      return 1;
    }
    return els[0].coefficient;
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
      })
    });

    var vector = new ol.layer.Vector({
      source: new ol.source.Vector({
        url: 'assets/geojson/handled_region_total.geojson',
        format: new ol.format.GeoJSON()
      }),
      style: (feature) => {
        this.style.getText().setText(feature.get('name') 
          + `(${this.getCoefficientByOsmId(feature)})`
        );
        return this.style;
      }
    });
    
    this.map = new ol.Map({
      target: 'map',
      view: this.view,
      layers: [this.baseLayer,
        vector
      ]
    });

    const featureOverlay = new ol.layer.Vector({
      source: new ol.source.Vector(),
      map: this.map,
      style: (feature) => {
        this.highlightStyle.getText().setText(feature.get('name')
        + `(${this.getCoefficientByOsmId(feature)})`);
        return this.highlightStyle;
      }
    });

    const displayFeatureInfo = (pixel) => {
      var feature = this.map.forEachFeatureAtPixel(pixel, (feature) => {
        return feature;
      });
    
      var info = document.getElementById('info');
      if(feature) {
        //info.innerHTML = feature.getId() + ': ' + feature.get('name');
      }
      else {
        //info.innerHTML = '&nbsp;';
      }

      if(feature !== this.highlight) {
        if(this.highlight) {
          featureOverlay.getSource().removeFeature(this.highlight);
        }
        if (feature) {
          featureOverlay.getSource().addFeature(feature);
        }
        this.highlight = feature;
      }

      return this.highlight;
    };

    this.map.on('pointermove', (evt) => {
      if (evt.dragging) {
        return;
      }
      var pixel = this.map.getEventPixel(evt.originalEvent);
      displayFeatureInfo(pixel);
    });

    this.map.on('click', (evt) => {
      this.choosen = displayFeatureInfo(evt.pixel);
      if(this.choosen == null) {
        return;
      }

      const strChoosenOsmId = this.choosen.values_.osm_id;
      const choosenOsmId = Math.abs(parseInt(strChoosenOsmId));

      const els = this.coefficients.filter(el => el.osmId == choosenOsmId);
      if(els.length == 0) {
        this.choosenRegionalCoefficient = new RegionalCoefficient();
        this.choosenRegionalCoefficient.coefficient = 1;
        this.choosenRegionalCoefficient.osmId = choosenOsmId;
        this.choosenRegionalCoefficient.description = this.choosen.values_.name + ', региональный коэффициент';
        return;
      }

      this.choosenRegionalCoefficient = els[0];
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
  }

  setCenter = (coordinate) => {
    this.view.setCenter(ol.proj.fromLonLat([coordinate[0], coordinate[1]]));
  };

  style = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.6)'
    }),
    stroke: new ol.style.Stroke({
      color: '#319FD3',
      width: 1
    }),
    text: new ol.style.Text({
      font: '12px Calibri,sans-serif',
      fill: new ol.style.Fill({
        color: '#000'
      }),
      stroke: new ol.style.Stroke({
        color: '#fff',
        width: 3
      })
    })
  });

  highlightStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#FF8000',
      width: 1
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255, 89, 0, 0.1)', //'rgba(255,0,0,0.1)'
    }),
    text: new ol.style.Text({
      font: '12px Calibri,sans-serif',
      fill: new ol.style.Fill({
        color: '#000'
      }),
      stroke: new ol.style.Stroke({
        color: '#FF8000',
        width: 3
      })
    })
  });
  
}
