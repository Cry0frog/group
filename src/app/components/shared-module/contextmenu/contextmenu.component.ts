import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MapActions } from '../map-handler/mapAction';
import { MapMode } from '../map-handler/mapMode';

@Component({
  selector: 'app-contextmenu',
  templateUrl: './contextmenu.component.html',
  styleUrls: ['./contextmenu.component.css']
})
export class ContextmenuComponent implements OnInit {

  @Input() mapMode: MapMode;
  @Output() mapActionEvent = new EventEmitter<MapActions>();

  constructor() { }

  ngOnInit() {
  }

  handlerMapActions(mapAction) {
    this.mapActionEvent.emit(mapAction);
  }

  isAddPathMode(): boolean {
    return this.mapMode == MapMode.ADD_PATH;
  }

  isDeletePointMode(): boolean {
    return this.mapMode == MapMode.DELETE_POINT;
  }

  isAddPointMode(): boolean {
    return this.mapMode == MapMode.ADD_POINT;
  }

}
