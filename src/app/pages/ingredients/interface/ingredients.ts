export interface Ingredients {
    idIngredient: string
    strIngredient: string
    strDescription?: string
    strType?: string
}

export interface IngredientsResponse {
    meals: Ingredients[]
}