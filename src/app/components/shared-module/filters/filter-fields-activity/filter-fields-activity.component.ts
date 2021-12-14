import { FieldActivity } from './../../../../models/field-activity/fileldActivity';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter-fields-activity',
  templateUrl: './filter-fields-activity.component.html',
  styleUrls: ['./filter-fields-activity.component.css']
})
export class FilterFieldsActivityComponent implements OnInit {

  @Input() fieldsActivity: FieldActivity[];
  @Input() choosenFieldsActivity: FieldActivity[];
  @Input() choosenFieldAsctivityIds: number[];
  @Input() isMobileMode: boolean;
  @Output() toggleFieldAcivityEvents = new EventEmitter<FieldActivity>();

  constructor() { }

  ngOnInit() {
  }

  getSortedById(fieldsActivity: FieldActivity[]): FieldActivity[] {
    return FieldActivity.sortedArray(fieldsActivity);
  }

  isChoosenChild(fieldCategory: FieldActivity): boolean {
    if(fieldCategory.folder) {
      this.choosenFieldAsctivityIds.forEach(choose => {
        if(fieldCategory.children.map(el => el.id).includes(choose)) {
          return true;
        }
     });
    }
    return false;
  }

  isChooseCategory(fieldCategory: FieldActivity): boolean {
    return this.choosenFieldAsctivityIds.includes(fieldCategory.id);
  }

  toggleCategory(category) {
    this.toggleFieldAcivityEvents.emit(category);
  }

}
