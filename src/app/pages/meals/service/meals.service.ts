import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Meals, MealsResponse } from '../interface/meals';

@Injectable({
  providedIn: 'root'
})
export class MealsService  {

  constructor(private readonly http: HttpClient) { }

  /* Obtiene una receta aleatoria */
  getRandomMeal(): Observable<Meals[]> {
    return this.http.get<MealsResponse>(`${environment.url}random.php`)
      .pipe(
        map((res: MealsResponse) => {
          return res.meals
        })
      )
  } 

  /* Obtiene la/las recetas que coincidan con el nombre ingresado */
  getMealByName(query: string): Observable<Meals[]> {
    return this.http.get<MealsResponse>(`${environment.url}search.php?s=${query}`)
      .pipe(
        map((res: MealsResponse) => {
          return res.meals
        })
      )
  }

  /* Obtiene la lista de recetas que coincidan con la primer letra */
  getMealsByLetter(query: string): Observable<Meals[]> {
    return this.http.get<MealsResponse>(`${environment.url}search.php?f=${query}`)
      .pipe(map((res: MealsResponse) => { 
        return res.meals
      })
    )
  }

  /* Obtiene los detalles de la receta de acuerdo a su id */
  getMealDetailsById(query: string): Observable<Meals[]> {
    return this.http.get<MealsResponse>(`${environment.url}lookup.php?i=${query}`)
      .pipe(map((res: MealsResponse) => {
        return res.meals
      }))
  }
}