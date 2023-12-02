import { Injectable } from '@angular/core';
import { IngredientsService, FormulaType, SortCategory, SortMode, IngredientCount} from './ingredients.service';
import { RecipeService } from './recipe.service';


/** holds the settings and some user entered data for ingredients */
interface Data {
  ingredients: IngredientCount[],
  selectedFormula: FormulaType,
  selectedQuality: string,
  selectedSort: string,
  target: number,
  ingredCount: number,
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
    public ingredientsService: IngredientsService,
    public recipeService: RecipeService
  ) { }

  /** Saves user settings and inventory counts. */
  saveData() {
    const ingredients: IngredientCount[] = this.ingredientsService.ingredients.map(x => ({
      name: x.name,
      Avail: x.Avail,
    })); // Backwards compatibility, used to save as IngredientStats.
    console.log(ingredients);
    const data: Data = {
      sortMode: this.ingredientsService.sortMode,
      sortMode2: this.ingredientsService.sortMode2,
      filter: this.ingredientsService.filter,
      ingredients: ingredients,
      ingredCount: this.recipeService.ingredCount,
      target: this.recipeService.maxMagamin,
      selectedFormula: this.recipeService.selectedFormula,
      selectedQuality: this.recipeService.selectedQuality,
      selectedSort: this.recipeService.selectedSort,
      shopBonus: this.recipeService.shopBonus,
      traits: this.recipeService.traits,
      illusion: this.recipeService.illusion
    }
    console.log(data.selectedQuality)
    console.log(this.recipeService.selectedQuality)
    window.localStorage.setItem("AvailableIngredients", JSON.stringify(data))
  }

  /** Loads settings and inventory counts. */
  loadData() {
    const str = window.localStorage.getItem("AvailableIngredients");
    if (!this.ingredientsService.ingredients.length || this.ingredientsService.ingredients.length < 2) {
      this.ingredientsService.parseTSV()
    }
    if (str) {
      const data = JSON.parse(str) as Data;

      this.ingredientsService.ingredients.forEach(ingredient => {
        const index = data.ingredients.find(x => x.name === ingredient.name);
        ingredient.Avail = index ? index.Avail : 0;
      }); 
      this.ingredientsService.sortMode2 = data.sortMode2 || { category: SortCategory.None, descending: false };
      this.ingredientsService.sortMode = data.sortMode || { category: SortCategory.None, descending: false };
      this.ingredientsService.filter = data.filter || false;
      this.ingredientsService.ingredientSort(this.ingredientsService.sortMode2); // Secondary sorts first.
      this.ingredientsService.ingredientSort(this.ingredientsService.sortMode);

      this.recipeService.selectedFormula = data.selectedFormula || 0;
      this.recipeService.selectedQuality = data.selectedQuality || "Perfect";
      this.recipeService.selectedSort = data.selectedSort || "Profit";
      this.recipeService.maxMagamin = data.target || 375;
      this.recipeService.ingredCount = data.ingredCount || 8;
      this.recipeService.traits = data.traits || [false, false, false, false, false];
      this.recipeService.illusion = data.illusion || 0;
      this.recipeService.shopBonus = data.shopBonus || 0;
      this.recipeService.updateFormula();
    } else {
      this.recipeService.selectedFormula = 0;
      this.recipeService.maxMagamin = 375;
      this.recipeService.ingredCount = 8;
      this.recipeService.traits = [false, false, false, false, false]
      this.recipeService.shopBonus = 0;
    }
    this.ingredientsService.enumerateWeekRarity();
  }

  /** Removes all settings. */
  clearData() {
    window.localStorage.removeItem("AvailableIngredients");
    this.loadData();
  }

}