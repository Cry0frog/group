import { Component, OnInit } from '@angular/core';
import { MapTaskPropertyPoint } from 'src/app/models/task/properties/map/mapTaskPropertyPoint';
import { MapTaskProperty } from 'src/app/models/task/properties/map/mapTaskProperty';
import { BaseCategoryProperty } from '../../../../models/category/constructor/baseCategoryProperty';
import { TypeCategoryProperty } from 'src/app/models/category/constructor/typeCategoryProperty';
import { PointType } from 'src/app/models/task/properties/map/pointType';

@Component({
  selector: 'app-legal-information',
  templateUrl: './legal-information.component.html',
  styleUrls: ['./legal-information.component.css']
})
export class LegalInformationComponent implements OnInit {
  mapTaskProperty: MapTaskProperty;
  refProperty: BaseCategoryProperty;
  points: MapTaskPropertyPoint[];
  point: MapTaskPropertyPoint;

  constructor() {
    this.mapTaskProperty = new MapTaskProperty();

    this.refProperty = new BaseCategoryProperty();
    this.refProperty.type = TypeCategoryProperty.COORDINATE;
    
    this.point = new MapTaskPropertyPoint();
    this.point.addr = "index: 0, address: 61.673856,50.826742";
    this.point.lat = "61.673856";
    this.point.lon = "50.826742";
    this.point.index = 0;
    this.point.pointType = PointType.POINT;

   }

  ngOnInit() {
    this.points = [this.point];
    this.mapTaskProperty.points = this.points;
    this.mapTaskProperty.refProperty = this.refProperty;
  }
}