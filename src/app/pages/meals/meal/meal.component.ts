import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MealsService } from '../service/meals.service';
import { tap} from 'rxjs';
import { Meals } from '../interface/meals';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-meal, app-meals',
    templateUrl: './meal.component.html',
    styleUrl: '../meals.component.scss',
    standalone: false
})
export class MealComponent implements OnInit {

  meal$: Meals[] = []
  ingredients$: string[] = []
  recipeName!: string
  countryName!: string

  dataNotFound!: string
  dataStatus!: string

  title!: string
  subtitle!: string
  imgPath: string = `${environment.imagesPath}`
  flagsPath: string = `${environment.flagsPath}`

  mouseEnter: boolean = false
  
  constructor(private readonly mealsService: MealsService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    /* Se obtiene el valor del parámetro 'n (name)' de la ruta */
    this.route.queryParams.subscribe(params => { this.recipeName = params['n'] })    
    this.countryName = history.state.country /* Recupera el país recibido durante la navegación */

    this.getMealData() 
  }

  /* Se obtiene el valor ingresado en el componente y se le pasa a la función para renderizar los datos */
  getNameValue(value: string) {
    this.recipeName = value   
    this.getMealByName(this.recipeName)
  }

  /* Se muestra una receta aleatoria o la/las recetas que coincidan con el parámetro ingresado, si es que existe */  
  getMealData() {
    this.route.queryParams.subscribe(params => {
      this.recipeName = params['n']
    })

    if (!this.recipeName) {
      this.title = 'Receta aleatoria'
      this.subtitle = '¿Buscas alguna receta en particular? Escribe el nombre del platillo en el buscador, filtra por país o categoría, o utiliza las letras de abajo para explorar las recetas alfabéticamente'

      this.mealsService.getRandomMeal()
        .pipe(
          tap((res: Meals[]) => {
            this.meal$ = res
            this.dataStatus = ''
            this.dataNotFound = ''
            this.formatIngredientsList()
          })
        )
        .subscribe({
          error: error => this.handleMealError(error)
        })
    } else {
      this.getMealByName(this.recipeName)
    }
  }  

  /* Se filtran los datos por el nombre del platillo, puede ser desde 1 hasta varios */  
  getMealByName(name: string) {
    this.title = `Recetas que coinciden con "${name}"`
    this.subtitle = ''

    this.mealsService.getMealByName(name)   
      .pipe(
        tap((res: Meals[]) => {
          this.meal$ = res

          if (this.meal$ === null) {
            this.dataNotFound = environment.notFound
            this.dataStatus = environment.mealLoadErrorText
            this.title = ''
            this.subtitle = ''
          } else {
            this.dataNotFound = ''
            this.dataStatus = ''
            this.formatIngredientsList()
          }
        })
      )
      .subscribe({
        error: error => this.handleMealError(error)
      })
  } 

  private handleMealError(error: unknown): void {
    console.error('Error al obtener la receta:', error)

    this.dataNotFound = environment.notFound
    this.dataStatus = 'Ocurrió un error al cargar la receta. Inténtalo de nuevo.'
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