import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MealsService } from '../service/meals.service';
import { catchError, tap, throwError } from 'rxjs';
import { Meals } from '../interface/meals';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-meal, app-meals',
  templateUrl: './meal.component.html',
  styleUrl: '../meals.component.scss'
})
export class MealComponent implements OnInit {

  meal$: Meals[] = []
  ingredients$: string[] = []
  nameQuery!: string

  dataNotFound!: string
  dataStatus!: string
  divStatusClass: string = 'hide'

  title!: string
  subtitle!: string
  imgPath: string = `${environment.imagesPath}`
  flagsPath: string = `${environment.flagsPath}`
  
  constructor(private readonly mealsService: MealsService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    /* Se obtiene el valor del parámetro 'n (name)' de la ruta */
    this.route.queryParams.subscribe(params => { this.nameQuery = params['n'] })
    this.getMealData()  
  }

  /* Se muestra una receta aleatoria o la/las recetas que coincidan con el parámetro ingresado, si es que existe */
  getMealData() {
    this.route.queryParams.subscribe(params => { this.nameQuery = params['n'] })
    if(this.nameQuery == undefined || this.nameQuery == null || this.nameQuery == '') {
      this.title = 'Esta es una receta obtenida de manera aleatoria:'
      this.subtitle = `¿Buscas alguna en específico? Ingresa el nombre en la parte superior, o bien, puedes filtrar los resultados por orden alfabético dando clic en cualquiera de los botones correspondientes a cada letra de la parte inferior.`
      this.mealsService.getRandomMeal()
        .pipe(
          catchError(error => { return throwError(() => error) }),
          tap((res: Meals[]) => {
            this.meal$ = res
            this.formatIngredientsList()
          })
        )
        .subscribe()
    } else { 
      this.getMealByName(this.nameQuery) 
    }
  }

  /* Se obtiene el valor ingresado en el componente y se le pasa a la función para renderizar los datos */
  getNameValue(value: string) {
    this.nameQuery = value   
    this.getMealByName(this.nameQuery)
  }

  /* Se filtran los datos por el nombre del platillo, puede ser desde 1 hasta varios */
  getMealByName(name: string) {
    this.title = `Resultado de la búsqueda: '${name}':`
    this.subtitle = ''
    this.mealsService.getMealByName(name)
      .pipe(
        catchError(error => { return throwError(() => error) }),
        tap((res: Meals[]) => {
          this.meal$ = res
          this.meal$ === null ? (this.dataNotFound = environment.notFound, this.dataStatus = environment.mealNameNotFoundText, this.title = '',
            this.divStatusClass = 'visible', this.subtitle = '') : (this.dataNotFound = '', this.dataStatus = '', this.divStatusClass = 'hide')    
          
          this.formatIngredientsList()
        })
      )
      .subscribe()
  }

  /* Inyecta la lista de ingredientes y cantidades en un array para darles formato */
  formatIngredientsList() {
    this.meal$.forEach((meal: any) => {
      for (let i = 1; i <= 20; i++) {   
        if (meal[`strIngredient${i}`]) {
          this.ingredients$.push(`${meal[`strIngredient${i}`]}: ${meal[`strMeasure${i}`]}`)
        } else { break }
      }
    });
  }  

  /* Manda el parámetro correspondiente a la ruta de acuerdo al botón que se haya seleccionado */
  getAreaDetails(param: string) {
    this.router.navigate([`regions/list-by-region`], { queryParams: { r: `${param}` } })
  }
  getCategoryDetails(param: string) {
    this.router.navigate([`categories/list-by-category`], { queryParams: { c: `${param.toLowerCase()}` } })
  }
}