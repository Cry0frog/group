import { FilterStatusVacancy } from 'src/app/models/vacancy/filterStatusVacancy';
import { ShortVacancy } from 'src/app/models/vacancy/shortVacancy';
import { LazyLoadingModel } from "../lazyLoading/lazyLoadingModel";

export class ShortVacanciesWithCountedPages extends LazyLoadingModel{
  constructor() {
    super();
    this.vacancies = [];
  }

  vacancies: ShortVacancy[];
  filterStatusVacancy: FilterStatusVacancy;

  public static convertToObj(obj): ShortVacanciesWithCountedPages {
    if(obj == null) {
      return null;
    }

    const vacancieseWithCountedPages = new ShortVacanciesWithCountedPages();
    Object.assign(vacancieseWithCountedPages, obj);
    vacancieseWithCountedPages.vacancies = obj.vacancies.map(obj => ShortVacancy.convertToObj(obj));

    return vacancieseWithCountedPages;
  }
}
