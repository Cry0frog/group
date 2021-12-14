import { Category } from './../category/category';
import { ErrorHandler } from '../error/errorHandler';

export class ShortCategory extends ErrorHandler {

  constructor() {
    super();
    this.category = new Category();
  }

  id: number;
  idCategory: number;
  nameCategory: string;
  category: Category;

  public static convertToObj(obj): ShortCategory {
    if(obj == null) {
      return null;
    }

    const resp = new ShortCategory();
    Object.assign(resp, obj);
    resp.category = Category.convertToObj(obj.category, false);
    return resp;
  }
}
