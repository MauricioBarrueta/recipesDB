import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { IngredientsService } from './service/ingredients.service';
import { Ingredients } from './interface/ingredients';
import { environment } from '../../../environments/environment';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { getPaginatorIntl } from '../../shared/paginator/paginator-intl';

@Component({
    selector: 'app-ingredients',
    templateUrl: './ingredients.component.html',
    styleUrl: './ingredients.component.scss',
    providers: [
      { provide: MatPaginatorIntl, useFactory: getPaginatorIntl }
    ],
    standalone: false
})
export class IngredientsComponent implements OnInit, AfterContentChecked {

  constructor(private readonly ingredientsService: IngredientsService, private changeDetector: ChangeDetectorRef) {}

  ingredientsList$: Ingredients[] = []

  @ViewChild(MatPaginator) paginator!: MatPaginator
  length!: number
  pageIndex: number = 0;
  pageSize: number = 15;

  title!: string
  thumbPath: string = `${environment.thumbnailPath}`
  imgPath: string = `${environment.imagesPath}`

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges()
  }

  ngOnInit(): void {
    this.getIngredientsList()
    this.length = this.ingredientsList$.length
  }

  /* Se obtiene la lista de todos los ingredientes y se dividen en páginas usando el componente 'mat-paginator' de Angular Material */
  getIngredientsList() {
    this.title = 'Lista de ingredientes'

    this.ingredientsService.getIngredientsList()
      .subscribe({
        next: (res: Ingredients[]) => {
          this.ingredientsList$ = res
        },
        error: (error) => {
          console.error('Error al obtener los ingredientes:', error)
        }
      })
  }

  get totalPages(): number {
    return Math.ceil(this.ingredientsList$.length / this.pageSize)
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
