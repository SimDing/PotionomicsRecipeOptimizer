import { Injectable } from '@angular/core';
import { IngredientsService, FormulaType } from './ingredients.service';
import { SortCategory, SortMode, SortingService } from './sorting.service';
import { RecipeService } from './recipe.service';


/** holds the settings and some user entered data for ingredients */
interface Data {
  ingredients: Record<string, number>,
  selectedFormula: FormulaType,
  selectedQuality: string,
  selectedSort: string,
  target: number,
  ingredSelection: number,
  sortMode: SortMode,
  sortMode2: SortMode,
  filter: boolean,
  traits: boolean[],
  illusion: number,
  shopBonus: number,
}


/** Contains everything from settings to the main combination methods and all related members. */
@Injectable({
  providedIn: 'root'
})
export class DataService {


  constructor(
    public sortingService: SortingService,
    public ingredientsService: IngredientsService,
    public recipeService: RecipeService
  ) { }

  /** Saves user settings and inventory counts. */
  saveData() {
    const ingredients: Record<string, number> = {}

    for (const ingredient of this.ingredientsService.ingredientNames) {
      if (this.ingredientsService.ingredientAvailability[ingredient] > 0) {
        ingredients[ingredient] = this.ingredientsService.ingredientAvailability[ingredient];
      }
    }
    const data: Data = {
      sortMode: this.sortingService.sortMode,
      sortMode2: this.sortingService.sortMode2,
      filter: this.sortingService.filter,
      ingredients: ingredients,
      ingredSelection: this.recipeService.ingredientSelection,
      target: this.recipeService.maxMagamin,
      selectedFormula: this.recipeService.selectedFormula,
      selectedQuality: this.recipeService.selectedQuality,
      selectedSort: this.recipeService.selectedSort,
      shopBonus: this.recipeService.shopBonus,
      traits: this.recipeService.traits,
      illusion: this.recipeService.illusion
    }
    window.localStorage.setItem("AvailableIngredients", JSON.stringify(data))
  }

  /** Loads settings and inventory counts. */
  loadData() {
    const str = window.localStorage.getItem("AvailableIngredients");

    let data = undefined;

    if (str) { // Corruption catcher
      try {
        data = JSON.parse(str) as Data;
      } catch (error) {
        if (error instanceof Error)
          console.error('Error parsing JSON:', error.message);
      }
    }
    if (data) {
      for (const ingredient of this.ingredientsService.ingredientNames) {
        if (!(data.ingredients[ingredient] > 0)) {
          this.ingredientsService.ingredientAvailability[ingredient] = 0;
        } else {
          this.ingredientsService.ingredientAvailability[ingredient] = data.ingredients[ingredient];
        }
      }

      this.sortingService.sortMode2 = data.sortMode2 || { category: SortCategory.Total, descending: false };
      this.sortingService.sortMode = data.sortMode || { category: SortCategory.Location, descending: false };
      this.sortingService.filter = data.filter || false;

      this.recipeService.selectedFormula = data.selectedFormula || 0;
      this.recipeService.selectedQuality = data.selectedQuality || "Perfect";
      this.recipeService.selectedSort = data.selectedSort || "Profit";
      this.recipeService.maxMagamin = data.target || 375;
      this.recipeService.ingredientSelection = data.ingredSelection || 9;
      this.recipeService.ingredCount = data.ingredSelection || 9;
      this.recipeService.traits = data.traits || [false, false, false, false, false];
      this.recipeService.illusion = data.illusion || 0;
      this.recipeService.shopBonus = data.shopBonus || 0;

    } 
    this.sortingService.ingredientSort(this.sortingService.sortMode2); // Secondary sorts first.
    this.sortingService.ingredientSort(this.sortingService.sortMode);
  }

  /** Removes all settings. */
  clearData() {
    window.localStorage.removeItem("AvailableIngredients");
    this.loadData();
  }

}