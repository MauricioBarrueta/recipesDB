import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MealsComponent } from './meals/meals.component';
import { CategoriesComponent } from './categories/categories.component';
import { AreasComponent } from './areas/areas.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MealComponent } from './meals/meal/meal.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
/* Angular Material */
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatIconModule } from '@angular/material/icon'
import { PaginatorComponent } from '../shared/paginator/paginator.component';




@NgModule({
    declarations: [
        MealsComponent,
        MealComponent,
        IngredientsComponent,
        CategoriesComponent,
        AreasComponent,
        HeaderComponent,
        PaginatorComponent
    ],
    exports: [
        MealsComponent,
        CategoriesComponent,
        AreasComponent,
        IngredientsComponent,
        PaginatorComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MatPaginatorModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule
    ], 
    providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class PagesModule { }
