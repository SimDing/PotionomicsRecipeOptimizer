import { Injectable } from '@angular/core';
import { IngredientsService, IngredientStats, FormulaType, SortCategory, Sort} from './ingredients.service';
import { MainLoopService } from './main-loop.service';
import { RecipeService } from './recipe.service';


/** holds the settings and some user entered data for ingredients */
interface Data {
  ingredients: IngredientStats[],
  selectedFormula: FormulaType,
  target: number,
  ingredCount: number,
  sortMode: Sort,
  filter: boolean,
  traits: boolean[],
  illusion: number 
  shopBonus: number
}



/** Contains everything from settings to the main combination methods and all related members. */
@Injectable({
  providedIn: 'root'
})
export class DataService {


  constructor(
    public mainLoopService: MainLoopService,
    public ingredientsService: IngredientsService,
    public recipeService: RecipeService
  ) { }

  /** Saves user settings and inventory counts. */
  saveData() {
    const data: Data = {
      sortMode: this.ingredientsService.sortMode,
      filter: this.ingredientsService.filter,
      ingredients: this.ingredientsService.ingredients,
      ingredCount: this.recipeService.ingredCount,
      target: this.recipeService.target,
      selectedFormula: this.recipeService.selectedFormula,
      shopBonus: this.recipeService.shopBonus,
      traits: this.recipeService.traits,
      illusion: this.recipeService.illusion
    }
    window.localStorage.setItem("AvailableIngredients", JSON.stringify(data))
  }

  /** Loads settings and inventory counts. */
  loadData() {
    const str = window.localStorage.getItem("AvailableIngredients");
    if (!this.ingredientsService.ingredients.length || this.ingredientsService.ingredients.length < 2) {
      this.ingredientsService.parseCSV()
    }
    if (str) {
      const data = JSON.parse(str) as Data;
      this.recipeService.selectedFormula = data.selectedFormula || 0;
      this.recipeService.target = data.target || 375;
      this.recipeService.ingredCount = data.ingredCount || 8;
      this.ingredientsService.ingredients = data.ingredients || [];
      this.ingredientsService.sortMode = data.sortMode || { category: SortCategory.Name, descending: false };
      this.ingredientsService.filter = data.filter || false;
      this.recipeService.traits = data.traits || [false, false, false, false, false];
      this.recipeService.illusion = data.illusion || 0;
      this.recipeService.shopBonus = data.shopBonus || 0;
      this.recipeService.updateFormula();
    } else {
      this.recipeService.selectedFormula = 0;
      this.recipeService.target = 375;
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