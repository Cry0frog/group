export enum TypeCategoryProperty {
  STRING = "STRING",
  LONG_STRING = "LONG_STRING",
  COORDINATE = "COORDINATE",
  COORDINATE_PATH = "COORDINATE_PATH",
  DATE = "DATE",
  DATETIME = "DATETIME",
  DATETIME_INTERVAL = "DATETIME_INTERVAL"
}

export const TYPE_CATEGORY_SIMPLE_SECTION: TypeCategoryProperty[] = [
  TypeCategoryProperty.STRING,
  TypeCategoryProperty.LONG_STRING
];

export const TYPE_CATEGORY_MAP_SECTION: TypeCategoryProperty[] = [
  TypeCategoryProperty.COORDINATE,
  TypeCategoryProperty.COORDINATE_PATH
];

export const TYPE_CATEGORY_DATE_SECTION: TypeCategoryProperty[] = [
  TypeCategoryProperty.DATE,
  TypeCategoryProperty.DATETIME,
  TypeCategoryProperty.DATETIME_INTERVAL
];
