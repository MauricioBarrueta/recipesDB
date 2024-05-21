import { Component, OnInit } from '@angular/core';
import { CategoriesService } from './service/categories.service';
import { catchError, tap, throwError } from 'rxjs';
import { Categories, MealsByCategory } from './interface/categories';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit{

  categories$: Categories[] = []
  mealsByCategory$: MealsByCategory[] = []
  category!: string
  backBtnClass: string = 'hide'

  title!: string
  imgPath: string = `${environment.imagesPath}`

  constructor(private readonly catService: CategoriesService, private readonly router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => { this.category = params['c'] })
    this.getCategoriesList()
  }

  /* Se obtiene la lista de todas las categorías */
  getCategoriesList() {
    this.title = 'Lista de recetas agrupadas por categoría:'
    this.route.queryParams.subscribe(params => { this.category = params['c'] })
    if (this.category == undefined || this.category == null || this.category == '') {
      this.backBtnClass = 'hide'
      this.catService.getCategoriesList()
      .pipe(
        catchError(error => { return throwError(() => error) }),
        tap((res: Categories[]) => {
          this.categories$ = res
        })
      )
      .subscribe()
    } else {
      this.getMealsByCategory(this.category)
    }    
  }

  /* Se obtiene las lista de todas las recetas pertenecientes a la categoría seleccionada */
  getMealsByCategory(param: string) {
    this.title = `Lista de las recetas pertenecientes a la categoría: '${param}'`
    this.router.navigate([`categories/list-by-category`], { queryParams: { c: `${param.toLowerCase()}` } })
    this.backBtnClass = 'visible'
    this.catService.getMealsByCategory(param)
      .pipe(
        catchError(error => { return throwError(() => error) }),
        tap((res: MealsByCategory[]) => {
          this.mealsByCategory$ = res
        })
      )
      .subscribe()
  }

  /* Se manda el parámetro a la ruta correspondiente para mostrar los detalles de la receta seleccionada */
  getMealDetails(param: string) {
    this.router.navigate(['recipes/list-by-name'], { queryParams: { n: `${param.toLowerCase()}` } })
  }
}