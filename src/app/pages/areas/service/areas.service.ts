import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Area, AreaResponse, MealByArea, MealByAreaRes } from '../interface/area';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AreasService {

  constructor(private readonly http: HttpClient) { }

  /* Lista de todas las regiones */
  getCountriesList(): Observable<Area[]> {
    return this.http.get<AreaResponse>(`${environment.url}list.php?a=list`)
      .pipe(
        map((res: AreaResponse) => {
          return res.meals
        })
      )
  } 

  /* Lista las recetas de acuerdo a la región */
  getMealsByCountry(param: string): Observable<MealByArea[]> {
    return this.http.get<MealByAreaRes>(`${environment.url}filter.php?a=${param}`)
      .pipe(
        map((res: MealByAreaRes) => {
          return res.meals
        })
      )
  }  
}
