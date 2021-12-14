import { WEIGHT_CATEGORY_MAPPER, TRANSPORT_CATEGORY_MAPPER, IWeightCategoryMapper, ITransportCategoryMapper, IProductCategoryMapper, PRODUCT_CATEGORY_MAPPER, ICalcModeMapper, CALC_MODE_MAPPER } from '../../../../../../common/task.description';
import { TYPE_CATEGORY_SIMPLE_SECTION, TYPE_CATEGORY_DATE_SECTION,
    TYPE_CATEGORY_MAP_SECTION } from '../../../../../../models/category/constructor/typeCategoryProperty';
import { BaseCategoryProperty } from '../../../../../../models/category/constructor/baseCategoryProperty';
import { DateCategoryProperty } from '../../../../../../models/category/constructor/date/dateCategoryProperty';
import { MapCategoryProperty } from '../../../../../../models/category/constructor/map/mapCategoryProperty';
import { CATEGORY_TYPES, ICategoryStatusMapper,
  CATEGORY_STATUSES, ICategoryPropertyPayoutTypesMapper,
  CATEGORY_PROPERTY_PAYOUT_TYPES_CREATION_MAPPER,
  LOCATION_TYPE_MAPPER, ILocationTypeMapper
} from '../../../../../../common/category.description';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Category } from 'src/app/models/category/category';
import { ICategoryTypeMapper } from 'src/app/common/category.description';
import { CategoryProperty } from 'src/app/models/category/constructor/simple/categoryProperty';
import { CategoryStatus } from 'src/app/models/category/categoryStatus';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  categoryStatuses: ICategoryStatusMapper[] = CATEGORY_STATUSES;
  categoryPropPayoutTypes: ICategoryPropertyPayoutTypesMapper[] = CATEGORY_PROPERTY_PAYOUT_TYPES_CREATION_MAPPER;
  locationTypes: ILocationTypeMapper[] = LOCATION_TYPE_MAPPER;

  transportCategoryMapper: ITransportCategoryMapper[] = TRANSPORT_CATEGORY_MAPPER;
  weightCategoryMapper: IWeightCategoryMapper[] = WEIGHT_CATEGORY_MAPPER;
  categoryProductMapper: IProductCategoryMapper[] = PRODUCT_CATEGORY_MAPPER;
  calcModeMapper: ICalcModeMapper[] = CALC_MODE_MAPPER;

  constructor(public dialogRef: MatDialogRef<AddCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category) { }

  ngOnInit() {
    this.data.status = CategoryStatus.PUBLISHED;
  }

  getCategoryTypesByType(prop: BaseCategoryProperty): ICategoryTypeMapper[] {
    if(TYPE_CATEGORY_SIMPLE_SECTION.includes(prop.type)) {
      return CATEGORY_TYPES.filter(el => TYPE_CATEGORY_SIMPLE_SECTION.includes(el.value));
    }
    else if(TYPE_CATEGORY_MAP_SECTION.includes(prop.type)) {
      return CATEGORY_TYPES.filter(el => TYPE_CATEGORY_MAP_SECTION.includes(el.value));
    }
    else if(TYPE_CATEGORY_DATE_SECTION.includes(prop.type)) {
      return CATEGORY_TYPES.filter(el => TYPE_CATEGORY_DATE_SECTION.includes(el.value))
    }
  }

  addSimpleProp(): void {
    this.data.properties.push(
      CategoryProperty.createEmptyProperty(this.data.orderCounter++)
    );
  }

  addMapProp(): void {
    this.data.properties.push(
      MapCategoryProperty.createEmptyMapProperty(this.data.orderCounter++)
    );
  }

  addDateProp(): void {
    this.data.properties.push(
      DateCategoryProperty.createEmptyDateProperty(this.data.orderCounter++)
    );
  }

  onRemoveProperty(prop: CategoryProperty) {
    this.data.properties = this.data.properties
      .filter(el => el.order != prop.order);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
