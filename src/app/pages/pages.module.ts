import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MealsComponent } from './meals/meals.component';
import { CategoriesComponent } from './categories/categories.component';
import { AreasComponent } from './areas/areas.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { HttpClientModule } from '@angular/common/http';
import { MealComponent } from './meals/meal/meal.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
/* Angular Material */
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatCardModule } from '@angular/material/card'




@NgModule({
  declarations: [
    MealsComponent,
    MealComponent,
    IngredientsComponent,
    CategoriesComponent,
    AreasComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    MatPaginatorModule,
    MatCardModule
  ], 
  exports: [
    MealsComponent,
    CategoriesComponent,
    AreasComponent,
    IngredientsComponent
  ]
})
export class PagesModule { }
