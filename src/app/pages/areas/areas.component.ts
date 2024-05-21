import { Component, OnInit } from '@angular/core';
import { AreasService } from './service/areas.service';
import { catchError, tap, throwError } from 'rxjs';
import { Area, MealByArea } from './interface/area';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrl: './areas.component.scss'
})
export class AreasComponent implements OnInit {

  areas$: Area[] = []
  mealsByArea$: MealByArea[] = []
  countries$: string[] = []
  country!: string

  backBtnClass: string = 'hide'
  title!: string
  flagsPath: string =  `${environment.flagsPath}`

  constructor(private readonly areaService: AreasService, private readonly router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    /* Se obtiene el valor del parámetro 'r (región)' de la ruta, si es que existe */
    this.route.queryParams.subscribe(params => { this.country = params['r'] })
    this.getAreasList()
  }

  /* Se obtiene la lista de areas y se le asigna la imagen correspondiente a su bandera */
  getAreasList() {
    this.title = 'Lista de recetas agrupadas por región:'
    this.route.queryParams.subscribe(params => { this.country = params['r'] })
    if(this.country == undefined || this.country == '' || this.country == null ) {
      this.backBtnClass = 'hide'
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
    this.title = `Lista de las recetas de origen: '${param}'`
    this.router.navigate([`regions/list-by-region`], { queryParams: { r: `${param}` } })
    this.backBtnClass = 'visible'
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
    this.router.navigate(['recipes/list-by-name'], { queryParams: { n: `${param.toLowerCase()}` } })
  }
}