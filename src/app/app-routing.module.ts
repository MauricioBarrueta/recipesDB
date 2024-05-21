import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MealsComponent } from './pages/meals/meals.component';
import { MealComponent } from './pages/meals/meal/meal.component';
import { IngredientsComponent } from './pages/ingredients/ingredients.component';
import { AreasComponent } from './pages/areas/areas.component';
import { CategoriesComponent } from './pages/categories/categories.component';

const routes: Routes = [
  { path: '', redirectTo: 'recipes/random', pathMatch: 'full' },
  { path: 'recipes/random', component: MealComponent },
  { path: 'ingredients/list', component: IngredientsComponent },
  { path: 'regions/list', component: AreasComponent },
  { path: 'categories/list', component: CategoriesComponent },
  
  //* 1. Para que la ruta se muestre 'list-by-letter?l=a' en vez de 'list-by-letter/a' se coloca la ruta sin el parámetro (pasar a HeaderComponent para el paso 2)
  { path: 'recipes/list-by-letter', component: MealsComponent },
  { path: 'recipes/list-by-name', component: MealComponent }, 
  { path: 'categories/list-by-category', component: CategoriesComponent },
  { path: 'regions/list-by-region', component: AreasComponent },

  { path: '**', redirectTo: 'recipes/random', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
