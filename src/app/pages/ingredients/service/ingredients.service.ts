import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Ingredients, IngredientsResponse } from '../interface/ingredients';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {

  constructor(private readonly http: HttpClient) { }

  /* Se obtiene la lista de todos los ingredientes */
  getIngredientsList(): Observable<Ingredients[]> {
    return this.http.get<IngredientsResponse>(`${environment.url}list.php?i=list`)
    .pipe(
      map((res: IngredientsResponse) => {
        return res.meals
      })
    )
  }
}
