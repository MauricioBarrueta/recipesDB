export interface Area {
    strArea: string
}

export interface AreaResponse {
    meals: Area[]
}

export interface MealByArea {
    strMeal: string
    strMealThumb: string
    idMeal: string
}
export interface MealByAreaRes {
    meals: MealByArea[]
}