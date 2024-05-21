import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Categories, CategoriesRes, MealsByCatRes, MealsByCategory } from '../interface/categories';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private readonly http: HttpClient) { }

  /* Obtiene la lista de todas las categorías */
  getCategoriesList(): Observable<Categories[]> {
    return this.http.get<CategoriesRes>(`${environment.url}categories.php`)
    .pipe(
      map((res: CategoriesRes) => {
        return res.categories
      })
    )
  }

  /* Obtiene la lista de recetas pertenecientes a cada categoría */
  getMealsByCategory(param: string): Observable<MealsByCategory[]> {
    return this.http.get<MealsByCatRes>(`${environment.url}filter.php?c=${param}`)
    .pipe(
      map((res: MealsByCatRes) => {
        return res.meals
      })
    )
  }
}