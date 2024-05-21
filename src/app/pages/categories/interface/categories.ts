export interface Categories {
    idCategory: string
    strCategory: string
    strCategoryThumb: string
    strCategoryDescription: string
}
export interface CategoriesRes {
    categories: Categories[]
}

export interface MealsByCategory {
    strMeal: string
    strMealThumb: string
    idMeal: string
}
export interface MealsByCatRes {
    meals: MealsByCategory[]
}
