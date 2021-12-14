import { ProductCategory } from './../task/properties/map/productCategory';
import { WeightCategory } from '../task/properties/map/weightCategory';
import { TransportCategory } from './../task/properties/map/transportCategory';
import { LocationType } from './../task/properties/map/locationType';
import { ErrorHandler } from './../error/errorHandler';
import { MapCategoryProperty } from './constructor/map/mapCategoryProperty';
import { DateCategoryProperty } from './constructor/date/dateCategoryProperty';
import { BaseCategoryProperty } from './constructor/baseCategoryProperty';
import { CategoryPropertyPayoutTypes, REGULAR_PAYOUT_TYPES } from './constructor/categoryPropertyPayoutTypes';
import { TypeCategoryProperty, TYPE_CATEGORY_SIMPLE_SECTION, TYPE_CATEGORY_DATE_SECTION, TYPE_CATEGORY_MAP_SECTION } from './constructor/typeCategoryProperty';
import { CategoryProperty } from './constructor/simple/categoryProperty';
import { CategoryStatus } from './categoryStatus';

export class Category extends ErrorHandler {
  constructor() {
    super();
    this.folder = false;
    this.minCost = 100;
    this.showImages = false;
  }

  static PROP_TYPE = "@type";

  id: number;
  name: string;
  description: string;
  status: CategoryStatus;
  changed: boolean;
  fast: boolean;
  showImages: boolean;
  showDocs: boolean;

  order: number;

  /*only for COORDINATE_PATH*/
  showReadyToPay: boolean;
  /**/
  payMessage: string;

  folder: boolean;

  root: Category;
  children: Category[];

  properties: BaseCategoryProperty[];
  availablePayoutTypes: CategoryPropertyPayoutTypes[];
  availableLocationTypes: LocationType[];

  availableTransportCategories: TransportCategory[];
  availableWeightCategories: WeightCategory[];
  availableProductCategories: ProductCategory[];

  orderCounter: number;

  visibleHome: boolean;
  nameImg: string;
  showAdminNotice: boolean;
  adminNoticeText: string;

  minCost: number;

  isExpanded: boolean;

  isEmptyPayMessage(): boolean {
    return this.payMessage == null || this.payMessage == '';
  }

  isRootDirectory() {
    return this.folder == true;
  }

  isChild(): boolean {
    return this.root != null;
  }

  isRootWithArgs() {
    return this.folder == true && this.children != null
      && this.children.length > 0;
  }

  isPublished(): boolean {
    return this.status == CategoryStatus.PUBLISHED;
  }

  isOneSimpleProperty(): boolean {
    return this.properties != null && this.properties.filter(el =>
      TYPE_CATEGORY_SIMPLE_SECTION.includes(el.type)).length != 0;
  }

  isOneDateProperty(): boolean {
    return this.properties != null && this.properties.filter(el =>
      TYPE_CATEGORY_DATE_SECTION.includes(el.type)).length != 0;
  }

  isOneMapProperty(): boolean {
    return this.properties != null && this.properties.filter(el =>
      TYPE_CATEGORY_MAP_SECTION.includes(el.type)).length != 0;
  }

  isAllowToChooseReadyToPayOption(): boolean {
    return this.properties != null && this.properties.filter(el =>
      el.type == TypeCategoryProperty.COORDINATE_PATH
    ).length != 0;
  }

  getMapCategoryProperty(): MapCategoryProperty {
    if(this.properties == null || this.properties.length == 0) {
      return null;
    }

    const els = this.properties.filter(el => TYPE_CATEGORY_MAP_SECTION.includes(el.type));
    if(els.length == 0) {
      return null;
    }
    return <MapCategoryProperty>els[0];
  }

  prepareBeforeSave() {
    if(this.folder) {
      return;
    }
    this.properties.forEach((el: BaseCategoryProperty) => {
      el[Category.PROP_TYPE] = el.getClassName();
    });
    if(this.root != null) {
      this.root.children = null;
    }

    if(this.availablePayoutTypes.includes(CategoryPropertyPayoutTypes.REGULAR)) {
      this.availablePayoutTypes = this.availablePayoutTypes.filter(
        el => el != CategoryPropertyPayoutTypes.REGULAR
      );
      this.availablePayoutTypes.push(CategoryPropertyPayoutTypes.REGULAR_CARD);
      this.availablePayoutTypes.push(CategoryPropertyPayoutTypes.REGULAR_CASH);
      this.availablePayoutTypes.push(CategoryPropertyPayoutTypes.REGULAR_NOT_PRINCIPAL);
      this.availablePayoutTypes.push(CategoryPropertyPayoutTypes.REGULAR_ACCOUNT);
    }
  }

  getSortedPropertiesByOrder() {
    return this.properties.sort(
      (a: BaseCategoryProperty, b: BaseCategoryProperty) =>
        (a.order > b.order) ? 1 : (a.order === b.order) ? 0 : -1
    );
  }

  static getSortedById(categories: Category[]): Category[] {
    if(categories == null) {
      return [];
    }

    return categories.sort((a: Category, b: Category) =>
      (a.id > b.id) ? 1
      : (a.id === b.id) ? 0
      : -1
    );
  }

  static sortedArrayByOrder(categories: Category[]): Category[] {

    if(categories == null) {
      return [];
    }

    return categories.sort((a, b) => {
       return a.order - b.order;
    });
  }

  static convertToObj(obj: any, isPreparePayoutType: boolean): Category {
    if(obj == null) {
      return null;
    }
    const category: Category = new Category();
    Object.assign(category, obj);
    category.isExpanded = false
    if(category.properties != null) {
      const props = [];
      category.properties.forEach((prop: BaseCategoryProperty) => {
        if(obj == null) {
          return null;
        }
        if(TYPE_CATEGORY_SIMPLE_SECTION.includes(prop.type)) {
          const catProp = new CategoryProperty();
          Object.assign(catProp, prop);
          props.push(catProp);
        }
        else if(TYPE_CATEGORY_DATE_SECTION.includes(prop.type)) {
          const catProp = new DateCategoryProperty();
          Object.assign(catProp, prop);
          props.push(catProp);
        }
        else if(TYPE_CATEGORY_MAP_SECTION.includes(prop.type)) {
          const catProp = new MapCategoryProperty();
          Object.assign(catProp, prop);
          props.push(catProp);
        }
      });
      category.properties = props;

      if(category.properties.length != 0) {
        category.orderCounter = category.properties.reduce((prev, cur) => {
          return (prev.order > cur.order) ? prev : cur;
        }).order + 1;
      }
      else {
        category.orderCounter = 0;
      }
    }

    if(isPreparePayoutType && category.availablePayoutTypes != null) {
      if(category.availablePayoutTypes.some(el => REGULAR_PAYOUT_TYPES.includes(el))) {
        category.availablePayoutTypes.push(CategoryPropertyPayoutTypes.REGULAR);
      }
    }

    if(category.children != null) {
      category.children = category.children.map((child: Category) => this.convertToObj(child, isPreparePayoutType));
    }

    return category;
  }

  static createEmptyCategory(): Category {
    const category: Category = new Category();
    category.folder = false;
    category.properties = [];
    category.availablePayoutTypes = [];
    category.status = CategoryStatus.HIDE;
    category.changed = true;
    category.orderCounter = 0;
    category.folder = false;
    return category;
  }

  static createDefaultEmptyFolder(): Category {
    const folder: Category = new Category();
    folder.status = CategoryStatus.HIDE;
    folder.changed = true;
    folder.folder = true;

    return folder;
  }

  static createDefaultEmptyCategory(): Category {
    const category: Category = new Category();
    category.properties = [];
    category.availablePayoutTypes = [
        CategoryPropertyPayoutTypes.SECURE,
        CategoryPropertyPayoutTypes.REGULAR
    ];
    category.availableLocationTypes = [
      LocationType.REMOTELY,
      LocationType.AT_PERFORMER,
      LocationType.AT_CUSTOMER,
      LocationType.NOT_FUNDAMENTALY
    ];

    category.orderCounter = 0;

    const propName = new CategoryProperty();
    propName.placeholder = "Название объявления";
    propName.exampleText = "Например: создание сайта под ключ";
    propName.type = TypeCategoryProperty.STRING;
    /*
    propName.order = category.orderCounter++;
    category.properties.push(propName);
    */

    const propDescription = new CategoryProperty();
    propDescription.title = "Опишите ваше задание";
    propDescription.placeholder = "Например: сделать лендинг для вебинаров по программированию."
        + " Нужно продумать структуру, подготовить контент. Цель — привлечь 30 человек на первое занятие";
    propDescription.exampleText = "Опишите пожелания и детали, чтобы исполнители лучше оценили вашу задачу";
    propDescription.exampleText = "Например: создание сайта под ключ";
    propDescription.type = TypeCategoryProperty.LONG_STRING;
    /*
    propDescription.order = category.orderCounter++;
    category.properties.push(propDescription);
    */

    category.status = CategoryStatus.HIDE;
    category.changed = true;
    return category;
  }
}
