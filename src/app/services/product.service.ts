import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { catchError, map, Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient
  ) { }

  getCategorys(): Observable<any> {
    return this.http.get<any[]>(environment.json + 'categorys.json').pipe(map(result => result, () => {
      return false;
    }), catchError(error => {
      return of(false);
    }));
  }

  getProducts(): Observable<any> {
    return this.http.get<any[]>(environment.json + 'products.json').pipe(map(result => result, () => {
      return false;
    }), catchError(error => {
      return of(false);
    }));
  }
}
