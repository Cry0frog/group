import { Category } from 'src/app/models/category/category';

export class CategoryTree extends Category {
  //isExpanded: boolean;
  isShow: boolean;

  static convertToObj(obj: any, isPreparePayoutType: boolean): CategoryTree {
    if(obj == null) {
      return null;
    }
    const categoryTree: CategoryTree = <CategoryTree>Category.convertToObj(obj, isPreparePayoutType);
    categoryTree.isShow = true;
    //categoryTree.isExpanded = false;

    return categoryTree;
  }

  static getCategoriesInRows(categories: CategoryTree[]): CategoryTree[] {
    let categoryInRows: CategoryTree[] = [];
    let candSort: CategoryTree[] = [];

    categories = this.sortedArray(categories);

    categories.forEach((category: CategoryTree) => {
      category.isShow = true;
      categoryInRows.push(category);
      if(category.children != null && category.children.length != 0) {
        category.children.forEach((child: CategoryTree) => {
          child.isShow = false;
          candSort.push(child);
        });
        categoryInRows = categoryInRows.concat(this.sortedArray(candSort))
        candSort = [];
      }
    });
    const finalCategories: CategoryTree[] = categoryInRows;
    return finalCategories;
  }

  static sortedArray(categories: CategoryTree[]): CategoryTree[] {
    return categories.sort((a, b) => {
       return a.order - b.order;
    });
  }

  static createCategoryBasedOnEtalon(etalon: CategoryTree) {
    const categoryTree: CategoryTree = <CategoryTree>Category.convertToObj(etalon, false);
    categoryTree.id = null;
    if(categoryTree.properties != null) {
      categoryTree.properties.forEach(prop => prop.id = null);
    }

    return categoryTree;
  }

}
