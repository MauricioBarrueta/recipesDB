import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { IngredientsService } from './service/ingredients.service';
import { catchError, tap, throwError } from 'rxjs';
import { Ingredients } from './interface/ingredients';
import { environment } from '../../../environments/environment';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrl: './ingredients.component.scss'
})
export class IngredientsComponent implements OnInit, AfterContentChecked {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator

  constructor(private readonly ingredientsService: IngredientsService, private changeDetector: ChangeDetectorRef) {}

  ingredientsList$: Ingredients[] = []
  length!: number
  pageIndex: number = 0;
  pageSize: number = 30;

  title!: string
  thumbPath: string = `${environment.thumbnailPath}`

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges()
  }
  ngOnInit(): void {
    this.getIngredientsList()
    this.paginator._intl.itemsPerPageLabel = `\u{f0cb} Elementos por página: `    
    this.length = this.ingredientsList$.length
  }

  /* Se obtiene la lista de todos los ingredientes y se dividen en páginas usando el componente 'mat-paginator' de Angular Material */
  getIngredientsList() {
    this.title = 'Lista de todos los ingredientes utilizados en las recetas:'
    this.ingredientsService.getIngredientsList()
      .pipe(
        catchError(error => { return throwError(() => error) }),
        tap((res: Ingredients[]) => {
          this.ingredientsList$ = res        
        })
      )
      .subscribe()
  }
}
