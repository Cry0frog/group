import { TypeCategoryProperty, TYPE_CATEGORY_MAP_SECTION,
  TYPE_CATEGORY_SIMPLE_SECTION, TYPE_CATEGORY_DATE_SECTION
} from './typeCategoryProperty';

export class BaseCategoryProperty {
  id: number;
  title: string;
  exampleText: string;

  order: number;
  type: TypeCategoryProperty;

  getClassName() {
    return 'base';
  }

  static convertToObj(obj: any): BaseCategoryProperty {
    if(obj == null) {
      return null;
    }
    const catProp = new BaseCategoryProperty();
    Object.assign(catProp, obj);

    return catProp;
  }

  isString(): boolean {
    return this.type == TypeCategoryProperty.STRING;
  }

  isLongString(): boolean {
    return this.type == TypeCategoryProperty.LONG_STRING;
  }

  isCoordinate(): boolean {
    return this.type == TypeCategoryProperty.COORDINATE;
  }

  isCoordinatePath(): boolean {
    return this.type == TypeCategoryProperty.COORDINATE_PATH;
  }

  isDate(): boolean {
    return this.type == TypeCategoryProperty.DATE;
  }

  isDateTime(): boolean {
    return this.type == TypeCategoryProperty.DATETIME;
  }

  isDateTimeInterval(): boolean {
    return this.type == TypeCategoryProperty.DATETIME_INTERVAL;
  }

  isOnePropDateCategoryPropertyType() {
    return this.isDate() || this.isDateTime();
  }

  isSimpleCategoryPropertyType(): boolean {
    return TYPE_CATEGORY_SIMPLE_SECTION.includes(this.type);
  }

  isMapCategoryPropertyType(): boolean {
    return TYPE_CATEGORY_MAP_SECTION.includes(this.type);
  }

  isDateCategoryPropertyType(): boolean {
    return TYPE_CATEGORY_DATE_SECTION.includes(this.type);
  }

}
