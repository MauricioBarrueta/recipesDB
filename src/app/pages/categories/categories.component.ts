import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoriesService } from './service/categories.service';
import { catchError, tap, throwError } from 'rxjs';
import { Categories, MealsByCategory } from './interface/categories';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { getPaginatorIntl } from '../../shared/paginator/paginator-intl';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrl: './categories.component.scss',
     providers: [
      { provide: MatPaginatorIntl, useFactory: getPaginatorIntl }
    ],
    standalone: false
})
export class CategoriesComponent implements OnInit{

  categories$: Categories[] = []
  mealsByCategory$: MealsByCategory[] = []
  category!: string

  title!: string
  imgPath: string = `${environment.imagesPath}`

  @ViewChild(MatPaginator) paginator!: MatPaginator
  pageIndex: number = 0
  pageSize: number = 10

  dataNotFound!: string
  dataStatus!: string

  mouseEnter: boolean = false

  constructor(private readonly catService: CategoriesService, private readonly router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => { this.category = params['c'] })
    this.getCategoriesList()
  }

  /* Se obtiene la lista de todas las categorías */
  getCategoriesList() {
    this.title = 'Lista de categorías'
    this.category = this.route.snapshot.queryParamMap.get('c') ?? ''

    if (!this.category) {
      this.catService.getCategoriesList()
        .pipe(
          tap((res: Categories[]) => {
            this.categories$ = res
          })
        )
        .subscribe({
          error: error => this.handleCatError(error)
        })
    } else {
      this.getMealsByCategory(this.category)
    }
  }

  /* Obtiene las recetas pertenecientes a la categoría seleccionada. */
  getMealsByCategory(param: string) {
    this.category = param
    this.title = `Recetas de ${param}`

    this.router.navigate(['categories/list-by-category'], { queryParams: { c: param.toLowerCase() } })

    this.catService.getMealsByCategory(param)
      .pipe(
        tap((res: MealsByCategory[]) => {
          this.mealsByCategory$ = res
        })
      )
      .subscribe({
        error: error => this.handleCatError(error)
      })
  }

  private handleCatError(error: unknown): void {
    console.error('Error al obtener la receta:', error)

    this.dataNotFound = environment.notFound
    this.dataStatus = 'Ocurrió un error al cargar la receta. Inténtalo de nuevo.'
  }

  /* Se manda el parámetro a la ruta correspondiente para mostrar los detalles de la receta seleccionada */
  getMealDetails(param: string) {
    this.router.navigate(['recipes/list-by-name'], { queryParams: { n: `${param.toLowerCase()}` } })
  }

  get totalPages(): number {
    return Math.ceil(this.mealsByCategory$.length / this.pageSize)
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}