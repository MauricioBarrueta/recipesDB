import { Component, OnInit } from '@angular/core';
import { MealsService } from './service/meals.service';
import { catchError, tap, throwError } from 'rxjs';
import { Meals } from './interface/meals';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.scss', 
})
export class MealsComponent implements OnInit {

  constructor(private readonly mealsService: MealsService, private route: ActivatedRoute) {}

  meals$: Meals[] = []
  meal$: Meals[] = []
  ingredients$: string[] = []
  defaultLetter!: string

  dataNotFound: string = ''
  dataStatus: string = ''
  divStatusClass: string = 'hide'
  title!: string

  imgPath: string = `${environment.imagesPath}`
  flagsPath: string = `${environment.flagsPath}`

  //* 3. Se recupera el valor del parámetro 'letter' y se asigna a una variable local para su posterior uso  
  ngOnInit(): void {   
    this.route.queryParams.subscribe(params => { this.defaultLetter = params['l'] });
    this.getMealsByLetter()
  }

  /* Se filtran los resultados de acuerdo a la letra del alfabeto seleccionada */
  getMealsByLetter() {
    this.title = `Lista de recetas que inician con la letra: '${this.defaultLetter}'`
    window.scrollTo(0, 0)
    this.mealsService.getMealsByLetter(this.defaultLetter)
      .pipe(
        catchError(error => { return throwError(() => error)}),
        tap((res: Meals[]) => {           
          this.meals$ = res
          this.meals$ === null ? (this.dataNotFound = environment.notFound, this.dataStatus = environment.mealNotFoundText, 
            this.divStatusClass = 'visible', this.title = '') : (this.dataNotFound = '', this.dataStatus = '', this.divStatusClass = 'hide')     
        })
      )
      .subscribe()
  }

  /* Se obtiene el valor del botón seleccionado procedente del componente Header */
  getButtonValue(value: string) {
    this.defaultLetter = value
    this.getMealsByLetter()
  }

  /* Se obtiene el id de la receta y se inyecta la lista de ingredientes y medidas para darles formato */
  getSelectedMealId(id: string) {
    this.ingredients$ = []
    if(this.ingredients$.length === 0) {
      this.mealsService.getMealDetailsById(id)
      .pipe(
        catchError(error => { return throwError(() => error) }),
        tap((res: Meals[]) => {
          this.meal$ = res
          this.meal$.forEach((meal: any) => {
            for (let i = 1; i <= 20; i++) {   
              if (meal[`strIngredient${i}`]) {
                this.ingredients$.push(`${meal[`strIngredient${i}`]}: ${meal[`strMeasure${i}`]}`)
              } else { break }
            }
          });
        })
      )
      .subscribe()
    }    
  }
}