// Define shared types for the application

export interface Ingredient {
  item: string;
  quantity: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  sellPrice: number; // Included for data structure consistency, though not displayed everywhere
  recipe: Ingredient[];
  recipeCategory: string;
  source: string;
  favouriteOf?: string;
  cooked: boolean;
  gifted: boolean;
}

// Type for storing status in localStorage, used in +page.svelte
export interface RecipeStatus {
  cooked: boolean;
  gifted: boolean;
}
export type AllRecipeStatuses = Record<string, RecipeStatus>;
