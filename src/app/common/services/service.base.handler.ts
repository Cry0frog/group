import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './../../auth/auth.service';
import { Observable, of } from 'rxjs';

export class BaseHandlerService {

  static httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json;charset=utf-8'
    }),
    params: null
  };

  constructor(protected auth: AuthService) {}

  protected handleError<T> (operation = 'operation', result?: T) {
    return this.handleErrorWithHandler(operation, result, null);
  }

  protected handleErrorWithHandler<T> (operation = 'operation', result?: T,
      handler401 = () => {}) {
    return (error: any): Observable<T> => {
      debugger
      console.log('handle error: ' + operation);
      //TODO remove it
      if(error.status != 400 && error.status != 401 && error.status != 0) {
        alert('status: ' + error.status + ', handle error: ' + operation);
      }

      if(error.status == 401 || error.status == 403) {
        if(handler401 != null) {
          handler401();
        }
        this.auth.logout();
        return of(result as T);
      }
      else if(error.status == 400) {
        return of(error);
      }
      else {
        console.log(error);
      }
    };
  }

  protected log(message: string) {
    console.log(message);
  }

}
