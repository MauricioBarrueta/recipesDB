import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AreasService } from './service/areas.service';
import { catchError, tap, throwError } from 'rxjs';
import { Area, MealByArea } from './interface/area';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { getPaginatorIntl } from '../../shared/paginator/paginator-intl';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';

@Component({
    selector: 'app-areas',
    templateUrl: './areas.component.html',
    styleUrl: './areas.component.scss',
    providers: [
      { provide: MatPaginatorIntl, useFactory: getPaginatorIntl }
    ],
    standalone: false
})
export class AreasComponent implements OnInit, AfterContentChecked {

  areas$: Area[] = []
  mealsByArea$: MealByArea[] = []
  countries$: string[] = []
  country!: string

  title!: string
  flagsPath: string =  `${environment.flagsPath}`
  countryFlag!: string
  hoveredCountry: string | null = null

  @ViewChild(MatPaginator) paginator!: MatPaginator
  pageIndex: number = 0
  pageSize: number = 30
  recIndex: number = 0
  recPageSize: number = 10

  searchCountry: string = ''
  sortOrder: 'asc' | 'desc' = 'asc'

  mouseEnter: boolean = false

  constructor(private readonly areaService: AreasService, private readonly router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}
  
  ngOnInit(): void {
    /* Se obtiene el valor del parámetro 'r (región)' de la ruta, si es que existe */
    this.route.queryParams.subscribe(params => { this.country = params['r'] })
    this.getAreasList()

    console.log(this.country)
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges()
  }

  /* Se obtiene la lista de areas y se le asigna la imagen correspondiente a su bandera */
  getAreasList() {
    this.title = 'Recetas por país'
    this.route.queryParams.subscribe(params => { this.country = params['r'] })

    if(this.country == undefined || this.country == '' || this.country == null ) {
      this.areaService.getCountriesList()
      .pipe(
        catchError(error => { return throwError(() => error) }),
        tap((res: Area[]) => {
          this.areas$ = res 
                        
          //* Se inyectan los nombres de los países para posteriormente asignar la imagen correspondiente a cada uno
          for (let i = 0; i < this.areas$.length; i++) {
            this.countries$.push(this.areas$[i].strArea)            
          }          
        })
      )
      .subscribe()
    } else {
      this.getMealsByArea(this.country)
    }    
  }

  /* Se obtienen el/los platillos que coincidan con el país de origen */
  getMealsByArea(param: string) {
    this.title = `Recetas de ${param}`
    this.router.navigate([`regions/list-by-region`], { queryParams: { r: `${param}` } })

    this.areaService.getMealsByCountry(param)
      .pipe(
        catchError(error => { return throwError(() => error) }),
        tap((res: MealByArea[]) => {
          this.mealsByArea$ = res
        })
      )
      .subscribe()
  }

  /* Se manda el parámetro a la ruta correspondiente para mostrar los detalles de la receta seleccionada */
  getMealDetails(param: string) {
    this.router.navigate(['recipes/list-by-name'], { 
      queryParams: { n: `${param.toLowerCase()}` },
      state: { country:  this.country } /* Se manda el nombre del país sin mostrarlo en la URL */
    })
  }

  /* Filtra y ordena la lista de países según la búsqueda y el orden seleccionado */
  get filteredAreas() {
    const search = this.searchCountry.trim().toLowerCase()
    
    return this.areas$
      .filter(flag => flag.strCountry.toLowerCase().includes(search))
      .sort((a, b) => {
        const result = a.strCountry.localeCompare(b.strCountry)
        return this.sortOrder === 'asc' ? result : -result
      })
  }

  /* Reinicia la paginación al buscar para mostrar los resultados desde la primera página */
  onSearchCountryChange(): void {
    this.pageIndex = 0

    if (this.paginator) {
      this.paginator.firstPage()
    }
  }

  get totalAreaPages(): number {
    return Math.ceil(this.filteredAreas.length / this.pageSize)
  }

  get totalRecipePages(): number {
    return Math.ceil(this.mealsByArea$.length / this.recPageSize)
  }

  onAreaPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  onRecipePageChange(event: PageEvent): void {
    this.recIndex = event.pageIndex
    this.recPageSize = event.pageSize

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}