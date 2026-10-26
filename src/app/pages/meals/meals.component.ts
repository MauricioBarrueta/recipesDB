import { Component, OnInit } from '@angular/core';
import { MealsService } from './service/meals.service';
import { catchError, tap, throwError } from 'rxjs';
import { Meals } from './interface/meals';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-meals',
    templateUrl: './meals.component.html',
    styleUrl: './meals.component.scss',
    standalone: false
})
export class MealsComponent implements OnInit {

  constructor(private readonly mealsService: MealsService, private route: ActivatedRoute) {}

  meals$: Meals[] = []
  meal$: Meals[] = []
  ingredients$: string[] = []
  selectedLetter!: string

  dataNotFound: string = ''
  dataStatus: string = ''
  title!: string

  pageIndex: number = 0
  pageSize: number = 10

  imgPath: string = `${environment.imagesPath}`
  flagsPath: string = `${environment.flagsPath}`

  //* 3. Se recupera el valor del parámetro 'letter' y se asigna a una variable local para su posterior uso  
  ngOnInit(): void {   
    this.route.queryParams.subscribe(params => { this.selectedLetter = params['l'] });
    this.getMealsByLetter()
  }

   /* Se obtiene el valor del botón seleccionado procedente del componente Header */
  getButtonValue(value: string) {
    this.selectedLetter = value
    this.getMealsByLetter()
  }

  /* Se filtran los resultados de acuerdo a la letra del alfabeto seleccionada */
  getMealsByLetter() {
    this.title = `Recetas con la letra ${this.selectedLetter}`
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

    this.mealsService.getMealsByLetter(this.selectedLetter)
      .pipe(
        tap((res: Meals[]) => {
          this.meals$ = res

          if (res === null || res.length === 0) {
            this.dataNotFound = environment.notFound
            this.dataStatus = 'No hay recetas disponibles para esta letra'
            this.title = ''
          } else {
            this.dataNotFound = ''
            this.dataStatus = ''
          }
        })
      )
      .subscribe({
        error: (error: unknown) => {
          this.handleMealError(error)
          this.title = ''
        }
      })
  } 

  /* Obtiene el ID de la receta y prepara los ingredientes y sus medidas. */
  getSelectedMealId(id: string) {
    this.ingredients$ = []

    this.mealsService.getMealDetailsById(id)
      .pipe(
        tap((res: Meals[]) => {
          this.meal$ = res

          this.meal$.forEach((meal: Meals) => {
            for (let i = 1; i <= 20; i++) {
              if (meal[`strIngredient${i}` as keyof Meals]) {
                this.ingredients$.push(
                  `${meal[`strIngredient${i}` as keyof Meals]}: ${meal[`strMeasure${i}` as keyof Meals]}`
                )
              } else {
                break
              }
            }
          })
        })
      )
      .subscribe({
        error: (error: unknown) => {
          this.handleMealError(error)
        }
      })
  }

  private handleMealError(error: unknown): void {
    console.error('Error al obtener la receta:', error)

    this.meals$ = []
    this.title = ''
    this.dataNotFound = environment.notFound
    this.dataStatus = 'Ocurrió un error al cargar las recetas. Inténtalo de nuevo'
  }

  get totalPages(): number {
    return Math.ceil(this.meals$.length / this.pageSize)
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