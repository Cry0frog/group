export class FieldActivity {
  constructor() {
    this.children = [];
  }

  id: number;
  name: string;
  nameExample: string;
  description: string;
  skills: string;
  published: boolean;
  folder: boolean;
  nameImg: string;
  root: FieldActivity;
  children: FieldActivity[];

  //only ui
  isExpanded: boolean;
  isShow: boolean;
  visibleJobHome: boolean;

  public static convertToObj(obj, isRoot): FieldActivity {
    if(obj == null) {
      return;
    }

    const dto: FieldActivity = new FieldActivity();
    Object.assign(dto, obj);

    dto.isShow = true;

    if(obj.root != null) {
      dto.root = this.convertToObj(obj.root, true);
    }

    if(obj.children != null) {
      dto.children = obj.children.map(el => this.convertToObj(el, false));
    }

    return dto;
  }

  static getFieldsAcivityInRows(categories: FieldActivity[]): FieldActivity[] {
    let categoryInRows: FieldActivity[] = [];
    let candSort: FieldActivity[] = [];

    categories = this.sortedArray(categories);

    categories.forEach((category: FieldActivity) => {
      category.isShow = true;
      categoryInRows.push(category);
      if(category.children != null && category.children.length != 0) {
        category.children.forEach((child: FieldActivity) => {
          child.isShow = false;
          candSort.push(child);
        });
        categoryInRows = categoryInRows.concat(this.sortedArray(candSort))
        candSort = [];
      }
    });
    const finalCategories: FieldActivity[] = categoryInRows;
    return finalCategories;
  }

  static sortedArray(categories: FieldActivity[]): FieldActivity[] {
    return categories.sort((a, b) => {
       return a.id - b.id;
    });
  }
}
