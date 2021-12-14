import { ValidationError } from './validationError';

export class ErrorHandler {
  constructor() {
    this.isError = false;
  }

  isError: boolean;
  errors: ValidationError[];

  isHaveError(propName): boolean {
    return this.errors.filter((error: ValidationError) =>
      error.field == propName).length == 0 ? false: true;
  }

  getErrorDescr(propName): string {
    const filterErrors = this.errors.filter((error: ValidationError) => error.field == propName);
    return filterErrors.length == 0 ? '': filterErrors[0].defaultMessage;
  }

//for collection props
  isHaveErrorForProps(propNameTempl: string, i: number): boolean {
    const propName = propNameTempl ? this.buildPropName(propNameTempl, i) : null;
    const check = this.errors.filter((error: ValidationError) =>
      error.field == propName).length == 0 ? false: true;

    console.log('propName: ' + propName + ', i: ' + i + ', check: ' + check);
    return check;
  }

  getErrorDescrForProps(propNameTempl: string, i: number): string {
    if(propNameTempl == null) {
      const filterErrors = this.errors.filter((error: ValidationError) => error.field == null);
      return filterErrors.length == 0 ? '': filterErrors[i].defaultMessage;
    }

    const propName = this.buildPropName(propNameTempl, i);
    const filterErrors = this.errors.filter((error: ValidationError) => error.field == propName);
    return filterErrors.length == 0 ? '': filterErrors[0].defaultMessage;
  }

  private buildPropName(template: string, i: number): string {
    return template.replace('__INDEX_TEMP', i+'');
  }

  getErrorsWithoutFields(): ValidationError[] {
    return this.errors ? this.errors.filter(el => el.field == null) : null;
  }
}
